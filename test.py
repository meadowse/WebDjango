import psycopg2

try:
    PASSWORD = os.environ["PASSWORD"]
except KeyError as e:
    raise RuntimeError("Could not find a PASSWORD in environment") from e

try:
    USER = os.environ["USER"]
except KeyError as e:
    raise RuntimeError("Could not find a USER in environment") from e

try:
    NAME = os.environ["NAME"]
except KeyError as e:
    raise RuntimeError("Could not find a NAME in environment") from e

def db():
    return psycopg2.connect(user=USER,
                            # пароль, который указали при установке PostgreSQL
                            password=PASSWORD,
                            host="localhost",
                            database=NAME)


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
