import json
import psycopg2
# from PIL import Image, ImageDraw
from psycopg2 import Error
from sshtunnel import SSHTunnelForwarder
def db():
    # Connect to a server using the ssh keys. See the sshtunnel documentation for using password authentication
    ssh_tunnel = SSHTunnelForwarder(
        ('10.13.13.2', 22),
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