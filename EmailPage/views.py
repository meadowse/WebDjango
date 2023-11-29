from django.shortcuts import render
# from django.http import HttpResponse, HttpResponseNotFound
from EmailCount.models import Posttable
from test import *

from django.http import JsonResponse
# import json
# import cgi


# Create your views here.
def EmalePajemainCourt(request):
    show = Posttable.objects.filter(MailingType=2).values()
    data = []
    info = query_db("select * from private.universal_mailing u where u.type_mailing = 'Почта'")
    names = ["Наименование рассылки", "Шаблон", "Кол-во писем", "Дата создания", "Дата отправки", "Ответственный",
             "Статус", "Привязанные контакты"]
    Companies = query_db("select * from private.all_data_companies limit 10")
    newsleter = (query_db("select * from private.templates"))
    return render(request, 'EmailPage/post.html', {'title': "main", 'mail': info, 'names': names,
                                                   'Companies': Companies, 'newsleter': newsleter})


def EmalePajeinfo(request, catid):
    print(catid)
    info = (query_db("select id, inn_company,company_name, legal_address from private.companies \
                                 where id not in (select mc.id_company from private.mailing_companies mc \
                                where mc.id_mailing = %s)", (catid,)))  # TODO добавить изменяемую рассылку

    # поиск тех кто есть в рассылке
    info2 = (query_db("select id, inn_company,company_name, legal_address from private.companies \
                                 where id in (select mc.id_company from private.mailing_companies mc \
                                where mc.id_mailing = %s )", (catid,)))  # TODO добавить изменяемую рассылку

    return render(request, 'sms/updateMailing.html', {'title': "main", 'NotInNewsletter': info, 'InNewsletter': info2,
                                                      'template': catid})


def addNewNewssender(request):
    print(request.GET['name'])
    if request.GET:
        obj = request.GET
        Insert_db("insert into private.mailing (id_type_mailing, id_template, mailing_list_name, id_responsible) "
                  "values (2 , %s, %s, 10)", (obj['id'], obj['name']))
        info2 = (query_db("SELECT MAX(id) FROM private.mailing where id_type_mailing = 2"))

        return EmalePajeinfo(request, info2[0]['max'])
    return JsonResponse({'status': 'false'}, status=500)
