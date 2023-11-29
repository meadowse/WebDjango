import json
import psycopg2
# from PIL import Image, ImageDraw
from psycopg2 import Error
from sshtunnel import SSHTunnelForwarder


# image= Image.new('RGB',(500,500),(255,255,255))
# draw = ImageDraw.Draw(image)
#
# image.save('sticker.txt')
# def SqlQuery(sqlQuery):
#     try:
#         # Подключиться к существующей базе данных
#         connection = psycopg2.connect(user="postgres",
#                                       # пароль, который указали при установке PostgreSQL
#                                       password="1",
#                                       host="127.0.0.1",
#                                       port="5432",
#                                       database="postgres")
#
#         cursor = connection.cursor()
#         postgreSQL_select_Query = sqlQuery
#         # # Выполнение SQL-запроса для вставки данных в таблицу
#         # insert_query = """ INSERT INTO mobile (ID, MODEL, PRICE) VALUES
#         #                                       (1, 'IPhone 12', 1000),
#         #                                       (2, 'Google Pixel 2', 700),
#         #                                       (3, 'Samsung Galaxy S21', 900),
#         #                                       (4, 'Nokia', 800)"""
#         cursor.execute(postgreSQL_select_Query)
#         mobile_records = cursor.fetchall()
#         # connection.commit()
#
#     except (Exception, Error) as error:
#         print("Ошибка при работе с PostgreSQL", error)
#     finally:
#         if connection:
#             cursor.close()
#             connection.close()
#             print("Соединение с PostgreSQL закрыто")
#     return mobile_records


def db():
    # Connect to a server using the ssh keys. See the sshtunnel documentation for using password authentication
    ssh_tunnel = SSHTunnelForwarder(
        ('192.168.0.62', 22),
        ssh_pkey="~/.ssh/id_rsa",
        ssh_username="meadowse",
        remote_bind_address=('localhost', 5432), )
    ssh_tunnel.start()
    return psycopg2.connect(user="meadowse",
                                      # пароль, который указали при установке PostgreSQL
                                      password="Comebackplz56!!",
                                      host="localhost",
                                      port=ssh_tunnel.local_bind_port,
                                      database="meadowse")


def Insert_db(query, args=(), one=False):
    connection = db()
    cur = connection.cursor()
    print(args)
    cur.execute(query, args)
    print(query)
    connection.commit()
    # count = cursor.rowcount
    cur.close()
    connection.close()


def query_db(query, args=(), one=False):
    cur = db().cursor()
    cur.execute(query, args)
    r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
    cur.connection.close()
    return (r[0] if r else None) if one else r


def callProc(name, id, one=False):
    cur = db().cursor()
    cur.callproc(name, (id,))
    r = [dict((cur.description[i][0], value) \
              for i, value in enumerate(row)) for row in cur.fetchall()]
    cur.connection.close()
    return (r[0] if r else None) if one else r


def callProcWitTwo(name, id, param2, one=False):
    cur = db().cursor()
    cur.callproc(name, (id, param2))
    r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
    cur.connection.close()
    return (r[0] if r else None) if one else r
