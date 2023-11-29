#!/usr/bin/env python
from config import Downloader
from parcer import Parser
from data import some_logic
import psycopg2
from psycopg2 import Error
# startUrl = 'https://checko.ru'
# urlAllData = startUrl + '/search?query='
# allData = "allData.html"
# CONTACTS = "contacts.html"
# PARSED_FILE_PATH = "allData.json"
# INN = '7716057427'
def process(inn):
    # Url = url.split('?')
    # params = Url[1].split('&')
    # d = {}
    # for i in params:
    #     I = i.split('=')
    #     if I[1].isdigit():
    #         d[I[0]] = d.get(I[0], 0) + int(I[1])
    #     else:
    #         d[I[0]] = d.get(I[0], '') + I[1]
    downloader = Downloader(inn)
    # parser = Parser()
    # parser.parse()
    # d = some_logic()
# process(INN)

try:
    # Подключиться к существующей базе данных
    connection = psycopg2.connect(user="meadowse",
                                  # пароль, который указали при установке PostgreSQL
                                  password="Comebackplz56!!",
                                  host="localhost",
                                  port="5432",
                                  database="meadowse")
    cursor = connection.cursor()
    # Получить результат
    cursor.execute("SELECT c.inn_company from private.companies c")
    record = cursor.fetchall()
    for inn in record:
        d = some_logic('/home/meadowse/finances/' + inn[0] + '.json')
        if d.get('meta').get('message') == 'Не найдено ни одной организации с указанными реквизитами':
            continue
        if d.get('data') == {}:
            cursor.execute("update private.companies set revenue = null, update_date = now() where id = %s",
                           (d.get('company').get('ИНН'), ))
            continue
        # print(d.get('data').get(max(d.get('data').keys())).keys())
        # print(d.get('company').get('ИНН'))
        # print(d.get('data').get(max(d['data'].keys())).get('2110').get('СумОтч'))
        if d.get('data').get(max(d.get('data').keys())).get('2110') is None:
            cursor.execute("update private.companies set revenue = null, update_date = now() where id = %s",
                           (d.get('company').get('ИНН'), ))
        else:
            revenue = d.get('data').get(max(d.get('data').keys())).get('2110').get('СумОтч')
            # if revenue >= 1000000000000:
            #     revenue = str(round((revenue / 1000000000000), 1)) + ' трлн ₽'
            # elif revenue >= 1000000000:
            #     revenue = str(round((revenue / 1000000000), 1)) + ' млрд ₽'
            # elif revenue >= 1000000:
            #     revenue = str(round((revenue / 1000000), 1)) + ' млн ₽'
            # elif revenue >= 1000:
            #     revenue = str(round((revenue / 1000), 1)) + ' тыс. ₽'
            # else:
            #     revenue = str(revenue) + ' ₽'
            cursor.execute("update private.companies set revenue = %s, update_date = now() where id = %s",
                           (revenue, d.get('company').get('ИНН')))
        connection.commit()
        # print(d['data'][max(d['data'].keys())]['2110']['СумОтч'])
        # print(d['company']['ИНН'])
    # if d['data']['Статус']['Наим'] == 'Действует':
    # print(d['data']['ИНН'])
    # print(d['data']['НаимСокр'])
    # print(d['data']['ДатаРег'])
    # print(d['data']['ЮрАдрес']['АдресРФ'])
    # print(d['data']['ОКВЭД']['Код'])
    # print(d['data']['ОКВЭД']['Наим'])
    # print(d['data']['Руковод'][0]['ФИО'])
    # print(d['data']['Руковод'][0]['ИНН'])
    # print(d['data']['Руковод'][0]['НаимДолжн'])
    # print(d['data']['Контакты']['Тел'])
    # print(d['data']['Контакты']['Емэйл'])
    # print(d['data']['Контакты']['ВебСайт'])
    # print(d['data']['СЧР'])
    # for inn in record:
    #     process(inn[0])
except (Exception, Error) as error:
    print("Ошибка при работе с PostgreSQL", error)
finally:
    if connection:
        cursor.close()
        connection.close()
        print("Соединение с PostgreSQL закрыто")