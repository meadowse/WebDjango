from django.shortcuts import render
from django.http import HttpResponse, HttpResponseNotFound
from django.shortcuts import render, redirect
# Create your views here.
from test import *
from EmailCount.models import Posttable
def Calsmain(request):
    info = query_db("select * from private.universal_mailing u where u.type_mailing = 'Звонки'")
    names = ["Наименование рассылки", "Шаблон", "Кол-во писем", "Дата создания", "Дата отправки", "Ответственный",
             "Статус", "Привязанные контакты"]
    Companies = query_db("select * from private.all_data_companies limit 10")
    newsleter = (query_db("select * from private.templates"))
    return render(request, 'CalsPage/page.html', {'title': "main", 'mail': info, 'names': names,
                                                    'Companies': Companies, 'templateForSend': newsleter, 'types_mailing':'4'})


def Calsinfo(request, catid):
    print(catid)
    info = (query_db("select id, inn_company,company_name, legal_address from private.companies \
                                    where id not in (select mc.id_company from private.mailing_companies mc \
                                   where mc.id_mailing = %s) limit 100",
                     (catid,)))  # TODO добавить изменяеммую рассылку

    # поиск тех кто есть в рвссылке
    info2 = (query_db("select id, inn_company,company_name, legal_address from private.companies \
                                    where id in (select mc.id_company from private.mailing_companies mc \
                                   where mc.id_mailing =%s )limit 100", (catid,)))  # TODO добавить изменяеммую рассылку

    return render(request, 'sms/updateMailing.html',
                  {'NotInNewsletter': info, 'InNewsletter': info2, 'template': catid})

