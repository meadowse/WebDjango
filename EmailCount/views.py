import mimetypes
import os
from xml.dom.minidom import Document
from docx.shared import Inches, Mm
# from docxcompose.composer import Composer
# from docx import Document as Document_compose
from django.shortcuts import render
from django.http import HttpResponse  # , HttpResponseNotFound
# import SendMail
# from EmailCount.models import Posttable
from test import *
from Print_Stikers import *
# from django.http import JsonResponse
import json
# import io
# from django.http import FileResponse
# from django.core.files.base import ContentFile
from django.views.decorators.csrf import csrf_exempt


# Create your views here.
@csrf_exempt
def emailmainCourt(request):
    # todo изменить рассылку и ее работу
    if (request.GET):
        emailSend(request)
    # show = Posttable.objects.filter(MailingType=2).values()
    # data = []
    info = query_db("select * from private.universal_mailing u where u.type_mailing = 'Email'")
    names = ["Наименование рассылки", "Шаблон", "Кол-во писем", "Дата создания", "Дата отправки", "Ответственный",
             "Статус", "Привязанные контакты"]
    return render(request, 'EmailCount/mail.html', {'title': "main", 'Companies': info, 'names': names})


@csrf_exempt
def emailinfo(request):
    info = []
    info2 = []
    print("emailinfo")
    head = ['Наименование', 'ИНН', 'Юр.Адресс']
    template = 0
    type_mailing = 0
    if request.POST:
        for i in request.POST:
            tmp = request.POST[i].split(",")
            template = tmp[1]
            type_mailing = tmp[0]
            # вывод тех компаний которых нет в рассылке
            info = (query_db("select inn_company, company_name, legal_address from private.companies \
                             where  id not in (select mc.id_company from private.mailing \
                            join private.mailing_companies mc on mailing.id = mc.id_mailing \
                            join private.universal_mailing um on mailing.id_type_mailing=um.id \
                            join private.templates t on mailing.id_template = t.id \
                            where um.id = %s) ", (tmp[0],)))  # TODO добавить изменяемую рассылку
            # поиск тех кто есть в рассылке
            info2 = (query_db("select inn_company,company_name, legal_address from private.companies \
                             where id in (select mc.id_company from private.mailing \
                            join private.mailing_companies mc on mailing.id = mc.id_mailing \
                            join private.universal_mailing um on mailing.id_type_mailing=um.id \
                            join private.templates t on mailing.id_template = t.id \
                            where um.id = %s)", (tmp[0],)))  # TODO добавить изменяемую рассылку

    return render(request, 'EmailCount/addInSender.html', {'title': "main", 'head': head, 'Companies': info,
                                                           'Companies2': info2, 'template': template,
                                                           'type_mailing': type_mailing})


@csrf_exempt
def SendEmail(request):
    obj = json.loads(request.body)
    recipients = []
    for i in obj:
        tmp = i[0].split(",")
        if tmp[0] != 'on':
            Info = (query_db("select mc.id_company from private.mailing_companies mc where id_mailing = %s", (tmp[0],)))
            # TODO получить информацию фио почту и остальное о человеке
            for companyId in Info:
                recipients.append(query_db("select legal_address, mail, fio_head  from private.companies where id = %s",
                                           (str(companyId['id_company']),)))
            recipients.append(Info.mail)
            recipients.append(Info.name)
            recipients.append(Info.addres)
        # записываем в форму информацию о людях

    # err = 0
    if recipients:
        # err = SendMail.sendMail(recipients)
    return HttpResponse(f"<h4>HelloWorld</h4><p>{{err}}</p>")


@csrf_exempt
def addTarget(request):
    obj = json.loads(request.body)
    print(obj)
    id_company = []
    j = 0
    for i in obj:
        id_company.append(((int(i['check_'+str(j)][0].split(",")[0])), int(i['check_'+str(j)][0].split(",")[1])))
        #  id_company.append()
        j += 1
    query = "insert into private.mailing_companies values " + ",".join("(%s, %s)" for i in id_company)

    flattened_values = [item for sublist in id_company for item in sublist]
    Insert_db(query, flattened_values)
    return HttpResponse(f"<h4>HelloWorld</h4><p>{{err}}</p>")


@csrf_exempt
def removeTarget(request):
    print(request.body)
    obj = json.loads(request.body)
    j = 0
    print(obj)
    id_company = []
    type_mailing = ''
    for i in obj:
        id_company.append(int(i['check_'+str(j)][0].split(",")[0]))
        print(i['check_'+str(j)][0][1])
        type_mailing = i['check_'+str(j)][0].split(",")[1]
        print(type_mailing)
        j += 1

    query = "DELETE FROM private.mailing_companies WHERE id_company IN ({}) AND id_mailing = %s".format(
        ','.join(['%s'] * len(id_company)))
    Insert_db(query, id_company + [type_mailing])

    return HttpResponse(f"<h4>HelloWorld</h4><p>{{err}}</p>")


# откуда что и куда хотим добавить в шаблонах
def createTempFile(template_doc, context, file_name):
    template_doc.render(context)
    template_doc.save("temp.docx")  # Сохраните шаблон с данными во временный файл
    dock = Document_compose(file_name)  # куда хотим сохранить
    composer = Composer(dock)
    doc2 = Document_compose("temp.docx")
    composer.append(doc2)
    composer.save(file_name)


# настройка отступов
def linesInDocx(document, file_name, top=0, down=0, left=0.0, right=0.0, height=297, width=210):
    section = document.sections[-1]
    section.top_margin = Inches(top)
    section.bottom_margin = Inches(down)
    section.left_margin = Inches(left)
    section.right_margin = Inches(right)
    section.page_height = Mm(height)
    section.page_width = Mm(width)
    document.save(file_name)


# передаем имя файла для скачивания
def printDocx(excel_file_name):
    with open(excel_file_name, "rb") as fp:
        response = HttpResponse(fp.read())
    file_type = mimetypes.guess_type(excel_file_name)
    if file_type is None:
        file_type = 'application/octet-stream'
    response['Content-Type'] = file_type
    response['Content-Length'] = str(os.stat(excel_file_name).st_size)
    response['Content-Disposition'] = "attachment; filename=excel_file.xlsx"
    return response


@csrf_exempt
def createLabels(request):
    obj = json.loads(request.body)
    recipients = []
    for i in obj:
        tmp = i[0].split(",")
        if tmp[0] != 'on':
            Info = (query_db("select mc.id_company from private.mailing_companies mc where id_mailing = %s",
                             (tmp[0],)))  # TODO получить информацию фио почту и остальное о человеке
            for companyId in Info:
                recipients.append(query_db("SELECT name, legal_address, position_head_dp, fio_dp, index FROM companies"
                                           " WHERE id = %s;", (str(companyId['id_company']),)))
    data = recipients
    # Откройте файл с шаблоном
    template_doc = DocxTemplate("tes.docx")
    document = Document()
    linesInDocx(document, "generated_nakleiki.docx")  # настройка отступов и генерация файла если его нет
    # Создайте и добавьте наклейки на основе данных
    for i in range(0, len(data), 2):
        context = {'name1': data[i][0]['position_head_dp'] + ' ' + data[i][0]['name'] + ' ' + data[i][0]['fio_dp'],
                   'address1': data[i][0]['legal_address'], 'number1': i + 1, 'index1': data[i][0]['index']}
        if i + 1 < len(data):
            context.update({
                'name2': data[i + 1][0]['position_head_dp'] + ' ' + data[i + 1][0]['name'] + ' ' + data[i + 1][0]['fio_dp'],
                'address2': data[i + 1][0]['legal_address'], 'number2': i + 2, 'index2': data[i + 1][0]['index']})
            createTempFile(template_doc, context, "generated_nakleiki.docx")  # склейка шаблонов
    return printDocx("generated_nakleiki.docx")  # отправка на скачивание файла


@csrf_exempt
def createLetters(request):
    obj = json.loads(request.body)  # читаем тело запроса
    recipients = []
    for i in obj:
        tmp = i[0].split(",")
        if tmp[0] != 'on':
            info = (query_db("select mc.id_company from private.mailing_companies mc where id_mailing = %s",
                             (tmp[0],)))  # TODO получить информацию фио почту и остальное о человеке
            for companyId in info:
                recipients.append(query_db(
                    "SELECT name, position_head_dp, fio_dp , io, appeal FROM companies WHERE id = %s;",
                    (companyId['id_company'],)))
    data = recipients
    # Откройте файл с шаблоном
    template_doc = DocxTemplate("templateForMail.docx")
    document = Document()
    linesInDocx(document, "MailsForSend.docx", 0, 0,  0.0, 0.0)  # настройка отступов и генерация файла если его нет
    # Создайте и добавьте наклейки на основе данных
    for i in range(0, len(data)):
        data[i][0]['i'] = i + 1
        createTempFile(template_doc, data[i][0], "MailsForSend.docx")  # склейка шаблонов
    return printDocx("MailsForSend.docx")  # отправка на скачивание файла


@csrf_exempt
def removeLine(request):
    print(request.body)
    obj = json.loads(request.body)
    j = 0
    print(obj)
    id_company = []
    for i in obj:
        id_company.append(int(i['check_' + str(j)][0].split(",")[0][0]))
        print(id_company)
        j += 1

    query = "DELETE FROM private.mailing WHERE id IN ({})".format(
        ','.join(['%s'] * len(id_company)))
    Insert_db(query, id_company)
    return HttpResponse(f"<h4>HelloWorld</h4><p>{{err}}</p>")
