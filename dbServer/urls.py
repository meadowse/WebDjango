"""
URL configuration for myproject project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path
from .views import * # смотрим по разным классам в
# смотрим переходы по разным url


urlpatterns = [
    path('', index, name='home'),
    # path('table/', table, name='table'),
    path('<int:catid>/', info, name='info'),
    path('sms/', smsmainCourt, name='smsmainCourt'),
    path('sms/<str:catid>/', smsinfo, name='smsinfo'),
    path('court/', mainCourt, name='mainCourt'),
    path('court/<str:catid>/', courtinfo, name='courtinfo'),
    path('infoAboutObj/', infoAboutObj, name='infoAboutObj'),
    path('login', MainView.as_view(), name='login'),
    path('logout/', logout_user, name='logout'),
    path('extract/', extract, name='extract'),
    path('objects/', objectShow, name='objects'),
    path('objects/<int:catid>/', objectInfio, name='objectsInfo'),
]

