from django.urls import path
from .views import *


urlpatterns = [
    path('email/', emailmainCourt, name='manCourt'),
    path('mailingInfo/', emailinfo, name='emailinfo'),
    path('sendEmail/', SendEmail, name='sendEmail'),
    path('addTarget/', addTarget, name='addTarget'),
    path('removeTarget/', removeTarget, name='removeTarget'),

    path('createLabels/', createLabels, name='createLabels'),
    path('mail/', EmalePajemainCourt, name='EmalePajemanCourt'),
   # path('mail/<int:catid>/', EmalePajeinfo, name='EmalePajeinfo'),

    path('cals/', Calsmain, name='Calsman'),
    # path('cals/<int:catid>/', Calsinfo, name='Calsinfo'),

    path('sms/', smsmainCourt, name='smsmainCourt'),
    ]
