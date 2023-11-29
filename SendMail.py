import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication
import smtplib
import myTimePass
from test import *

def sendMail(recipients): # принимает адреса, тему письма, текст письма
# TODO дальше идет черновой вариант рассылки
    user = "mosproektstrojinfo@gmail.com"
    passwd = "hND-4KE-URW-SyN"
    msg = MIMEMultipart()
    msg["From"] = user
    msg["Subject"] = "открой меня"
    content = 'C:/Users/MPK_34/Desktop/Server/EmailCount/templates/EmailCount/index.html'

    for i in recipients:
            print(i)
            getter = i[0]['mail']
            with open(content, encoding='utf-8') as f:
                tmp = f.read()
            print(recipients)
            msg["name_member"] = i[0]['fio_head']
            server = smtplib.SMTP("smtp.gmail.ru", 587)
            personalized_template = tmp.replace('{{Name_member}}', i[0]['fio_head'])
            personalized_template = personalized_template.replace('{{appeal}}', i[0]['appeal'])
            personalized_template = personalized_template.replace('{{address}}', i[0]['legal_address'])
            msg.attach(MIMEText(personalized_template, "html"))
            server.starttls()
            server.login(user, passwd)
            server.sendmail(user, getter, msg.as_string())
            print('done')
        # except Exception as e:
            print(e)
            return (i)