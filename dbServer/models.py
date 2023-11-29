# from django.db import models
# # отвечает за таблицы
# # Create your models here.
#
# #todo добавить поле отвечющее за рассылку. может иметь несколько значений и по ним нужно будет сделать поиск
# class Companies(models.Model): # класс о юрид лицах
#     names =[ 'Название', 'ИНН', 'Юр. адрес', 'Должность руководителя','ФИО руководителя', 'Телефон','Почта','Сайт']
#     Inn = models.IntegerField("Инн")
#     name = models.TextField("Название компании")
#     legalAdd = models.TextField('юр адрес')
#     positionHead = models.TextField('должность руководителя')
#     fioHead = models.TextField('Фио руководителя')
#     innHead = models.IntegerField('Инн руководителя')
#     telephone = models.TextField('Телефон')
#     mail = models.TextField('email почта')
#     website = models.TextField('сайт')
#     revenue = models.TextField('доход')
#     numEmploy = models.IntegerField('номер ответсвенного')
#     dateRegistr = models.DateField('дата регистрации')
#     activityTypeCode = models.TextField('Код деятельности')
#     typeActivity = models.TextField('тип активности')
#     bcSc = models.BooleanField('бизнес или торговый центр ')
#     updateDate=models.DateField('дата обновления')
#
#     def __str__(self):
#         return self.name
#
#     class Meta:
#         verbose_name ='информация о юл'
#         verbose_name_plural = 'Таблица информация о юл'
#         # db_table: определяет имя таблицы в базе данных, к которой будет привязана модель.
#
#
# class Subscription(models.Model):
#     itn = models.IntegerField('ИНН')
#     Email = models.TextField('подписка на сообщения')
#     Post = models.TextField('подписка на почтовые сообщения ')
#     sms =models.IntegerField('подписка на смс')
