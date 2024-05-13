import psycopg2


def db():
    return psycopg2.connect(user="meadowse",
                            # пароль, который указали при установке PostgreSQL
                            password="Comebackplz56!!",
                            host="localhost",
                            database="meadowse")


def Insert_db(query, args=(), one=False):
    connection = db()
    cur = connection.cursor()
    cur.execute(query, args)
    connection.commit()
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


def callProc(name, Id, one=False):
    cur = db().cursor()
    cur.callproc(name, (Id,))
    r = [dict((cur.description[i][0], value)
              for i, value in enumerate(row)) for row in cur.fetchall()]
    cur.connection.close()
    return (r[0] if r else None) if one else r


def callProcWitTwo(name, Id, param2, one=False):
    cur = db().cursor()
    cur.callproc(name, (Id, param2))
    r = [dict((cur.description[i][0], value)
              for i, value in enumerate(row)) for row in cur.fetchall()]
    cur.connection.close()
    return (r[0] if r else None) if one else r
