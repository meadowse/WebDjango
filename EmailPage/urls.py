from django.urls import path
from .views import *

urlpatterns = [
    path('', EmalePajemainCourt, name='EmalePajemanCourt'),
    path('<int:catid>/', EmalePajeinfo, name='EmalePajeinfo'),
    path('addNewNewssender/', addNewNewssender, name='addNewNewssender'),
]