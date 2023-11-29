from django.db import models
# отвечает за таблицы
# Create your models here.
class InfoAbLE(models.Model): # класс о юрид лицах
    columns = ['ITN', 'name', 'legalAddres', 'positionOfHead','NameOfHead']
    names = ['Инн', 'Название', 'Юр. адрес', 'Должность руководителя','Имя руководителя','ИНН руководителя', 'Номер телефона', 'Почта','Сайт','Дата создания записи']
    ITN = models.IntegerField('инн')
    name= models.TextField('Название ')
    legalAddres = models.TextField('юр. адрес')
    positionOfHead = models.TextField('Должность руководителя')
    NameOfHead= models.TextField('Имя руководителя')
    ITNofHead = models.IntegerField('Инн руководителя')
    PfoneNumbers = models.TextField('Номер телефона')
    Post = models.EmailField('Почта')
    Site = models.URLField('Сайт')
    DateTocreate = models.DateTimeField('Дата создания записи', auto_now_add=True)

    def __str__(self):
        return self.name
    class Meta:
        verbose_name ='информация о юл'
        verbose_name_plural = 'Таблица с информаций о юл'
        # db_table: определяет имя таблицы в базе данных, к которой будет привязана модель.