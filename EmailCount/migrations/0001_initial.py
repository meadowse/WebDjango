# Generated by Django 4.2.3 on 2023-08-29 06:50

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Posttable',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Take', models.BooleanField(default=False, verbose_name='Выбрано')),
                ('Pattern', models.IntegerField(verbose_name='Шаблон')),
                ('Count', models.IntegerField(verbose_name='Колличество сообщений для отправки')),
                ('DateCreate', models.DateTimeField(verbose_name='Дата создания')),
                ('DateSend', models.DateTimeField(verbose_name='Дата отправки')),
                ('Responsible', models.IntegerField(verbose_name='Ответственный')),
                ('State', models.TextField(choices=[('Отрпавлено', 'Отправлено'), ('Формируется', 'Формируется')], verbose_name='Статус письма')),
                ('CaseStatus', models.TextField(verbose_name='Почта')),
                ('ResponsibleNum', models.TextField(null=True, verbose_name='Номер телефона')),
                ('AddSender', models.TextField(default='0', null=True, verbose_name='К каким категориям для отправки относится')),
                ('MailingType', models.IntegerField(choices=[('1', '1'), ('2', '2'), ('3', '3')], verbose_name='тип рассылки')),
            ],
            options={
                'verbose_name': 'информация почтовых рассылоках',
                'verbose_name_plural': 'Таблица почтовых рассылок',
            },
        ),
        migrations.CreateModel(
            name='TypeSenders',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('num', models.IntegerField(verbose_name='номер рассылки')),
                ('name', models.TextField(verbose_name='имя рассылки')),
                ('title', models.TextField(verbose_name='Тема рассылок')),
            ],
            options={
                'verbose_name': 'информация о типах рассылок',
                'verbose_name_plural': 'Таблица типов рассылок',
            },
        ),
    ]
