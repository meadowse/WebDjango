#!/usr/bin/env python
import requests
import json
import os.path
from lxml import html
from accessify import private
path = '.'
try:
    API_KEY = os.environ["API_KEY"]
except KeyError as e:
    raise RuntimeError("Could not find a API_KEY in environment") from e
startUrl = 'https://api.checko.ru/v2/company?key=' + API_KEY + '&inn='
endUrl = '&source=true'                         # тут используйте адрес вашего сайта
ALLDATA = '/home/meadowse/companies/'            # эти параметры также индивидуальны для страницы, которую вы скрапите
CONTACTS = 'contacts.html'                      # Используйте ваше название. Будет более понятно,
                                                # Если будете использовать расширение html,
                                                # т.к. в этом файле будет код html-страницы
class Downloader:
    def __init__(self, inn, startUrl=startUrl, endUrl=endUrl, method="GET"):
        self.url = startUrl + inn + endUrl
        self.inn = inn
        self.method = method
        self._file_path = ALLDATA
        self.save()
    def get_html(self):
        try:
            text = self.htmlToText(self.url)
            # if 'По вашему запросу не найдено ни одного совпадения' in text:
            #     raise ValueError('неправильный ИНН или ОГРН')
            # elif 'Слишком короткий запрос' in text:
            #     raise ValueError('неправильный ИНН или ОГРН')
            # elif 'Действующая организация' in text or 'Действующая компания' in text:
            return text
            # else:
            #     print('Организация не действительна: ИНН: ' + self.inn)
            #     return ''
        except Exception as err:
            print(err)
            print('ИНН/ОГРН ошибки: ' + self.inn)
            return None
    @private
    @classmethod
    def getContactsHtml(cls, self):
        if os.path.isfile(ALLDATA):
            with open(self._file_path, "r", encoding='utf-8') as file:
                web_page = file.read()
            Html = html.fromstring(web_page)
            if len(Html.xpath('//*[@id="contacts"]')) != 0:
                linkContacts = Html.xpath('//*[@id="contacts"]/h2/a/@href')[0]
                linkContacts = startUrl + linkContacts
                return self.htmlToText(linkContacts)
            else:
                return ''
        else:
            return ''
    @private
    @classmethod
    def htmlToText(cls, link):
        reg = requests.get(link)
        return reg.text
    def save(self):
        s = self.get_html()
        if s != '':
            with open(ALLDATA + self.inn + '.json', "w") as file:
                d = json.loads(s)
                json.dump(d, file, ensure_ascii=False, indent=4)
        if self.getContactsHtml(self) != '':
            with open(CONTACTS, "w", encoding='utf-8') as file:
                file.write(self.getContactsHtml(self))
    def get_file_path(self):
        self.save()
        return self._file_path
    file_path = property(get_file_path)
# downloader = Downloader(url=urlAllData, inn=INN, params=PARAMS, method="GET")
# print(downloader.get_html())           # этот метод возвращает строку с контентом, которую получил по запросу на URL
# downloader.save(INN + ".html")         # метод сохраняет полученную строку в файл, путь к которому подается в
                                         # аргументе
