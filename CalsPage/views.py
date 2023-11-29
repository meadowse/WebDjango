from django.shortcuts import render
from django.http import HttpResponse, HttpResponseNotFound
from django.shortcuts import render, redirect
# Create your views here.
from test import *
# def Calsmain(request):
#     info = query_db("select * from private.universal_mailing u where u.type_mailing = 'Звонки' ")
#     names = ["Наименование рассылки", "Шаблон", "Кол-во контактов", "Дата создания", "Дата отправки", "Ответственный",
#              "Статус", "Привязанные телефоны"]
#     return render(request, 'CalsPage/page.html', {'title': "main", 'Companies': info, 'names': names})
#
# def Calsinfo(request, catid):
#     return HttpResponse(f"<h4>HelloWorld</h4><p>{catid}</p>")

def mainCourt(request):
    info = query_db("select * from private.letters_court")
    names =['Номер дела','Номер письма','Истец','Ответчик','Судья','Статус дела','Ответственный','Статус','Ссылка на дело']
    # TODO для поля где стоит иин сделать запрос к другим базам данных и выводить информацию из запроса sql
    return render(request, 'court/court.html', {'title': "Court",'Companies':info, 'names':names})

def courtinfo(request, catid):
    pass

