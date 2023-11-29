from django.db import models

# Create your models here.
State = (('Отрпавлено', 'Отправлено'), ('Формируется', 'Формируется'))
MailType = (('1', '1'), ('2', '2'), ('3','3'))
# 1-СМС 2-Электронное письмо 3-письмо почтовое
class Posttable(models.Model): # класс о юрид лицах
    # id created avtomat
    Take = models.BooleanField('Выбрано', default=False) # флаг чторешили чтото делать
    Pattern = models.IntegerField('Шаблон') # ссылаемся на шаблон для отправки из другой таблицы
    Count = models.IntegerField('Колличество сообщений для отправки') # число добавленных для отправки
    DateCreate = models.DateTimeField('Дата создания')
    DateSend = models.DateTimeField('Дата отправки')
    Responsible = models.IntegerField('Ответственный') # ссылка на другую бд с администраторами
    State = models.TextField('Статус письма', choices=State)
    CaseStatus = models.TextField('Почта') # с каких почт писать
    ResponsibleNum = models.TextField('Номер телефона', null=True)
    AddSender = models.TextField('К каким категориям для отправки относится', default='0', null=True)
    MailingType = models.IntegerField('тип рассылки', choices=MailType)

    # TODO придумать как добавлять шаблоны отправки в исходя из того что есть в таблице ниже
    def __str__(self):
        return self.Pattern
    class Meta:
        verbose_name ='информация почтовых рассылоках'
        verbose_name_plural = 'Таблица почтовых рассылок'
        # db_table: определяет имя таблицы в базе данных, к которой будет привязана модель.


class TypeSenders(models.Model):
    num = models.IntegerField('номер рассылки')
    name = models.TextField('имя рассылки')
    title = models.TextField('Тема рассылок')
    def __str__(self):
        return self.name
    class Meta:
        verbose_name ='информация о типах рассылок'
        verbose_name_plural = 'Таблица типов рассылок'
        # db_table: определяет имя таблицы в базе данных, к которой будет привязана модель.
