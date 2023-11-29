#!/usr/bin/env python
import json
# from parcer import PARSED_FILE_PATH


def some_logic(parsed_file_path):  # =PARSED_FILE_PATH
    with open(parsed_file_path, "r") as f:
        data = json.load(f)
    return data


# d = some_logic('/home/meadowse/companies/0274062111.json')
# # with open('/home/meadowse/Загрузки/okved_2.json', "w") as f:
# #     json.dump(d, f, ensure_ascii=False, indent=4)
# print(type(d.get('data').get('Контакты').get('ВебСайт')))
