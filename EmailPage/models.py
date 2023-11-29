from django.db import models

# Create your models here.

class Emailtable(models.Model):

    pass
    def __str__(self):
        return self.name

    class Meta:
        verbose_name ='таблица для эмайлов'
        verbose_name_plural = 'Таблица информация отправленном сообщении '
        # db_table: определяет имя таблицы в базе данных, к которой будет привязана модель.



