#!/usr/bin/env python
# from download import Downloader
# from parcer import Parser
from data import some_logic
import psycopg2
import json
from psycopg2 import Error
# startUrl = 'https://checko.ru'
# urlAllData = startUrl + '/search?query='
# allData = "allData.html"
# CONTACTS = "contacts.html"
# PARSED_FILE_PATH = "allData.json"
# INN = '7716057427'


# def process(Inn):
#     # Url = url.split('?')
#     # params = Url[1].split('&')
#     # d = {}
#     # for i in params:
#     #     I = i.split('=')
#     #     if I[1].isdigit():
#     #         d[I[0]] = d.get(I[0], 0) + int(I[1])
#     #     else:
#     #         d[I[0]] = d.get(I[0], '') + I[1]
#     downloader = Downloader(Inn)
#     # parser = Parser()
#     # parser.parse()
#     # d = some_logic()
# # process(INN)


connection = None
cursor = None
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
    companies = cursor.fetchall()
    # if d['data']['Статус']['Наим'] == 'Действует':
    # print(d['data']['ИНН'])
    # print(d['data']['НаимСокр'])
    # print(d['data']['ДатаРег'])
    # print(d['data']['ЮрАдрес']['АдресРФ'])
    # print(d.get('data').get('ОКВЭД').get('Код'))
    # print(d.get('data').get('ОКВЭД').get('Наим'))
    for inn in companies:
        d = some_logic('/home/meadowse/companies/' + inn[0] + '.json')
        # print(json.dumps(d, ensure_ascii=False, indent=4))
        if d.get('meta').get('message') == 'Не найдено ни одной организации с указанными реквизитами':
            continue
        contacts = d.get('data').get('Контакты')
        telephones = contacts.get('Тел')
        emails = contacts.get('Емэйл')
        sites = contacts.get('ВебСайт')
        cursor.execute("update private.companies set telephone = %s, mail = %s, website = %s, update_date = now()"
                       "where id = %s", (telephones, emails, sites, inn[0]))
        connection.commit()
        # if d.get('data').get('ОКВЭД').get('Код') is None:
        #     cursor.execute("SELECT id from private.types_activities where activity_type_code = ''")
        # else:
        #     cursor.execute("SELECT id from private.types_activities where activity_type_code = %s",
        #                    (d.get('data').get('ОКВЭД').get('Код'), ))
        # id = cursor.fetchall()
        # cursor.execute("update private.companies set id_type_activity = %s, update_date = now() where id = %s",
        #                (id[0][0], inn[0]))
        # connection.commit()
        # cursor.execute("update private.types_activities (activity_type_code, type_activity) values (%s, %s)",
        #                (d.get('data').get('ОКВЭД').get('Код'), d.get('data').get('ОКВЭД').get('Наим')))
        # connection.commit()
        # cursor.execute("SELECT activity_type_code from private.types_activities")
        # activities = cursor.fetchall()
        # flag = True
        # for code in activities:
        #     if d.get('data').get('ОКВЭД').get('Код') == code[0]:
        #         flag = False
        # print(d.get('data').get('ОКВЭД').get('Код'))
        # print(d.get('data').get('ОКВЭД').get('Наим'))
        # if d.get('data').get('ОКВЭД').get('Код') == None:
        #     code = None
        # else:
        #     code = d.get('data').get('ОКВЭД').get('Код')
        # if d.get('data').get('ОКВЭД').get('Наим') == None:
        #     name = None
        # else:
        #     name = d.get('data').get('ОКВЭД').get('Наим')
        # if flag:
        #     cursor.execute("insert into private.types_activities (activity_type_code, type_activity) values (%s, %s)",
        #                    (d.get('data').get('ОКВЭД').get('Код'), d.get('data').get('ОКВЭД').get('Наим')))
        #     connection.commit()
    #     cursor.execute("SELECT id from private.types_activities where activity_type_code = %s",
    #                    (d.get('data').get('ОКВЭД').get('Код')))
    #     id = cursor.fetchall()
    #     print(id)
    # print(d['data']['Руковод'][0]['ФИО'])
    # print(d['data']['Руковод'][0]['ИНН'])
    # print(d['data']['Руковод'][0]['НаимДолжн'])
    # print(d['data']['Контакты']['Тел'])
    # print(d['data']['Контакты']['Емэйл'])
    # print(d['data']['Контакты']['ВебСайт'])
    # print(d['data']['СЧР'])
    # for inn in record:
    #     d = some_logic('/home/meadowse/companies/' + inn[0] + '.json')
    #     cursor.execute("update private.companies set date_registration = %s, update_date = now() where id = %s",
    #                    (d.get('data').get('ДатаРег'),
    #                     d.get('data').get('ИНН')))
    #     connection.commit()
except (Exception, Error) as error:
    print("Ошибка при работе с PostgreSQL", error)
finally:
    if connection:
        cursor.close()
        connection.close()
        print("Соединение с PostgreSQL закрыто")
