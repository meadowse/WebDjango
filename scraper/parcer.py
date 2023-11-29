#!/usr/bin/env python
# import bs4
import datetime
from accessify import private
import requests
import json
import os.path
from download import CONTACTS, ALLDATA, path
from lxml import html
FILE_PATH = "af"
PARSED_FILE_PATH = "allData.json"
class Parser:
    def __init__(self, source=FILE_PATH):
        self.source = source
    def parse(self):
        headers = ['ИНН', 'Наименование компании', 'Юр. Адресс', 'Должность руководителя', 'ФИО Руководителя', 'ИНН Руководителя', 'Телефон', 'Почта', 'Сайт', 'Код вида деятельности',
                   'Вид деятельности', 'Количество сотрудников', 'Дата регистрации компании', 'Оборот компании']
        info = dict.fromkeys(headers, '')
        if os.path.isfile(path + ALLDATA):
            Html = self.readInFile(ALLDATA)
            name = Html.xpath('//*[@id="basic"]/h1')[0].text
            info['Наименование компании'] = name
            INN = Html.xpath('//*[@id="copy-inn"]')[0].text
            info['ИНН'] = INN
            legalAddress = Html.xpath("//div[text()='Юридический адрес']/../div[2]")[0].text
            info['Юр. Адресс'] = legalAddress
            directors = Html.xpath('//div[@class="ml-4"]')
            positionOfTheHead = directors[len(directors) - 1].xpath('.//div[1]')[0].text
            info['Должность руководителя'] = positionOfTheHead
            gen_fio = directors[len(directors) - 1].xpath('.//a')[0].text
            info['ФИО Руководителя'] = gen_fio
            INNofTheManager = directors[len(directors) - 1].xpath('.//div[2]/span[1]')[0].text
            info['ИНН Руководителя'] = INNofTheManager
            mainTypeOfActivity = Html.xpath('//*[@id="activity"]/table/tbody/tr/td[2]/a')[0].text
            info['Вид деятельности'] = mainTypeOfActivity
            activityTypeCode = Html.xpath('//*[@id="activity"]/table/tbody/tr/td[1]')[0].text
            info['Код вида деятельности'] = activityTypeCode
            numberOfEmployees = Html.xpath("//div[text()='Среднесписочная численность работников']/../div[2]")[0].text
            list = numberOfEmployees.split(' ')
            info['Количество сотрудников'] = list[0]
            dateOfRegistration = Html.xpath('//*[@id="basic"]/div[3]/div[1]/div[3]/div[2]')[0].text
            list = dateOfRegistration.split(' ')
            months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября',
                      'ноября', 'декабря']
            i = 1
            for month in months:
                if list[1] == month:
                    break
                else:
                    i += 1
            date = "%s.%d.%s" % (list[0], i, list[2])
            dateOfRegistration = datetime.datetime.strptime(date, '%d.%m.%Y')
            info['Дата регистрации компании'] = datetime.datetime.strftime(dateOfRegistration, '%d.%m.%Y')
            revenue = Html.xpath('//*[@id="fs-2110"]/span')[0].text
            info['Оборот компании'] = revenue
        if os.path.isfile(path + CONTACTS):
            HTML = self.readInFile(CONTACTS)
            phones = HTML.xpath('//*[@id="body"]/main/div/section/div[3]/div[1]/a[@rel="nofollow"][@class="black-link no-underline"]')
            Phones = self.lists(phones)
            info['Телефон'] = ', '.join(Phones)
            emails = HTML.xpath('//*[@id="body"]/main/div/section/div[3]/div[2]/a[@class="link"][@target="_blank"][@rel="nofollow"]')
            Emails = self.lists(emails)
            info['Почта'] = ', '.join(Emails)
            websites = HTML.xpath(
                '//*[@id="body"]/main/div/section/div[3]/div[2]/a[@class="link"][@target="_blank"][@rel="nofollow noopener"]')
            Websites = self.lists(websites)
            info['Сайт'] = ', '.join(Websites)
        return info
    @private
    @classmethod
    def readInFile(cls, File):
        with open(File, "r", encoding='utf-8') as file:
            webPage = file.read()
        return html.fromstring(webPage)
    @private
    @classmethod
    def lists(cls, lists):
        Lists = []
        for list in lists:
            Lists.append(list.text)
        return Lists
    def save(self, parsed_file_path):
        d = self.parse()
        with open(parsed_file_path, "w") as f:
            json.dump(d, f, ensure_ascii=False, indent=4)
parser = Parser(source=FILE_PATH)    # в конструкторе он принимает путь к файлу, сохраненному Downloader'ом
parser.parse()                       # должен вернуться список или словарь данных, полученных из кода страницы
parser.save(PARSED_FILE_PATH)        # сохраняет данные в виде json- или yaml-файла