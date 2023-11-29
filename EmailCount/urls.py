from django.urls import path
from .views import *

urlpatterns = [
    path('', emailmainCourt, name='manCourt'),
    path('emailinfo/', emailinfo, name='emailinfo'),
    path('sendEmail/', SendEmail, name='sendEmail'),
    path('addTarget/', addTarget, name='addTarget'),
    path('removeTarget/', removeTarget, name='removeTarget'),
    path('createLabels/', createLabels, name='createLabels'),
    path('removeLine/', removeLine, name='removeLine'),
    path('createLetters/', createLetters, name='createLetters'),
]
