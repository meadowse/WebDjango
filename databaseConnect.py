# import sqlite3;
# database = "" # путь к файлу базы данных. Если база данных расположена в памяти, а не на диске, то для открытия подключения используется ":memory:" 
# sqlite3.connect(database) # sqlite3.connect(database, timeout=5.0, detect_types=0, isolation_level='DEFERRED', check_same_thread=True, factory=sqlite3.Connection, cached_statements=128, uri=False)
# # подключение к базе данных 
# # получаем курсор
# cursor = con.cursor()

import sqlite3;
 
con = sqlite3.connect("metanit.db")
cursor = con.cursor()
 
# добавляем строку в таблицу people
cursor.execute("INSERT INTO people (name, age) VALUES ('Tom', 38)")
# выполняем транзакцию
con.commit() 