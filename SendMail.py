import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication
import smtplib
import myTimePass
from test import *

# def sendMail(recipients, type, email):
#     user = email
#     mesages = query_db() # TODO пщлучение темы письма и текста. Шаблон является html
#     passwd = query_db() # TODO делаем запрос на получение пароля из бд
#     getter = recipients[email] # список получателей
#     msg = MIMEMultipart()
#     msg["From"] = user
#     msg["Subject"] = mesages[Subject] # вводим тему письма
#     server = smtplib.SMTP("smtp.yandex.ru", 587)
#     with open("EmailCount/templates/EmailCount/mail.html", encoding='utf-8') as f:
#         tmp = f.read()
#     # переименовка параметров
#     personalized_template = tmp.replace('{name_member}', "Анастасия")
#     personalized_template = personalized_template.replace( '${name_event}', "\"Танцы с бубном\"")
#     msg.attach(MIMEText(personalized_template, "html"))
#     server.starttls()
#     server.login(user, passwd)
#     server.sendmail(user, getter, msg.as_string())






def sendMail(recipients): # принимает адреса, тему письма, текст письма
    # user = "nastya12.11@yandex.ru"
    # passwd = myTimePass.password
    # getter = "chertilinaaa@stud.kai.ru"   #recipients # "nastya12.11@yandex.ru"
    # msg = MIMEMultipart()
    # msg["From"] = "nastya12.11@yandex.ru"
    # msg["Subject"] = "открой меня"
    # msg["name_member"] = "nastya"
    # server = smtplib.SMTP("smtp.yandex.ru", 587)
    # with open("EmailCount/templates/EmailCount/index.html", encoding='utf-8') as f:
    #     tmp = f.read()
    # personalized_template = tmp.replace('{name_member}', "Анастасия")
    # personalized_template = personalized_template.replace( '${name_event}', "\"Танцы с бубном\"")
    # msg.attach(MIMEText(personalized_template, "html"))
    # server.starttls()
    # server.login(user, passwd)
    # server.sendmail(user, getter, msg.as_string())
# TODO дальше идет черновой вариант рассылки
    #user = "nastya12.11@yandex.ru"
    passwd = myTimePass.password
    msg = MIMEMultipart()
    msg["From"] = user
    msg["Subject"] = "открой меня"
    content = 'C:/Users/MPK_34/Desktop/MPK-main/email/index.html'
    for i in recipients:
        try:
            print(i)
            getter = i[0]['mail']
            with open(content, encoding='utf-8') as f:
                tmp = f.read()
            msg["name_member"] = i[0]['fio_head']
            server = smtplib.SMTP("smtp.yandex.ru", 587)
            personalized_template = tmp.replace('{{Name_member}}', i[0]['fio_head'])
            personalized_template = personalized_template.replace('{{appeal}}', i[0]['appeal'])
            personalized_template = personalized_template.replace('{{address}}', i[0]['legal_address'])
            msg.attach(MIMEText(personalized_template, "html"))
            server.starttls()
            server.login(user, passwd)
            server.sendmail(user, getter, msg.as_string())
            print('done')
        except:
            return (i)