from django.shortcuts import render
from django.http import HttpResponse, HttpResponseNotFound
from django.shortcuts import render, redirect
# Create your views here.
from test import *
def Calsmain(request):
    info = query_db("select * from private.universal_mailing u where u.type_mailing = 'Звонки' ")
    names = ["Наименование рассылки", "Шаблон", "Кол-во контактов", "Дата создания", "Дата отправки", "Ответственный",
             "Статус", "Привязанные телефоны"]
    return render(request, 'CalsPage/page.html', {'title': "main", 'Companies': info, 'names': names})

def Calsinfo(request, catid):
    return HttpResponse(f"<h4>HelloWorld</h4><p>{catid}</p>")
