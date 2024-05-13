from time import perf_counter

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
# from django.http import HttpResponse, HttpResponseNotFound
from EmailCount.models import Posttable
from test import *
# from django.http import JsonResponse
# import json
# import cgi
# Create your views here.
from django.shortcuts import redirect, render
from databaseConnect import *


def EmalePajemainCourt(request):
    info = query_db("select * from private.universal_mailing u where u.type_mailing = 'Почта'")
    # names = ["Наименование рассылки", "Шаблон", "Кол-во писем", "Дата создания", "Дата отправки", "Ответственный",
    #          "Статус", "Привязанные контакты"]
    # Companies = query_db("select * from private.all_data_companies limit 10")
    newsleter = (query_db("select * from private.templates"))
    return render(request, 'EmailPage/post.html', {'title': "main", 'mail': info,
                                                   # 'names': names, 'Companies': Companies,
                                                   'templateForSend': newsleter, 'types_mailing': '2'})


@csrf_exempt
def EmalePajeinfo(request, catid):

    start = perf_counter()

    rez1 = ("select * from private.all_data_companies a where a.id not in (select mc.id_company "
            "from private.mailing_companies mc where mc.id_mailing = %s)" % catid)
    rez2 = ("select * from private.all_data_companies a where a.id in (select mc.id_company "
            "from private.mailing_companies mc where mc.id_mailing = %s)" % catid)
    Json = search(request, rez1)
    info = Json.get('Info')
    count = Json.get('count')

    endFirstStep = perf_counter()
    print('firstStep ' + str(endFirstStep - start))

    Json = search(request, rez2)

    endSecondStep = perf_counter()
    print('secondStep ' + str(endSecondStep - endFirstStep))

    info2 = Json.get('Info')
    count2 = Json.get('count')
    rezult = {'NotInNewsletter': info, 'count': count, 'InNewsletter': info2, 'count2': count2}
    end = perf_counter()
    print(end - start)
    return render(request, 'sms/updateMailing.html', {'NotInNewsletter': info, 'count': count, 'InNewsletter': info2,
                                                      'count2': count2, 'template': catid, 'types_mailing': '2'}) \
        if request.method == 'GET' else JsonResponse(rezult, safe=False)


def addNewNewssender(request):
    obj = request.GET
    Id = obj.get('id')
    id_type_mailing = obj.get('idMailing')
    Insert_db("insert into private.mailing (id_type_mailing, id_template, mailing_list_name, id_responsible) "
              "values (%s, %s, %s, %s)", (obj['idMailing'], int(Id), obj['name'], request.user.id))
    info2 = (query_db("SELECT MAX(id) FROM private.mailing where id_type_mailing = %s", (id_type_mailing,)))
    # Используется для перехода на страницу для добавления компаний
    catid = info2[0]['max']
    return redirect(EmalePajeinfo, catid)
