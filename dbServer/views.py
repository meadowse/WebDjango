
from django.shortcuts import render, redirect
from .models import *
from django.http import HttpResponse, HttpResponseNotFound
from .forms import InfoAbLEForm
from django import template


# Create your views here.
# все методы получают http зпрос с парамтрами страницы
# а так же они возвращают http ответ
# вместо  HttpResponse отправляем html страницу
def index(request):
    if(request.GET):
        print(request.GET)
    infoAbLE = InfoAbLE.objects.all()
    nameColums = InfoAbLE.columns
    name = InfoAbLE.names
    return render(request, 'dbServer/index.html', {'title': "main", "infoAbLE": infoAbLE, "colums": nameColums, "tibleHead":name})

def table(request): # выводем поля формы для записи в бд
    if (request.GET):
        print(request.GET)
    error = ''
    if request.method == 'POST':
        form = InfoAbLEForm(request.POST)
        if len(str(form.Meta.model.ITN)) > 9:
            if form.is_valid():
                form.save()
                return  redirect('home') # перессылка пользователя на домашнюю стр
            else:
                error = 'Неверный ввод даных'
        else:
            error = 'Неверный ввод даных'
    form = InfoAbLEForm() # ссылаемся на формс.ру
    context={ 'form':form,
              'error':error}
    return render(request, 'dbServer/base.html', context)
    # return HttpResponse("<h4>HelloWorld</h4>")


def pageNotFound(request, exception):
    return render(request, 'dbServer/ErrPaje.html')