from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from test import *
from django.shortcuts import redirect, render
from databaseConnect import *


def EmalePajemainCourt(request):
    info = query_db("select * from private.universal_mailing u where u.type_mailing = 'Почта'")
    newsleter = (query_db("select * from private.templates"))
    return render(request, 'EmailPage/post.html', {'title': "main", 'mail': info, 'templateForSend': newsleter,
                                                   'types_mailing': '2'})


@csrf_exempt
def EmalePajeinfo(request, catid):
    rez1 = ("select * from private.all_data_companies a where a.inn_company::bigint not in (select mc.id_company "
            "from private.mailing_companies mc where mc.id_mailing = %s)" % catid)
    rez2 = ("select * from private.all_data_companies a where a.inn_company::bigint in (select mc.id_company "
            "from private.mailing_companies mc where mc.id_mailing = %s)" % catid)
    info = search(request, rez1)
    info2 = search(request, rez2)
    rezult = {'NotInNewsletter': info, 'InNewsletter': info2}
    return render(request, 'sms/updateMailing.html', {'NotInNewsletter': info, 'InNewsletter': info2,
                                                      'template': catid, 'types_mailing': '2'}) \
        if request.method == 'GET' else JsonResponse(rezult, safe=False)


def addNewNewssender(request):
    obj = request.GET
    Id = obj.get('id')
    id_type_mailing = obj.get('idMailing')
    Insert_db("insert into private.mailing (id_type_mailing, id_template, mailing_list_name, id_responsible) "
              "values (%s, %s, %s, 13)", (obj['idMailing'], int(Id), obj['name']))
    info2 = (query_db("SELECT MAX(id) FROM private.mailing where id_type_mailing = %s", (id_type_mailing,)))
    # Используется для перехода на страницу для добавления компаний
    catid = info2[0]['max']
    return redirect(EmalePajeinfo, catid)
