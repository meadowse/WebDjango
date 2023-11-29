
from django.urls import path
from .views import *

urlpatterns = [
    path('', mainCourt, name='mainCourt'),
    path('courtinfo/', courtinfo, name='courtinfo')
    ]
