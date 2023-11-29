import mimetypes
import os
from xml.dom.minidom import Document
from docx.shared import Inches, Mm
# from docxcompose.composer import Composer
# from docx import Document as Document_compose
from django.shortcuts import render
from django.http import HttpResponse, HttpResponseForbidden  # , HttpResponseNotFound
import SendMail
from EmailCount.models import Posttable
from test import *
from Print_Stikers import *
from dbServer.views import *
# from django.http import JsonResponse
import json
# import io
# from django.http import FileResponse
# from django.core.files.base import ContentFile
from django.views.decorators.csrf import csrf_exempt
from databaseConnect import *


# Create your views here.
@csrf_exempt
def emailmainCourt(request):
    # show = Posttable.objects.filter(MailingType=2).values()
    # data = []
    info = query_db("select * from private.universal_mailing u where u.type_mailing = 'Email'")
    # print(info)
    names = ["Наименование рассылки", "Шаблон", "Кол-во писем", "Дата создания", "Дата отправки", "Ответственный",
             "Статус", "Привязанные контакты"]
    Companies = query_db("select * from private.all_data_companies limit 10")
    newsleter = (query_db("select * from private.templates"))
    return render(request, 'EmailCount/mail.html', {'title': "main", 'mail': info, 'names': names,
                                                    'Companies': Companies, 'templateForSend': newsleter,
                                                    'types_mailing': '1'})


@csrf_exempt
def SendTestEmail(request):
    obj = json.loads(request.body)
    print(request.body)
    recipients = []
    for i in obj:
        print([i])
        err = SendMail.sendMail([[i]])
    print("D")
    return HttpResponse(f"<h4>HelloWorld</h4><p>{{err}}</p>")

@csrf_exempt
def SendEmail(request):
    try:
        obj = json.loads(request.body)
        recipients = []
        for i in obj:
            tmp = i[0].split(",")
            print(tmp)
            if tmp[0] != 'on':
                Info = (query_db("select mc.id_company from private.mailing_companies mc where id_mailing = %s", (tmp[0],)))
                # TODO получить информацию фио почту и остальное о человеке
                print("info = ", Info)
                for companyId in Info:
                    recipients.append(query_db("select legal_address, mail, fio_head  from private.companies where id = %s",
                                               (str(companyId['id_company']),)))
                print(recipients)
                # recipients.append(Info.mail)
                # recipients.append(Info.name)
                # recipients.append(Info.addres)
            # записываем в форму информацию о людях
        err = 0
        if recipients:
            err = SendMail.sendMail(recipients)
        print("D")
        return HttpResponse(f"<h4>HelloWorld</h4><p>{{err}}</p>")
    except:

        return HttpResponse("Forbidden")

@csrf_exempt
def addTarget(request):
    print(request.GET)
    obj = json.loads(request.body)
    print(obj)
    id_company = []
    j = 0
    for i in obj:
        print(int(i['check_' + str(j)][0].split(",")[0]))
        id_company.append(((int(i['check_' + str(j)][0].split(",")[0])), int(i['check_' + str(j)][0].split(",")[1])))
        #  id_company.append()
        j += 1
    query = "insert into private.mailing_companies values " + ",".join("(%s, %s)" for i in id_company)
    flattened_values = [item for sublist in id_company for item in sublist]
    Insert_db(query, flattened_values)
    return HttpResponse(f"<h4>HelloWorld</h4><p>{{err}}</p>")


@csrf_exempt
def removeTarget(request):
    obj = json.loads(request.body)
    j = 0
    id_company = []
    type_mailing = ''
    for i in obj:
        id_company.append(int(i['check_'+str(j)][0].split(",")[0]))
        type_mailing = i['check_'+str(j)][0].split(",")[1]
        j += 1
    print(id_company)
    print(type_mailing)
    query = "DELETE FROM private.mailing_companies WHERE id_company IN ({}) AND id_mailing = %s".format(','.join(['%s'] * len(id_company)))
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
                recipients.append(query_db("SELECT name, position_head_dp, fio_dp , io, appeal FROM companies "
                                           "WHERE id = %s;", (companyId['id_company'],)))
    data = recipients
    # Откройте файл с шаблоном
    template_doc = DocxTemplate("templateForMail.docx")
    document = Document()
    linesInDocx(document, "MailsForSend.docx")  # настройка отступов и генерация файла если его нет
    # Создайте и добавьте наклейки на основе данных
    for i in range(0, len(data)):
        print(data)
        data[i][0]['i'] = i + 1
        createTempFile(template_doc, data[i][0], "MailsForSend.docx")  # склейка шаблонов
    return printDocx("MailsForSend.docx")  # отправка на скачивание файла


@csrf_exempt
def removeLine(request):
    try:
        print(request.body)
        obj = json.loads(request.body)
        j = 0
        print(obj)
        id_company = []
        for i in obj:
            id_company.append(int(i['check_' + str(j)][0].split(",")[0]))
            print(id_company)
            j += 1
        query = "DELETE FROM private.mailing WHERE id IN ({})".format(','.join(['%s'] * len(id_company)))
        print(query)
        err = Insert_db(query, id_company)
        if err:
            return HttpResponseForbidden("Forbidden")
        return HttpResponse(f"<h4>HelloWorld</h4><p>{{err}}</p>")
    except:
        return HttpResponse("Forbidden")


def EmalePajeinfo(request, catid):
    rez1 = ("select * from private.all_data_companies a where a.inn_company::bigint not in (select mc.id_company "
            "from private.mailing_companies mc where mc.id_mailing = %s)" % catid)
    rez2 = ("select * from private.all_data_companies a where a.inn_company::bigint in (select mc.id_company "
            "from private.mailing_companies mc where mc.id_mailing = %s)" % catid)
    info = search(request, rez1)
    info2 = search(request, rez2)
    return render(request, 'sms/updateMailing.html', {'NotInNewsletter': info, 'InNewsletter': info2,
                                                      'template': catid, 'types_mailing': '1'})
