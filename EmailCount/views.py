import mimetypes
import os

from django.shortcuts import render
from django.http import HttpResponse, HttpResponseNotFound
import SendMail
from EmailCount.models import Posttable
from test import *
from Print_Stikers import *
# from dbServer.models import *
from django.http import JsonResponse
import json
import io
from django.http import FileResponse
from django.core.files.base import ContentFile

# Create your views here.
def emailmainCourt(request):
    info = query_db("select * from private.universal_mailing u where u.type_mailing = 'Email'")
    # return render(request, 'EmailCount/mail.html', {'title': "main", 'Companies': info})
    caadr = json.dumps(info, ensure_ascii=False)
    return JsonResponse(caadr, safe=False, json_dumps_params={'ensure_ascii': False})

# todo добавить добавление и удаление из рассылки

# def emailSend(request):
#     # val = ''
#     # if request.GET: # получаю то какая рассылка
#     #     for key, value in request.GET.items():
#     #        val = value
#     # tmp = Posttable.objects.get(pattern = val)
#     # Sender ={}
#     # Sender['mail'] = Mails.objects.get(id = tmp[id_mails])[mail] # таблица с какой почты писать
#     # Sender['pass'] = Mails.objects.get(id = tmp[id_mails])[password]
#     # # нужно получить данные из инн фирмы. получаем инн обращение фио почту
#     #
#     # tmp = Companies.objects.filter(ITN = )
#     recipients = []
#     title = "no name"
#     body = "автоматическая рассылка"
#     for key, value in request.GET.items():
#         if key == 'emale':
#             recipients.append(value)
#         elif key == 'Pattern':
#             title = value
#             body = "На данный момент не получаем шаблона письма"
#             # передает тему сообщения и берет из таблицы сообщений шаблон
#     if recipients:
#         SendMail.sendMail(recipients, title, body)
from django.views.decorators.csrf import csrf_exempt
@csrf_exempt
def emailinfo(request):
    info = []
    info2=[]
    head = ['Наименование','ИНН', 'Юр.Адресс']
    template = 0
    type_mailing = 0
    obj = {}
    if request.body:
        obj = json.loads(request.body)
    if 'id_mailing' in obj.keys():
            tmp = obj['id_mailing']
            # вывод тех компаний которых нет в рвссылке
            info=(query_db("select inn_company, company_name, legal_address from private.companies \
                             where  id not in (select mc.id_company from private.mailing \
                            join private.mailing_companies mc on mailing.id = mc.id_mailing \
                            join private.universal_mailing um on mailing.id_type_mailing=um.id \
                            join private.templates t on mailing.id_template = t.id \
                            where um.id = %s) ", (tmp,))) # TODO добавить изменяеммую рассылку
            # поиск тех кто есть в рвссылке
            info2=(query_db("select inn_company,company_name, legal_address from private.companies \
                             where id in (select mc.id_company from private.mailing \
                            join private.mailing_companies mc on mailing.id = mc.id_mailing \
                            join private.universal_mailing um on mailing.id_type_mailing=um.id \
                            join private.templates t on mailing.id_template = t.id \
                            where um.id = %s)",(tmp,)))  # TODO добавить изменяеммую рассылку
            dict = {'notInMailing': info, 'inMailing': info2}
            caadr = json.dumps(dict, ensure_ascii=False) + json.dumps(info2, ensure_ascii=False)
            return JsonResponse(caadr, safe=False, json_dumps_params={'ensure_ascii': False})
    return JsonResponse({'status': 'false'}, status=500)





@csrf_exempt
def SendEmail(request):
    obj = {}
    if request.body:
        obj = json.loads(request.body)
    recipients = []
    for i in obj:
        tmp = i[0].split(",")
        if tmp[0] != 'on':
            info = (query_db("select mc.id_company from private.mailing_companies mc where id_mailing = %s", (tmp[0],)))  # TODO получить информацию фио почту и остальное о человеке
        for companyId in info:
            recipients.append(query_db("select legal_address, mail, fio_head  from private.companies where id = %s", (str(companyId['id_company']),)))
        recipients.append(info.mail, info.name, info.addres)
        # записываем в форму информацию о людях

    if recipients:
        err = SendMail.sendMail(recipients)
    return JsonResponse({'status': 'True'}, status=200)



@csrf_exempt
def addTarget(request):
    obj = json.loads(request.body)
    id_company=[]
    j=0
    for i in obj:
        id_company.append(((int(i['check_'+str(j)][0].split(",")[0])), int(i['check_'+str(j)][0].split(", ")[1])))
        #id_company.append()
        j+=1
    query = "insert into private.mailing_companies values " + ",".join("(%s, %s)" for i in id_company)

    flattened_values = [item for sublist in id_company for item in sublist]
    Insert_db(query, flattened_values)
    return JsonResponse({'status': 'True'}, status=200)

@csrf_exempt
def removeTarget(request):
    obj = json.loads(request.body)
    j=0
    id_company=[]
    for i in obj:
        id_company.append(int(i['check_'+str(j)][0].split(",")[0]))
        type_mailing = i['check_'+str(j)][0].split(", ")[1]
        j += 1

    query = "DELETE FROM private.mailing_companies WHERE id_company IN ({}) AND id_mailing = %s".format(
        ','.join(['%s'] * len(id_company)))
    Insert_db(query, id_company + [type_mailing])

    return JsonResponse({'status': 'True'}, status=200)


@csrf_exempt
def createLabels(request):
    obj = json.loads(request.body)
    recipients = []
    for i in obj:
        tmp = i[0].split(",")
        if tmp[0] != 'on':
            info = (query_db("select mc.id_company from private.mailing_companies mc where id_mailing = %s",
                             (tmp[0],)))  # TODO получить информацию фио почту и остальное о человеке
        for companyId in info:
            recipients.append(query_db("SELECT name, legal_address, position_head_dc, full_name_manager_dc, index \
            FROM defendants \
            WHERE inn = %s;", (str(companyId['id_company']),)))
    data = recipients
    # Откройте файл с шаблоном
    template_doc = DocxTemplate("tes.docx")
    dock = Document()
    dock.save("generated_nakleiki.docx")
    # Создайте и добавьте наклейки на основе данных
    for i in range (0,len(data), 2) :

            context = {'name1': data[i][0]['name']+data[i][0]['position_head_dc']+ data[i][0]['full_name_manager_dc'], 'address1': data[i][0]['legal_address'],
                       'number1': i, 'index1': data[i][0]['index']}
            if(i+1 < len(data)):
                context.update({'name2': data[i+1][0]['name'] + data[i+1][0]['position_head_dc'] + data[i+1][0]['full_name_manager_dc'],
                       'address2': data[i+1][0]['legal_address'], 'number2': i+1,
                       'index2': data[i+1][0]['index']})
            template_doc.render(context)

            template_doc.save("temp.docx")  # Сохраните шаблон с данными во временный файл
            # Откройте временный файл и скопируйте его содержимое в новый документ
            # temp_doc = Document("temp.docx")
            dock = Document_compose("generated_nakleiki.docx")  # куда хотим сохранить
            composer = Composer(dock)
            doc2 = Document_compose("temp.docx")
            composer.append(doc2)
            composer.save("generated_nakleiki.docx")
    excel_file_name = "generated_nakleiki.docx"
    fp = open(excel_file_name, "rb");
    response = HttpResponse(fp.read());
    fp.close();
    file_type = mimetypes.guess_type(excel_file_name);
    if file_type is None:
        file_type = 'application/octet-stream';
    response['Content-Type'] = file_type
    response['Content-Length'] = str(os.stat(excel_file_name).st_size);
    response['Content-Disposition'] = "attachment; filename=excel_file.xlsx";
    return response
 # ниже почта
def EmalePajemainCourt(request):
        show = Posttable.objects.filter(MailingType=2).values()
        data = []
        info = query_db("select * from private.universal_mailing u where u.type_mailing = 'Почта'")
        names = ["Наименование рассылки", "Шаблон", "Кол-во писем", "Дата создания", "Дата отправки", "Ответственный",
                 "Статус", "Привязанные контакты"]
        return render(request, 'EmailCount/mail.html', {'title': "main", 'Companies': info, 'names': names})


# ниже звонки
def Calsmain(request):
    info = query_db("select * from private.universal_mailing u where u.type_mailing = 'Звонки' ")
    names = ["Наименование рассылки", "Шаблон", "Кол-во контактов", "Дата создания", "Дата отправки", "Ответственный",
             "Статус", "Привязанные телефоны"]
    return render(request, 'CalsPage/page.html', {'title': "main", 'Companies': info, 'names': names})

# def Calsinfo(request, catid):
#     return HttpResponse(f"<h4>HelloWorld</h4><p>{catid}</p>")


# sms

def smsmainCourt(request):
    info = query_db("select * from private.universal_mailing u where u.type_mailing = 'СМС'") #TODO  where tm.type_mailing = 3
    names = ["Наименование рассылки", "Шаблон", "Кол-во писем", "Дата создания", "Дата отправки", "Ответственный",
             "Статус", "Привязанные контакты"]
    return render(request, 'sms/sms.html', {'title': "main", 'Companies': info, 'names': names})

