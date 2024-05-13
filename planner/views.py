# from django.shortcuts import render
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from test import query_db


# Create your views here.
@csrf_exempt
def employee(request, employee_id):
    Str = ("select distinct e.id, e.full_name, e.post, e.personal_phone, e.mail, e.work_phone, e.internal_phone, "
           "e.telegramm, e.skype, e.bitrix24, e.birthday, e.personal_photo, d.name as _group_ from planner.employee e "
           "join department d on d.id = any (e.division) join planner.employee pe on pe.id = d.uf_head "
           "where e.id = %s" % employee_id) + " and d.name ilike '%Группа%'"
    info = query_db(Str)
    if len(info) == 0:
        info = query_db("select id, full_name, post, personal_phone, mail, work_phone, internal_phone, telegramm, "
                        "skype, bitrix24, birthday, personal_photo from planner.employee where id = %s",
                        (employee_id, ))
    # print(info)
    birthday = info[0].get('birthday')
    # print(birthday)
    info[0]['birthday'] = str(birthday)
    # print(info)
    managers = query_db("select e2.id::text, e2.full_name, e2.personal_photo from planner.employee e2 "
                        "where e2.id in (select distinct CASE when e.id = d.uf_head then (select de.uf_head "
                        "from department de where d.parent = de.id) else pe.id end from planner.employee e "
                        "join department d on d.id = any (e.division) join planner.employee pe on pe.id = d.uf_head "
                        "where e.id = %s) and e2.id <> %s", (employee_id, employee_id))
    # print(managers)
    info[0]['managers'] = managers
    # print(info)
    subordinates = query_db("select e.id, e.full_name, e.personal_photo from department d "
                            "join department d2 on d2.id = d.parent "
                            "join planner.employee e on e.id = d.uf_head and d.uf_head <> %s "
                            "where d2.uf_head = %s union select distinct e.id, e.full_name, e.personal_photo "
                            "from planner.employee e "
                            "join department d on d.id = any (e.division) and d.uf_head <> e.id "
                            "where d.id in (select id from department where uf_head = %s)",
                            (employee_id, employee_id, employee_id, ))
    # print(subordinates)
    info[0]['subordinates'] = subordinates
    # print(info)
    Str = json.dumps(info[0], ensure_ascii=False, indent=4)
    print(Str)
    Json = json.loads(Str)
    return JsonResponse(Json, safe=False)


def employees(request):
    info = query_db("select id, full_name, post, personal_phone, mail, work_phone, internal_phone, telegramm, "
                    "skype, bitrix24, birthday, personal_photo from planner.employee")
    for i in info:
        birthday = i.get('birthday')
        i['birthday'] = str(birthday)
        Str = ("select distinct d.name as _group_ from planner.employee e join department d on d.id = any (e.division) "
               "join planner.employee pe on pe.id = d.uf_head "
               "where e.id = %s" % i.get('id')) + " and d.name ilike '%Группа%'"
        obj = query_db(Str)
        if len(obj) != 0:
            i['_group_'] = obj[0].get('_group_')
        managers = query_db("select e2.id::text, e2.full_name, e2.personal_photo from planner.employee e2 "
                            "where e2.id in (select distinct CASE when e.id = d.uf_head then (select de.uf_head "
                            "from department de where d.parent = de.id) else pe.id end from planner.employee e "
                            "join department d on d.id = any (e.division) "
                            "join planner.employee pe on pe.id = d.uf_head where e.id = 31) and e2.id <> 31",
                            (i.get('id'), i.get('id')))
        i['managers'] = managers
        subordinates = query_db("select e.id, e.full_name, e.personal_photo from department d "
                                "join department d2 on d2.id = d.parent "
                                "join planner.employee e on e.id = d.uf_head and d.uf_head <> %s "
                                "where d2.uf_head = %s union select distinct e.id, e.full_name, e.personal_photo "
                                "from planner.employee e "
                                "join department d on d.id = any (e.division) and d.uf_head <> e.id "
                                "where d.id in (select id from department where uf_head = %s)",
                                (i.get('id'), i.get('id'), i.get('id'), ))
        i['subordinates'] = subordinates
    Str = json.dumps(info, ensure_ascii=False, indent=4)
    print(Str)
    Json = json.loads(Str)
    return JsonResponse(Json, safe=False)
