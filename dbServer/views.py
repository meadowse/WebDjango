import mimetypes
import os
import re

from django.contrib.auth import logout
from django.shortcuts import render
from django.urls import reverse_lazy
from django.shortcuts import redirect
from EmailCount.views import printDocx
from test import *
from django.http import JsonResponse, HttpResponse
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.views import LoginView
from django.views.decorators.csrf import csrf_exempt
from databaseConnect import *


# Create your views here.
class MainView(LoginView):
    form_class = AuthenticationForm
    template_name = "dbServer/pasvor.html"

    def get(self, request):
        return render(request, self.template_name, {})

    def get_success_url(self):
        return reverse_lazy('home')


def logout_user(request):
    logout(request)
    return redirect('login')


# все методы получают http запрос с параметрами страницы,
# а так же они возвращают http ответ
# вместо HttpResponse отправляем html страницу
@csrf_exempt
def index(request):
    rez = "select * from private.all_data_companies"
    names = ["Название компании", "ИНН", "Юр. адрес", "Должность руководителя", "Фио руководителя", "телефон", "сайт",
             "источник данных", "код активности", "доход", "рассылка по электронной почте", "рассылка по почте",
             "рассылка по смс", "звонки"]
    Json = search(request, rez)
    Info = Json.get('Info')
    count = Json.get('count')
    return render(request, 'dbServer/companies.html', {'title': "main", 'Companies': Info, 'count': count,
                                                       'names': names})\
        if request.method == 'GET' else JsonResponse(Json, safe=False)


def info(request, catid):
    Info = callProc('data_company', catid)
    history = callProc('history_interaction', catid)
    processedHistory = []
    for event in history:
        if event.get('status') == 'Создано':
            typeMailing = event.get('type_mailing')
            if typeMailing == 'Звонки':
                description = 'Создан обзвон'
            else:
                description = 'Создана рассылка по '
                if typeMailing == 'Почта':
                    description += 'почте'
                elif typeMailing == 'Email':
                    description += 'email'
                else:
                    description += 'смс'
        else:
            typeMailing = event.get('type_mailing')
            if typeMailing == 'Звонки':
                description = 'Совершён обзвон'
            else:
                description = 'Совершена рассылка по '
                if typeMailing == 'Почта':
                    description += 'почте'
                elif typeMailing == 'Email':
                    description += 'email'
                else:
                    description += 'смс'
        description += ' ' + event.get('mailing_list_name')
        processedEvent = {'description': description, 'date': event.get('date')}
        processedHistory.append(processedEvent)
    obj = callProc('objects_owned', catid)
    ObjInArend = callProc('objects_rent', catid)
    earthSobstv = callProc('lands_owned', catid)
    earthInArend = callProc('lands_rent', catid)
    # todo добавить описание объекта
    return render(request, 'dbServer/companiesInfo.html', {'title': catid, 'Companies': Info[0],
                                                           'history': processedHistory, 'obj': obj,
                                                           'ObjInArend': ObjInArend, 'earthSobstv': earthSobstv,
                                                           'earthInArend': earthInArend, 'name': "Описание объекта"})


@csrf_exempt
def infoAboutObj(request):
    obj = json.loads(request.body)
    catid = obj['id_companys']
    caadr = callProcWitTwo('cadastral', obj['id_cadastr'], catid)
    ret = json.dumps(caadr[0], ensure_ascii=False)
    return JsonResponse(ret, safe=False)


@csrf_exempt
def extract(request):
    obj = json.loads(request.body)
    cadastralNumber = obj.replace(':', '-')
    pdf_file_name = ''
    for root, dirs, files in os.walk('/home/meadowse/media/'):
        for file in files:
            match = re.search(cadastralNumber, file)
            if match:
                pdf_file_name = "/home/meadowse/media/" + file
    return printDocx(pdf_file_name)


def pageNotFound(request, exception):
    return render("'"+request+"'", 'dbServer/ErrPaje.html')


# sms
def smsmainCourt(request):
    info = query_db("select * from private.universal_mailing u where u.type_mailing = 'СМС'")
    # print(info)
    names = ["Наименование рассылки", "Шаблон", "Кол-во писем", "Дата создания", "Дата отправки", "Ответственный",
             "Статус", "Привязанные контакты"]
    Companies = query_db("select * from private.all_data_companies limit 10")
    newsleter = (query_db("select * from private.templates"))
    return render(request, 'EmailCount/mail.html', {'title': "main", 'mail': info, 'names': names,
                                                    'Companies': Companies, 'templateForSend': newsleter, 'types_mailing': '3'})


# суд
def mainCourt(request):
    Info = query_db("select * from private.letters_court")
    names = ['Номер дела', 'Номер письма', 'Истец', 'Ответчик', 'Судья', 'Статус дела', 'Ответственный', 'Статус',
             'Ссылка на дело']
    # TODO для поля где стоит иин сделать запрос к другим базам данных и выводить информацию из запроса sql
    return render(request, 'court/court.html', {'title': "Court", 'Companies': Info, 'names': names})


def smsinfo(request, catid):
    rez1 = ("select * from private.all_data_companies a where a.inn_company::bigint not in (select mc.id_company "
            "from private.mailing_companies mc where mc.id_mailing = %s)" % catid)
    rez2 = ("select * from private.all_data_companies a where a.inn_company::bigint in (select mc.id_company "
            "from private.mailing_companies mc where mc.id_mailing = %s)" % catid)
    Info = search(request, rez1)
    info2 = search(request, rez2)
    return render(request, 'sms/updateMailing.html',
                  {'NotInNewsletter': Info, 'InNewsletter': info2,
                                                      'template': catid,  'types_mailing': '3'})


def courtinfo(request, catid):
    pass


def objectShow(request):
    rez = "select * from private.all_data_cadastral_numbers"
    Json = searchObjects(request, rez)
    Info = Json.get('Info')
    count = Json.get('count')
    return render(request, 'dbServer/objects.html', {'objInfo': Info, 'count': count})\
        if request.method == 'GET' else JsonResponse(Json, safe=False)


def objectInfio(request, catid):
    pass
