from django.urls import path
from .views import *

urlpatterns = [
    path('', Calsmain, name='Calsman'),
    path('<int:catid>/', Calsinfo, name='Calsinfo')
    ]