from django.shortcuts import render
from .models import Samostroy
# from django.http import HttpResponse

# Create your views here.
def index(request):
    samostroy = Samostroy.objects.all()
    return render(request, 'dbServer/index.html', {'title': "main", "Samostroy": samostroy} )
    # return HttpResponse("<h4>HelloWorld</h4>")