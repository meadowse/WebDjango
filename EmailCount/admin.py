from django.contrib import admin

from .models import *
class EmployeeAdmin(admin.ModelAdmin):
     list_display = ['Take', 'Pattern', 'DateCreate', 'DateSend', 'Responsible','State',
                     'CaseStatus', 'ResponsibleNum','AddSender', 'MailingType']
     search_fields =['Pattern']
     list_per_page = 8

admin.site.register(Posttable, EmployeeAdmin)
admin.site.register(TypeSenders)
