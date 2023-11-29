#!/usr/bin/env python
# from PyPDF2 import PdfFileReader, PdfFileWriter
from pathlib import Path
import fdb
import tika
import os
from os import path
from zipfile import ZipFile
import sys

import xml.etree.ElementTree as ET
import sqlite3 as sq
import datetime
import shutil
import config

os.system('CLS')

object_code = {'002001001000' : 'Земельный участок',
'002001002000' : 'Здание',
'002001003000' : 'Помещение',
'002001004000' : 'Сооружение',
'002001005000' : 'Объект незавершённого строительства',
'002001006000' : 'Предприятие как имущественный комплекс',
'002001008000' : 'Единый недвижимый комплекс',
'002001009000' : 'Машино-место',
'002001010000' : 'Иной объект недвижимости'}

def get_kn_without_status():
	with fdb.connect(host=config.host, database=config.database, user=config.user, password=config.password, charset=config.charset) as con:
		cur = con.cursor()
		sql = f"SELECT F10 FROM T1 WHERE F11 IS NULL"
		cur.execute(sql)
		result = cur.fetchone()[0]
		print(f"KN: {result}")
		return(result)

def change_status(status, date_time, kn):
	with fdb.connect(host=config.host, database=config.database, user=config.user, password=config.password, charset=config.charset) as con:
		cur = con.cursor()
		sql = f"UPDATE T1 SET F11 = '{status}', F15 = '{date_time}' WHERE F10 = '{kn}'"
		cur.execute(sql)
		con.commit()

def change_type(type_obj, kn):
	with fdb.connect(host=config.host, database=config.database, user=config.user, password=config.password, charset=config.charset) as con:
		cur = con.cursor()
		sql = f"UPDATE T1 SET F17 = '{type_obj}' WHERE F10 = '{kn}'"
		cur.execute(sql)
		con.commit()

def change_adress(adress, kn):
	with fdb.connect(host=config.host, database=config.database, user=config.user, password=config.password, charset=config.charset) as con:
		cur = con.cursor()
		sql = f"UPDATE T1 SET F18 = '{adress}' WHERE F10 = '{kn}'"
		cur.execute(sql)
		con.commit()

def add_rights(cad_number, type_object, right_type, right_data, right_holder_fio, right_holder_UL_name, right_holder_UL_inn):
	print(f'add_rights: {cad_number}, {type_object}, {right_type}, {right_data}, {right_holder_fio}, {right_holder_UL_name}, {right_holder_UL_inn}')
	with fdb.connect(host=config.host, database=config.database, user=config.user, password=config.password, charset=config.charset) as con:
		cur = con.cursor()
		sql = f"SELECT MAX(ID) FROM T2" 
		cur.execute(sql)
		max_id = cur.fetchone()[0]
		print(f'max_id: {max_id}')
		sql = f"INSERT INTO T2 VALUES ('{max_id+1}', '{cad_number}', '{right_data}', '{right_holder_fio}', '{right_holder_UL_inn}', '{right_type}', '{right_holder_UL_name}', '{type_object}', '{max_id+1}')"
		cur.execute(sql)
		con.commit()

def check_right_data(right_data):
	with fdb.connect(host=config.host, database=config.database, user=config.user, password=config.password, charset=config.charset) as con:
		cur = con.cursor()
		sql = f"SELECT F21 FROM T2 WHERE F21 = '{right_data}'"
		cur.execute(sql)
		result = cur.fetchone()
		print(f'result: {result}')
		return(result)

def write_log(log):
	with open("log.txt", "a") as file:
		file.write(log + '\n')	
def read_xml():
	kol = 0
	for root, dirs, files in os.walk("."):  
		for filename in files:
			kol += 1
			print(f'№_________________ {kol}____________________')
			print(f'filename: {filename}')
			write_log(filename)
			ex = path.splitext(filename)[1]
			if ex == '.zip':
				with ZipFile(filename, "r") as myzip:
					# print(myzip.namelist())
					for zipped_file in myzip.namelist():
						if zipped_file[-4:] == '.xml':
							pdf_file = zipped_file[:-4] + ' ЭП.pdf'
							print(f'pdf_file: {pdf_file}')
							with myzip.open(zipped_file, "r") as xml_file:
								now = datetime.datetime.now().strftime("%Y.%m.%d_%H-%M-%S")
								print('=====================')
								root = ET.parse(xml_file)
								cad_number = root.find('.//cad_number').text
								print(cad_number)
								write_log(cad_number)
								# change_status('Скачан', now, cad_number)
								readable_address = root.find('.//readable_address').text
								print(readable_address)
								# change_adress(readable_address, cad_number)
								code = root.find('.//code').text
								# print(code)
								print(type_object:=object_code[code])
								change_type(type_object, cad_number)
								registrations = root.findall('./right_records/right_record')
								for i in registrations:
									print(right_type:=i.find('./right_data/right_type/value').text)
									print(right_data:=i.find('./right_data/right_number').text)
									if check_right_data(right_data) == None:
										try:
											print(right_holder_fio:=i.find('./right_holders/right_holder/individual/surname').text + " " +
											i.find('./right_holders/right_holder/individual/name').text +  " " + 
											i.find('./right_holders/right_holder/individual/patronymic').text)
											add_rights(cad_number, type_object, right_type, right_data, right_holder_fio, '-', '-')
										except Exception as ex:
											pass #print(f'Ошибка в ФЛ:{ex}')
										try:
											print(right_holder_UL_name:=f"{i.find('./right_holders/right_holder/legal_entity/entity/resident/name').text}")
											print(right_holder_UL_inn:=f"{i.find('./right_holders/right_holder/legal_entity/entity/resident/inn').text}")
											add_rights(cad_number, type_object, right_type, right_data, "-",right_holder_UL_name, right_holder_UL_inn)
										except Exception as ex:
											pass # print(f'Ошибка в ЮЛ:{ex}')
										print('------------------')
									else:
										pass
								restricts = root.findall('./restrict_records/restrict_record')
								for i in restricts:
									print(restriction_encumbrance_type:=i.find('./restrictions_encumbrances_data/restriction_encumbrance_type/value').text)
									print(restrictions_encumbrances_data:=i.find('./restrictions_encumbrances_data/restriction_encumbrance_number').text)
									if check_right_data(restrictions_encumbrances_data) == None:
										try:
											print(right_holder_fio:=i.find('./right_holders/right_holder/individual/surname').text,
											i.find('./right_holders/right_holder/individual/name').text, 
											i.find('./right_holders/right_holder/individual/patronymic').text)
											add_rights(cad_number, type_object, restriction_encumbrance_type, restrictions_encumbrances_data, right_holder_fio, '-', '-')
										except Exception as ex:
											print(f'Ошибка в ФЛ:{ex}')
										try:
											print(right_holder_UL_name:=f"{i.find('./right_holders/right_holder/legal_entity/entity/resident/name').text}")
											print(right_holder_UL_inn:=f"{i.find('./right_holders/right_holder/legal_entity/entity/resident/inn').text}")
											add_rights(cad_number, type_object, restriction_encumbrance_type, restrictions_encumbrances_data, "-",right_holder_UL_name, right_holder_UL_inn)
										except Exception as ex:
											print(f'Ошибка в ЮЛ:{ex}')
										print('------------------')
									else:
										pass
				# 				cad_number_ = cad_number.replace(':','-')
				# 				myzip.extract(pdf_file)
				# 				shutil.copy(pdf_file, f'output_pdf\{cad_number_}_{type_object}.pdf')
				# 				os.remove(pdf_file)
				# try:
				# 	os.rename(filename,f'output_zip\{cad_number_}_{type_object}.zip')	
				# 	print('Переместил')
				# except:
				# 	write_log(f'Удалили файл {filename} потому что он такой уже существовал: {cad_number_}_{type_object}.zip')	
				# 	os.remove(filename)	
				# 	print('Удалил')				
read_xml()
# add_rights('cad_number', 'type_object', 'right_type', 'right_data', 'right_holder_fio', 'right_holder_UL_name', 'right_holder_UL_inn')