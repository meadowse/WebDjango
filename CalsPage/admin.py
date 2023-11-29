from django.contrib import admin
from .models import *
class EmployeeAdmin(admin.ModelAdmin):
    pass
    # list_display = [ 'ITN', 'name', 'legalAddres', 'positionOfHead', 'NameOfHead', 'ITNofHead','PfoneNumbers' ,'Post','Site','PosOfHeadDativeCase',
    #            'FioOfHeadDativCase', 'NumPost' , 'Appeal', 'NumOfProperties','Adresses','Object','NumOfEmails' ,'DateOfLetter','Flag' ,'Index','Menedger','Comment','OwnerOrLesse' , 'DateTocreate']
    # search_fields =['name']
    # list_per_page = 8

admin.site.register(Calstable, EmployeeAdmin)