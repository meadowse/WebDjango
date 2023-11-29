from django.db import models

# Create your models here.
class Calstable(models.Model):
    pass
    def __str__(self):
        return self.name

    class Meta:
        verbose_name ='информация о звонках'
        verbose_name_plural = 'Таблица информация о звонках'