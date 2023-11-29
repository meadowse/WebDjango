from django.urls import path
from .views import *
from django.views.decorators.cache import cache_page

urlpatterns = [
    path('', EmalePajemainCourt, name='EmalePajemanCourt'),
    path('<int:catid>/',  EmalePajeinfo, name='EmalePajeinfo'),
    path('addNewNewssender/', addNewNewssender, name='addNewNewssender'),
    ]
