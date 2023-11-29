from django.urls import path
from .views import *

urlpatterns = [
    path('', emailmainCourt, name='manCourt'),
    path('sendtestEmail/', SendTestEmail, name='SendTestEmail'),
    path('sendEmail/', SendEmail, name='sendEmail'),
    path('addTarget/', addTarget, name='addTarget'),
    path('removeTarget/', removeTarget, name='removeTarget'),
    path('createLabels/', createLabels, name='createLabels'),
    path('createLetters/', createLetters, name='createLetters'),
    path('removeLine/', removeLine, name='removeLine'),
    path('<int:catid>/', EmalePajeinfo, name='EmalePajeinfo'),
]
