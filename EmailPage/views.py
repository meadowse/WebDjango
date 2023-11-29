from django.shortcuts import render
from django.http import HttpResponse, HttpResponseNotFound
from EmailCount.models import Posttable
from test import *
from dbServer.models import *
from django.http import JsonResponse
import json
import cgi

# Create your views here.
def EmalePajemainCourt(request):
    show = Posttable.objects.filter(MailingType=2).values()
    data = []
    info = query_db("select * from private.universal_mailing u where u.type_mailing = 'Почта'")
    names = ["Наименование рассылки", "Шаблон", "Кол-во писем", "Дата создания", "Дата отправки", "Ответственный",
             "Статус", "Привязанные контакты"]
    return render(request, 'EmailPage/post.html', {'title': "main", 'Companies': info, 'names': names})


def EmalePajeinfo(request, catid):
    return HttpResponse(f"<h4>HelloWorld</h4><p>{catid}</p>")
