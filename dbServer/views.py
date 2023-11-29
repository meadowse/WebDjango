from django.contrib.auth import logout
from django.shortcuts import render
from django.urls import reverse_lazy
from test import *
from django.http import JsonResponse
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.views import LoginView

class MainView(LoginView):
    form_class = AuthenticationForm
    template_name = "dbServer/pasvor.html"
    def get(self, request):
         return render(request, self.template_name,{})
    def get_success_url(self):
        return reverse_lazy('home')

def logout_user(request):
    logout(request)
    JsonResponse({'status':'True'}, status=200)


def index(request):
    obj = {}
    if request.body:
        obj = json.loads(request.body)
        print(obj)
    names = ["Название компании", "ИНН", "Юр. адрес", "Должность руководителя", "Фио руководителя", "телефон",
             "телефон", "сайт","источник данных","код активности","доход","рассылка по электронной почте","рассылка по почте","рассылкаа по смс","звонки"]
    desc = "desc"
    if 'columnSorted' in obj.keys():
        columnNumForSorted = names.index(obj['columnSorted'])+1
        if 'Sorted' in obj.keys():
            desc = obj['Sorted']
    else:
       columnNumForSorted = 1
    if desc == "desc":
        info = query_db("select * from private.all_data_companies order by %s desc limit 100", [columnNumForSorted])
    else:
        info = query_db("select * from private.all_data_companies order by %s limit 100", [columnNumForSorted])
    ansv = json.dumps(info, ensure_ascii=False)
    return JsonResponse(json.loads(ansv), safe=False, json_dumps_params={'ensure_ascii': False})


def info(request):
    obj = {}
    if request.body:
        obj = json.loads(request.body)
    if 'companyId' in  obj:
        catid = obj['companyId']
        if 'table' in obj and obj['table'] == 'object':
            obj = callProc('objects_owned', catid)
            ObjInArend = callProc('objects_rent', catid)
            earthSobstv = callProc('lands_owned', catid)
            earthInArend = callProc('lands_rent',catid)
            objDict = json.dumps({'objects_owned': obj,'objects_rent':ObjInArend, 'lands_owned':earthSobstv, 'lands_rent':earthInArend },ensure_ascii=False)
            caadr = json.dumps(objDict, ensure_ascii=False)
            # todo добавить описание объекта
            return JsonResponse(caadr, safe=False, json_dumps_params={'ensure_ascii': False})
        info = callProc('data_company', catid)
        history = callProc('history_interaction', catid)
        objDict = json.dumps({'objects_owned':info, 'objects_rent': history},ensure_ascii=False)
        return JsonResponse(json.loads(objDict), safe=False, json_dumps_params={'ensure_ascii': False})
    return JsonResponse({'status':'false'}, status=500)


from django.views.decorators.csrf import csrf_exempt


@csrf_exempt
def infoAboutObj(request):
    obj = {}
    if request.body:
        obj = json.loads(request.body)
    if 'companyId' in obj.keys() and 'id_cadastr' in obj.keys():
        obj = json.loads(request.body)
        catid = obj['companyId']
        caadr = callProcWitTwo('cadastral', obj['id_cadastr'], catid)
        print(type(caadr[0]))
        ret = json.dumps(caadr[0], ensure_ascii=False)
        print(ret)
        return JsonResponse(ret, safe=False)
    return JsonResponse({'status': 'false'}, status=500)


def pageNotFound(request, exception):
    return JsonResponse({'status': 'false'}, status=500)
