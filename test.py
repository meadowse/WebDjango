import json
import psycopg2
# from PIL import Image, ImageDraw
from psycopg2 import Error

def db():
    return psycopg2.connect(user="meadowse",
                            password="Comebackplz56!!",  # пароль, который указали при установке PostgreSQL
                            host="127.0.0.1",
                            port="5432",
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
    cursor = db().cursor()
    if args == ():
        cursor.execute(query)
    else:
        cursor.execute(query, args)
    r = [dict((cursor.description[i][0], value)
              for i, value in enumerate(row)) for row in cursor.fetchall()]
    cursor.connection.close()
    return (r[0] if r else None) if one else r

def callProc(name, id, one=False):
    cur = db().cursor()
    cur.callproc(name, (id,))
    r = [dict((cur.description[i][0], value) \
              for i, value in enumerate(row)) for row in cur.fetchall()]
    cur.connection.close()
    return (r[0] if r else None) if one else r

def callProcWitTwo(name, id,param2, one=False):
    cur = db().cursor()
    cur.callproc(name, (id,param2))
    r = [dict((cur.description[i][0], value) \
              for i, value in enumerate(row)) for row in cur.fetchall()]
    cur.connection.close()
    return (r[0] if r else None) if one else r