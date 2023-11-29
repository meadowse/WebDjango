from django.contrib.auth import logout
from django.http import HttpResponse
from django.shortcuts import render
from django.urls import reverse_lazy
# from django.views.generic import TemplateView
from django.shortcuts import redirect
from test import *
from django.http import JsonResponse
# from .models import *
# from .forms import CompaniesForm
# from django.contrib.auth.views import LoginView
from django.contrib.auth.forms import AuthenticationForm
# Create your views here.
from django.contrib.auth.views import LoginView
# from django.views.decorators.cache import cache_page
from django.views.decorators.csrf import csrf_exempt  # , csrf_protect  # Add this
import mimetypes
import os


class MainView(LoginView):
    form_class = AuthenticationForm
    template_name = "dbServer/pasvor.html"

    @csrf_exempt
    def get(self, request):
        return render(request, self.template_name, {})

    @csrf_exempt
    def get_success_url(self):
        return reverse_lazy('home')


@csrf_exempt
def logout_user(request):
    logout(request)
    return redirect('login')


# все методы получают http запрос с параметрами страницы,
# а так же они возвращают http ответ
# вместо HttpResponse отправляем html страницу
def index(request):
    if request.method == 'GET':
        obj = {
            # 'search': 'акб',  # что мы ищем
            # 'absence':  # исключить пустые строки столбцов, это массив перечисленных столбцов, в которых надо
            #              # исключить пустые строки
            # ['legal_address', 'position_head', 'fio_head', 'telephone', 'mail', 'website', 'type_activity'],
            # 'email_newsletter': 1,  # участвовал в рассылке: 1 - Да, 0 - Нет
            # 'mail_newsletter': 1,
            # 'sms_mailing': 1,
            # 'the_bell': 1,
            # 'revenue': 0,  # значение от которого отталкиваемся в обороте
            # 'comparison': -1,  # 0 - равно, 1 - больше, -1 - меньше
            # 'data_source': 'СУД',  # источник данных
            # 'order by': 'revenue',     # сортировочный столбец (здесь в принципе можно передавать номер столбца
            #                            # начиная с 1 - 'company_name')
            # 'desc': 1,  # сортировка по: 0 - возрастанию, 1 - убыванию
            # 'limit': 10,  # кол-во строк, 0 - все данные
        }
    else:
        obj = json.loads(request.body)
    names = ["Название компании", "ИНН", "Юр. адрес", "Должность руководителя", "Фио руководителя", "телефон", "сайт",
             "источник данных", "код активности", "доход", "рассылка по электронной почте", "рассылка по почте",
             "рассылка по смс", "звонки"]
    where = 'where inn_company::bigint > 0'
    search = obj.get('search')
    if search is not None:
        where += ((" and concat(company_name, '|', inn_company, '|', legal_address, '|', position_head, '|', "
                   "fio_head, '|', telephone, '|', mail, '|', website, '|', type_activity, '|', revenue, '|', "
                   "email_newsletter, '|', mail_newsletter, '|', sms_mailing, '|', the_bell) "
                   "ilike '%") + str(search) + "%'")

    email_newsletter = obj.get('email_newsletter')
    if email_newsletter is not None:
        if email_newsletter == 1:
            where += ' and email_newsletter is not null'
        elif email_newsletter == 0:
            where += ' and email_newsletter is null'

    mail_newsletter = obj.get('mail_newsletter')
    if mail_newsletter is not None:
        if mail_newsletter == 1:
            where += ' and mail_newsletter is not null'
        elif mail_newsletter == 0:
            where += ' and mail_newsletter is null'

    sms_mailing = obj.get('sms_mailing')
    if sms_mailing is not None:
        if sms_mailing == 1:
            where += ' and sms_mailing is not null'
        elif sms_mailing == 0:
            where += ' and sms_mailing is null'

    the_bell = obj.get('the_bell')
    if the_bell is not None:
        if the_bell == 1:
            where += ' and the_bell is not null'
        elif the_bell == 0:
            where += ' and the_bell is null'

    revenue = obj.get('revenue')
    if revenue is not None:
        comparison = obj.get('comparison')
        if comparison is None or comparison == 1:
            where += ' and revenue > ' + str(revenue)
        elif comparison == 0:
            where += ' and revenue = ' + str(revenue)
        elif comparison == -1:
            where += ' and revenue < ' + str(revenue)

    absence = obj.get('absence')
    if absence is not None:
        if len(absence) != 0:
            for elem in absence:
                if elem == 'telephone' or elem == 'mail':
                    where += ' and ' + elem + ' is not null' + ' and ' + elem + " != '{}'"
                else:
                    where += ' and ' + elem + " != ''"

    dataSource = obj.get('data_source')
    if dataSource is not None:
        where += " and '" + str(dataSource) + "' = any (data_source)"

    orderBy = obj.get('order by')
    if orderBy is None:
        orderBy = 'company_name'
    desc = obj.get('desc')
    if desc is not None:
        if obj.get('desc') == 1:
            orderBy += ' desc'

    limit = obj.get('limit')
    if limit is not None:
        if limit == 0:
            limit = 'all'
    else:
        limit = 500
    rez = ("select * from private.all_data_companies %s order by %s limit %s" % (where, orderBy, limit))
    Info = query_db(rez)
    rezult = json.dumps(Info, ensure_ascii=False)
    return render(request, 'dbServer/companies.html', {'title': "main", 'Companies': Info, 'names': names}) \
        if request.method == 'GET' else JsonResponse(rezult, safe=False)


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
    cadastralNumber = obj.get('cadastralNumber')
    cadastralNumber = cadastralNumber.replace(':', '-')
    print(cadastralNumber)
    excel_file_name = "/home/meadowse/media/" + cadastralNumber + "_" + obj.get('typeObject') + ".pdf"
    with open(excel_file_name, "rb") as fp:
        response = HttpResponse(fp.read())
    file_type = mimetypes.guess_type(excel_file_name)
    if file_type is None:
        file_type = 'application/octet-stream'
    response['Content-Type'] = file_type
    response['Content-Length'] = str(os.stat(excel_file_name).st_size)
    response['Content-Disposition'] = "attachment; filename=excel_file.xlsx"
    return response


def pageNotFound(request, exception):
    return render("'"+request+"'", 'dbServer/ErrPaje.html')


# sms
def smsmainCourt(request):
    Info = query_db("select * from private.universal_mailing u where u.type_mailing = 'СМС'")
    # TODO  where tm.type_mailing = 3
    names = ["Наименование рассылки", "Шаблон", "Кол-во писем", "Дата создания", "Дата отправки", "Ответственный",
             "Статус", "Привязанные контакты"]
    return render(request, 'sms/sms.html', {'title': "main", 'Companies': Info, 'names': names})


# суд
def mainCourt(request):
    Info = query_db("select * from private.letters_court")
    names = ['Номер дела', 'Номер письма', 'Истец', 'Ответчик', 'Судья', 'Статус дела', 'Ответственный', 'Статус',
             'Ссылка на дело']
    # TODO для поля где стоит иин сделать запрос к другим базам данных и выводить информацию из запроса sql
    return render(request, 'court/court.html', {'title': "Court", 'Companies': Info, 'names': names})


def courtinfo(request, catid):
    pass
