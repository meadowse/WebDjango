from django.db import models
# отвечает за таблицы
# Create your models here.
class Samostroy(models.Model):
    names = models.CharField('КН', max_length=17) 
    status= models.TextField('Статус',) 
    # da
    def __str__(self):
        return self.names
    class Meta:
        verbose_name ='КН самострой'
        verbose_name_plural = 'Таблица 1 КН самострой'