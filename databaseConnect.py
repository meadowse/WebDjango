import json
from test import query_db


def search(request, searchStr):
    if request.method == 'GET':
        obj = {
            # 'search': 'акб',  # что мы ищем
            # 'absence':  # исключить пустые строки столбцов, это массив перечисленных столбцов, в которых надо
            #              # исключить пустые строки
            # ['legal_address', 'position_head', 'fio_head', 'telephone', 'mail', 'website', 'type_activity'],
            # 'email_newsletter': 1,  # участвовал в рассылке: 1 - Да, 0 - Нет
            # 'mail_newsletter': 1,
            # 'sms_mailing': 1,
            # 'the_bell': 1,
            # 'revenue': 0,  # значение от которого отталкиваемся в обороте
            # 'comparison': -1,  # 0 - равно, 1 - больше, -1 - меньше
            # 'data_source': 'СУД',  # источник данных
            # 'order by': 'revenue',     # сортировочный столбец (здесь в принципе можно передавать номер столбца
            #                            # начиная с 1 - 'company_name')
            # 'desc': 1,  # сортировка по: 0 - возрастанию, 1 - убыванию
            # 'limit': 10,  # кол-во строк, 0 - все данные
        }
    else:
        obj = json.loads(request.body)

    if searchStr.find('where') == -1:
        where = 'where id > 0'
    else:
        where = ''

    Search = obj.get('search')
    if Search is not None:
        where += ((" and concat(company_name, '|', inn_company, '|', legal_address, '|', position_head, '|', "
                   "fio_head, '|', telephone, '|', mail, '|', website, '|', type_activity, '|', revenue, '|', "
                   "email_newsletter, '|', mail_newsletter, '|', sms_mailing, '|', the_bell) "
                   "ilike '%") + str(Search) + "%'")

    email_newsletter = obj.get('email_newsletter')
    if email_newsletter is not None:
        if email_newsletter == 1:
            where += ' and email_newsletter is not null'
        elif email_newsletter == 0:
            where += ' and email_newsletter is null'

    mail_newsletter = obj.get('mail_newsletter')
    if mail_newsletter is not None:
        if mail_newsletter == 1:
            where += ' and mail_newsletter is not null'
        elif mail_newsletter == 0:
            where += ' and mail_newsletter is null'

    sms_mailing = obj.get('sms_mailing')
    if sms_mailing is not None:
        if sms_mailing == 1:
            where += ' and sms_mailing is not null'
        elif sms_mailing == 0:
            where += ' and sms_mailing is null'

    the_bell = obj.get('the_bell')
    if the_bell is not None:
        if the_bell == 1:
            where += ' and the_bell is not null'
        elif the_bell == 0:
            where += ' and the_bell is null'

    revenue = obj.get('revenue')
    if revenue is not None:
        comparison = obj.get('comparison')
        if comparison is None or comparison == 1:
            where += ' and revenue > ' + str(revenue)
        elif comparison == 0:
            where += ' and revenue = ' + str(revenue)
        elif comparison == -1:
            where += ' and revenue < ' + str(revenue)

    absence = obj.get('absence')
    if absence is not None:
        if len(absence) != 0:
            for elem in absence:
                if elem == 'telephone' or elem == 'mail':
                    where += ' and ' + elem + " != '{}'"
                elif elem == 'type_activity':
                    where += ' and ' + elem + " != ' '"
                else:
                    where += ' and ' + elem + " != ''"

    dataSource = obj.get('data_source')
    if dataSource is not None:
        where += " and '" + str(dataSource) + "' = any (data_source)"

    orderBy = obj.get('order by')
    if orderBy is None:
        orderBy = 'company_name'
    desc = obj.get('desc')
    if desc is not None:
        if obj.get('desc') == 1:
            orderBy += ' desc'

    limit = obj.get('limit')
    if limit is None:
        limit = 50
    else:
        if limit == 0:
            limit = 'all'

    offset = obj.get('page')
    if offset is None or offset == 0:
        offset = 1
    else:
        print(offset)
        offset -= 1
        offset = offset * limit + 1
        limit += offset - 1
        print(offset)

    Str = "select count(*) from (" + searchStr + (" %s order by %s) as c" % (where, orderBy))
    print(Str)
    count = query_db(Str)
    Str = "SELECT * FROM (SELECT a.*, row_number() over () as rnum FROM (" + searchStr + (" %s ORDER BY %s) a) al "
                                                                                          "WHERE al.rnum between %s "
                                                                                          "and %s" % (where, orderBy,
                                                                                                      offset, limit))
    print(Str)
    rez = query_db(Str)
    Info = {'Info': rez}
    Info.update(count[0])
    return Info


def searchObjects(request, searchStr):
    if request.method == 'GET':
        obj = {
            'search': 'test',  # что мы ищем
            # 'absence':  # исключить пустые строки столбцов, это массив перечисленных столбцов, в которых надо
            #              # исключить пустые строки
            # ['legal_address', 'position_head', 'fio_head', 'telephone', 'mail', 'website', 'type_activity'],
            # 'email_newsletter': 1,  # участвовал в рассылке: 1 - Да, 0 - Нет
            # 'mail_newsletter': 1,
            # 'sms_mailing': 1,
            # 'the_bell': 1,
            # 'revenue': 0,  # значение от которого отталкиваемся в обороте
            # 'comparison': -1,  # 0 - равно, 1 - больше, -1 - меньше
            # 'data_source': 'СУД',  # источник данных
            # 'order by': 'revenue',     # сортировочный столбец (здесь в принципе можно передавать номер столбца
            #                            # начиная с 1 - 'company_name')
            # 'desc': 1,  # сортировка по: 0 - возрастанию, 1 - убыванию
            # 'limit': 10,  # кол-во строк, 0 - все данные
        }
    else:
        obj = json.loads(request.body)

    if searchStr.find('where') == -1:
        where = 'where id > 0'
    else:
        where = ''

    Search = obj.get('search')
    if Search is not None:
        where += ((" and concat(company_name, '|', inn_company, '|', address, '|', cadastral_number, '|', "
                   "object_type, '|', district, '|', data_source, '|', number_right, '|', type_right, '|', "
                   "email_newsletter, '|', mail_newsletter, '|', sms_mailing, '|', the_bell) "
                   "ilike '%") + str(Search) + "%'")

    email_newsletter = obj.get('email_newsletter')
    if email_newsletter is not None:
        if email_newsletter == 1:
            where += ' and email_newsletter is not null'
        elif email_newsletter == 0:
            where += ' and email_newsletter is null'

    mail_newsletter = obj.get('mail_newsletter')
    if mail_newsletter is not None:
        if mail_newsletter == 1:
            where += ' and mail_newsletter is not null'
        elif mail_newsletter == 0:
            where += ' and mail_newsletter is null'

    sms_mailing = obj.get('sms_mailing')
    if sms_mailing is not None:
        if sms_mailing == 1:
            where += ' and sms_mailing is not null'
        elif sms_mailing == 0:
            where += ' and sms_mailing is null'

    the_bell = obj.get('the_bell')
    if the_bell is not None:
        if the_bell == 1:
            where += ' and the_bell is not null'
        elif the_bell == 0:
            where += ' and the_bell is null'

    revenue = obj.get('square')
    if revenue is not None:
        comparison = obj.get('comparison')
        if comparison is None or comparison == 1:
            where += ' and square > ' + str(revenue)
        elif comparison == 0:
            where += ' and square = ' + str(revenue)
        elif comparison == -1:
            where += ' and square < ' + str(revenue)

    absence = obj.get('absence')
    if absence is not None:
        if len(absence) != 0:
            for elem in absence:
                if elem == 'telephone' or elem == 'mail':
                    where += ' and ' + elem + " != '{}'"
                elif elem == 'type_activity':
                    where += ' and ' + elem + " != ' '"
                else:
                    where += ' and ' + elem + " != ''"

    dataSource = obj.get('data_source')
    if dataSource is not None:
        where += " and '" + str(dataSource) + "' = any (data_source)"

    orderBy = obj.get('order by')
    if orderBy is None:
        orderBy = 'cadastral_number'
    desc = obj.get('desc')
    if desc is not None:
        if obj.get('desc') == 1:
            orderBy += ' desc'

    limit = obj.get('limit')
    if limit is None:
        limit = 50
    else:
        if limit == 0:
            limit = 'all'

    offset = obj.get('page')
    if offset is None or offset == 0:
        offset = 1
    else:
        print(offset)
        offset -= 1
        offset = offset * limit + 1
        limit += offset - 1
        print(offset)

    Str = "select count(*) from (" + searchStr + (" %s order by %s) as c" % (where, orderBy))
    print(Str)
    count = query_db(Str)
    Str = "SELECT * FROM (SELECT a.*, row_number() over () as rnum FROM (" + searchStr + (" %s ORDER BY %s) a) al "
                                                                                          "WHERE al.rnum between %s "
                                                                                          "and %s" % (where, orderBy,
                                                                                                      offset, limit))
    print(Str)
    rez = query_db(Str)
    Info = {'Info': rez}
    Info.update(count[0])
    return Info
