from django.contrib import admin
# для связи с админ панелью
# Register your models here.
from .models import InfoAbLE

admin.site.register(InfoAbLE) # информируем что есть такая таблица