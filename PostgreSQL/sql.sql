-- Показывает компании которых нет в базе
select * from private.companies where id in (select "ИНН"::bigint from companies2024);

-- Добавляет компании которых нет в базе
insert into private.companies (id, id_type_activity, id_position_head, inn_company, company_name, legal_address, fio_head, inn_head, update_date, telephone, mail, website)
select "ИНН"::bigint as id, 57 as id_type_activity, l.id as id_position_head, "ИНН" as inn_company, "Название" as company_name, "Юр. адрес" as legal_address, "ФИО рук." as fio_head, "ИНН рук." as inn_head, now() as update_date,
       "Телефоны" as telephone, "Почты" as mail, "Сайты" as website from companies2024 c join private.leadership_positions l on l.position_head = c."Должность рук." where "ИНН"::bigint not in (select id from private.companies);

-- Обновление данных о компании в БД
update private.companies co set id = "ИНН"::bigint, id_position_head = l.id, inn_company = "ИНН", company_name = "Название", legal_address = "Юр. адрес", fio_head = "ФИО рук.", inn_head = "ИНН рук.", update_date = now(), telephone = "Телефоны",
                                mail = "Почты", website = "Сайты" from companies2024 c join private.leadership_positions l on l.position_head = c."Должность рук." where co.id = "ИНН"::bigint;

-- Добавляет должности, которых нет в базе
insert into private.leadership_positions (position_head)
select distinct "Должность рук." as position_head from companies2024 where "Должность рук." not in (select position_head from private.leadership_positions);

-- Преобразует телефоны и почты в массивы
update companies2024 set "Телефоны" = string_to_array(regexp_replace("Телефоны", '\s*,\s', ',', 'g'), ',');
update companies2024 set "Почты" = string_to_array(regexp_replace("Почты", '\s*,\s', ',', 'g'), ',');

-- Переделывает сайт, если он некорректного формата
update companies2024 set "Сайты" = regexp_replace("Сайты", '\s*,\s', '', 'g');
update private.companies set website = regexp_replace(website, '\s*,\s', '', 'g');

-- Добавляет источник данных
insert into private.companies_data_sources (id_company, id_data_source)
select "ИНН"::bigint as id_company, 7 as id_data_source from companies2024;

-- Компании, которые есть в базе
select * from companies where id in (select "ИНН"::bigint from companies2024);

-- Обновление данных о компаниях
update companies set id = "ИНН"::bigint, position_head_dp = "Должность рук. в дат. падеже", fio_dp = "ФИО рук. в дат. падеже", io = "ИО рук.", appeal = "Уважаемый", index = "Индекс" from companies2024 where "ИНН"::bigint = id;

-- Добавление компаний
insert into companies (id, position_head_dp, fio_dp, io, appeal, index) select "ИНН"::bigint as id, "Должность рук. в дат. падеже" as position_head_dp, "ФИО рук. в дат. падеже" as fio_dp, "ИО рук." as io, "Уважаемый" as appeal, "Индекс" as index
                                                                        from companies2024 where "ИНН"::bigint not in (select id from companies);
-- Обновление данных из основной базы
update companies c set id = co.id, name = co.company_name, legal_address = co.legal_address from private.companies co where c.id = co.id;

-- Присвоение статуса 'Действует'
update private.companies set status = 'Действует' where status is null

-- Создание функции расчёта стоимости
create function price(n_max bigint, s smallint, value numeric, n_min bigint, n smallint default 100)
    returns bigint
    language plpgsql
as
$$
BEGIN
RETURN n_min + ((value - s) / n * (n_max - n_min));
END; $$;

-- Замена запятых на точки
update private.cadastral_numbers set square = regexp_replace(square, ',', '.', 'g');

-- Проверка функции расчёта стоимости
select * from price(330000::bigint, 500::smallint, 1000::numeric, 290000::bigint, 500::smallint);
select * from price(227000::bigint, 500::smallint, 1000::numeric, 200000::bigint, 500::smallint);

-- Создание функции расчёта ЗОСов
create function zos(square numeric)
    returns bigint
    language plpgsql
as
$$
BEGIN
return CASE WHEN square > 0 and square <= 100 THEN price(180000::bigint, 0::smallint, square, 160000::bigint, 100::smallint)
    WHEN square > 100 and square <= 150 THEN price(195000::bigint, 100::smallint, square, 180000::bigint, 50::smallint)
    WHEN square > 150 and square <= 250 THEN price(225000::bigint, 150::smallint, square, 195000::bigint, 100::smallint)
    WHEN square > 250 and square <= 300 THEN price(255000::bigint, 250::smallint, square, 225000::bigint, 50::smallint)
    WHEN square > 300 and square <= 500 THEN price(290000::bigint, 300::smallint, square, 255000::bigint, 200::smallint)
    WHEN square > 500 and square <= 1000 THEN price(330000::bigint, 500::smallint, square, 290000::bigint, 500::smallint)
    WHEN square > 1000 and square <= 2000 THEN price(375000::bigint, 1000::smallint, square, 330000::bigint, 1000::smallint)
    WHEN square > 2000 and square <= 3000 THEN price(418000::bigint, 2000::smallint, square, 375000::bigint, 1000::smallint)
    WHEN square > 3000 and square <= 4000 THEN price(462000::bigint, 3000::smallint, square, 418000::bigint, 1000::smallint)
    WHEN square > 4000 and square <= 5000 THEN price(504000::bigint, 4000::smallint, square, 462000::bigint, 1000::smallint)
    WHEN square > 5000 and square <= 6000 THEN price(545000::bigint, 5000::smallint, square, 504000::bigint, 1000::smallint)
    WHEN square > 6000 and square <= 7000 THEN price(583000::bigint, 6000::smallint, square, 545000::bigint, 1000::smallint)
    WHEN square > 7000 and square <= 8000 THEN price(620000::bigint, 7000::smallint, square, 583000::bigint, 1000::smallint)
    WHEN square > 8000 and square <= 9000 THEN price(652000::bigint, 8000::smallint, square, 620000::bigint, 1000::smallint)
    WHEN square > 9000 and square <= 10000 THEN price(685000::bigint, 9000::smallint, square, 652000::bigint, 1000::smallint)
    WHEN square > 10000 and square <= 11000 THEN price(715000::bigint, 10000::smallint, square, 685000::bigint, 1000::smallint)
    WHEN square > 11000 and square <= 12000 THEN price(745000::bigint, 11000::smallint, square, 715000::bigint, 1000::smallint)
    WHEN square > 12000 and square <= 13000 THEN price(775000::bigint, 12000::smallint, square, 745000::bigint, 1000::smallint)
    WHEN square > 13000 and square <= 14000 THEN price(805000::bigint, 13000::smallint, square, 775000::bigint, 1000::smallint)
    WHEN square > 14000 and square <= 15000 THEN price(835000::bigint, 14000::smallint, square, 805000::bigint, 1000::smallint)
    WHEN square > 15000 and square <= 16000 THEN price(862500::bigint, 15000::smallint, square, 835000::bigint, 1000::smallint)
    WHEN square > 16000 and square <= 17000 THEN price(890000::bigint, 16000::smallint, square, 862500::bigint, 1000::smallint)
    WHEN square > 17000 and square <= 18000 THEN price(915000::bigint, 17000::smallint, square, 890000::bigint, 1000::smallint)
    WHEN square > 18000 and square <= 19000 THEN price(942000::bigint, 18000::smallint, square, 915000::bigint, 1000::smallint)
    WHEN square > 19000 and square <= 20000 THEN price(965000::bigint, 19000::smallint, square, 942000::bigint, 1000::smallint)
    WHEN square > 20000 and square <= 21000 THEN price(992000::bigint, 21000::smallint, square, 965000::bigint, 1000::smallint)
    WHEN square > 21000 and square <= 22000 THEN price(1015000::bigint, 22000::smallint, square, 992000::bigint, 1000::smallint)
    WHEN square > 22000 and square <= 23000 THEN price(1040000::bigint, 23000::smallint, square, 1015000::bigint, 1000::smallint)
END;
END
$$;

-- Проверка функции расчёта ЗОСов
select * from zos(1000);

-- Создание функции расчёта АГРов
create function agr(square numeric)
    returns bigint
    language plpgsql
as
$$
BEGIN
return CASE WHEN square > 0 and square <= 100 THEN price(129000::bigint, 0::smallint, square, 115000::bigint, 100::smallint)
    WHEN square > 100 and square <= 150 THEN price(140000::bigint, 100::smallint, square, 129000::bigint, 50::smallint)
    WHEN square > 150 and square <= 250 THEN price(161000::bigint, 150::smallint, square, 140000::bigint, 100::smallint)
    WHEN square > 250 and square <= 300 THEN price(175000::bigint, 250::smallint, square, 161000::bigint, 50::smallint)
    WHEN square > 300 and square <= 500 THEN price(200000::bigint, 300::smallint, square, 175000::bigint, 200::smallint)
    WHEN square > 500 and square <= 1000 THEN price(227000::bigint, 500::smallint, square, 200000::bigint, 500::smallint)
    WHEN square > 1000 and square <= 2000 THEN price(267000::bigint, 1000::smallint, square, 227000::bigint, 1000::smallint)
    WHEN square > 2000 and square <= 3000 THEN price(300000::bigint, 2000::smallint, square, 267000::bigint, 1000::smallint)
    WHEN square > 3000 and square <= 4000 THEN price(335000::bigint, 3000::smallint, square, 300000::bigint, 1000::smallint)
    WHEN square > 4000 and square <= 5000 THEN price(367000::bigint, 4000::smallint, square, 335000::bigint, 1000::smallint)
    WHEN square > 5000 and square <= 6000 THEN price(396000::bigint, 5000::smallint, square, 367000::bigint, 1000::smallint)
    WHEN square > 6000 and square <= 7000 THEN price(425000::bigint, 6000::smallint, square, 396000::bigint, 1000::smallint)
    WHEN square > 7000 and square <= 8000 THEN price(456000::bigint, 7000::smallint, square, 425000::bigint, 1000::smallint)
    WHEN square > 8000 and square <= 9000 THEN price(483000::bigint, 8000::smallint, square, 456000::bigint, 1000::smallint)
    WHEN square > 9000 and square <= 10000 THEN price(510000::bigint, 9000::smallint, square, 483000::bigint, 1000::smallint)
    WHEN square > 10000 and square <= 11000 THEN price(535000::bigint, 10000::smallint, square, 510000::bigint, 1000::smallint)
    WHEN square > 11000 and square <= 12000 THEN price(561000::bigint, 11000::smallint, square, 535000::bigint, 1000::smallint)
    WHEN square > 12000 and square <= 13000 THEN price(585000::bigint, 12000::smallint, square, 561000::bigint, 1000::smallint)
    WHEN square > 13000 and square <= 14000 THEN price(605000::bigint, 13000::smallint, square, 585000::bigint, 1000::smallint)
    WHEN square > 14000 and square <= 15000 THEN price(628000::bigint, 14000::smallint, square, 605000::bigint, 1000::smallint)
    WHEN square > 15000 and square <= 16000 THEN price(651000::bigint, 15000::smallint, square, 628000::bigint, 1000::smallint)
    WHEN square > 16000 and square <= 17000 THEN price(676000::bigint, 16000::smallint, square, 651000::bigint, 1000::smallint)
    WHEN square > 17000 and square <= 18000 THEN price(699000::bigint, 17000::smallint, square, 676000::bigint, 1000::smallint)
    WHEN square > 18000 and square <= 19000 THEN price(722000::bigint, 18000::smallint, square, 699000::bigint, 1000::smallint)
    WHEN square > 19000 and square <= 20000 THEN price(745000::bigint, 19000::smallint, square, 722000::bigint, 1000::smallint)
    WHEN square > 20000 and square <= 21000 THEN price(768000::bigint, 21000::smallint, square, 745000::bigint, 1000::smallint)
    WHEN square > 21000 and square <= 22000 THEN price(788000::bigint, 22000::smallint, square, 768000::bigint, 1000::smallint)
    WHEN square > 22000 and square <= 23000 THEN price(810000::bigint, 23000::smallint, square, 788000::bigint, 1000::smallint)
END;
END
$$;

-- Проверка функции расчёта АГРов
select * from agr(1000);

-- Создание функции расчёта времени выполнения работ
create function days(square numeric)
    returns text
    language plpgsql
as
$$
BEGIN
return CASE WHEN square > 0 and square <= 100 THEN '14 раб/дн'
    WHEN square > 100 and square <= 150 THEN '15 раб/дн'
    WHEN square > 150 and square <= 250 THEN '15 раб/дн'
    WHEN square > 250 and square <= 300 THEN '15 раб/дн'
    WHEN square > 300 and square <= 500 THEN '16 раб/дн'
    WHEN square > 500 and square <= 1000 THEN '17 раб/дн'
    WHEN square > 1000 and square <= 2000 THEN '18 раб/дн'
    WHEN square > 2000 and square <= 3000 THEN '19 раб/дн'
    WHEN square > 3000 and square <= 4000 THEN '20 раб/дн'
    WHEN square > 4000 and square <= 5000 THEN '21 раб/дн'
    WHEN square > 5000 and square <= 6000 THEN '22 раб/дн'
    WHEN square > 6000 and square <= 7000 THEN '23 раб/дн'
    WHEN square > 7000 and square <= 8000 THEN '24 раб/дн'
    WHEN square > 8000 and square <= 9000 THEN '25 раб/дн'
    WHEN square > 9000 and square <= 10000 THEN '26 раб/дн'
    WHEN square > 10000 and square <= 11000 THEN '27 раб/дн'
    WHEN square > 11000 and square <= 12000 THEN '28 раб/дн'
    WHEN square > 12000 and square <= 13000 THEN '29 раб/дн'
    WHEN square > 13000 and square <= 14000 THEN '30 раб/дн'
    WHEN square > 14000 and square <= 15000 THEN '31 раб/дн'
    WHEN square > 15000 and square <= 16000 THEN '32 раб/дн'
    WHEN square > 16000 and square <= 17000 THEN '33 раб/дн'
    WHEN square > 17000 and square <= 18000 THEN '34 раб/дн'
    WHEN square > 18000 and square <= 19000 THEN '35 раб/дн'
    WHEN square > 19000 and square <= 20000 THEN '36 раб/дн'
    WHEN square > 20000 and square <= 21000 THEN '37 раб/дн'
    WHEN square > 21000 and square <= 22000 THEN '38 раб/дн'
    WHEN square > 22000 and square <= 23000 THEN '39 раб/дн'
END;
END
$$;

-- Проверка функции расчёта времени выполнения работ
select * from days(1000);

-- Компании

-- Показывает компании которые есть в базе
select * from private.companies where id in (select "ИНН"::bigint from companies_24_01_2024);

-- Показывает компании которых нет в базе
select * from companies_18_01_2024 where "ИНН"::bigint not in (select id from private.companies);
select * from companies_14_01_2024 where "ИНН"::bigint not in (select id from private.companies);
select * from companies_24_01_2024 where "ИНН"::bigint not in (select id from private.companies);

-- Добавляет компании которых нет в базе
insert into private.companies (id, id_type_activity, id_position_head, inn_company, company_name, legal_address, fio_head, inn_head, update_date, telephone, mail, website)
select "ИНН"::bigint as id, 57 as id_type_activity, l.id as id_position_head, "ИНН" as inn_company, "Название" as company_name, "Юр. адрес" as legal_address, "ФИО рук." as fio_head, "ИНН рук." as inn_head, now() as update_date,
       "Телефоны" as telephone, "Почты" as mail, "Сайты" as website from public.companies_18_01_2024 c join private.leadership_positions l on l.position_head = c."Должность рук." where "ИНН"::bigint not in (select id
                                                                                                                                                                                                               from private.companies);

-- Обновление данных о компании в БД
update private.companies co set id = "ИНН"::bigint, id_position_head = l.id, inn_company = "ИНН", company_name = "Название", legal_address = "Юр. адрес", fio_head = "ФИО рук.", inn_head = "ИНН рук.", update_date = now(),
                                telephone = "Телефоны", mail = "Почты", website = "Сайты" from companies_24_01_2024 c join private.leadership_positions l on l.position_head = c."Должность рук." where co.id = "ИНН"::bigint;

-- Добавляет должности, которых нет в базе
insert into private.leadership_positions (position_head)
select distinct "Должность рук." as position_head from public.companies_14_01_2024 where "Должность рук." not in (select position_head from private.leadership_positions);

-- Преобразует телефоны и почты в массивы
update public.companies_24_01_2024 set "Телефоны" = string_to_array(regexp_replace("Телефоны", '\s*,\s', ',', 'g'), ',');
update public.companies_24_01_2024 set "Почты" = string_to_array(regexp_replace("Почты", '\s*,\s', ',', 'g'), ',');

-- Переделывает сайт, если он некорректного формата
update public.companies_24_01_2024 set "Сайты" = regexp_replace("Сайты", '\s*,\s', '', 'g');
update private.companies set website = regexp_replace(website, '\s*,\s', '', 'g');

-- Добавляет источник данных
insert into private.companies_data_sources (id_company, id_data_source)
select "ИНН"::bigint as id_company, 9 as id_data_source from public.companies_24_01_2024;

-- Показывает компании которые есть в базе
select * from companies where id in (select "ИНН"::bigint from companies_24_01_2024);

-- Показывает компании которых нет в базе
select * from companies_24_01_2024 where "ИНН"::bigint not in (select id from companies);

-- Обновляет данные о компаниях в базе
update companies set id = "ИНН"::bigint, position_head_dp = "Должность рук. в дат. падеже", fio_dp = "ФИО рук. в дат. падеже", io = "ИО рук.", appeal = "Уважаемый", index = "Индекс" from companies_24_01_2024 where "ИНН"::bigint = id;

-- Преобразует некорректный индекс в null
update companies_24_01_2024 set "Индекс" = null where "Индекс" = '<null>';

-- Добавляет компании, которых нет в базе
insert into companies (id, position_head_dp, fio_dp, io, appeal, index) select "ИНН"::bigint as id, "Должность рук. в дат. падеже" as position_head_dp, "ФИО рук. в дат. падеже" as fio_dp, "ИО рук." as io, "Уважаемый" as appeal,
                                                                               "Индекс" as index from companies_24_01_2024 where "ИНН"::bigint not in (select id from companies);

-- Обновляет данные
update companies c set id = co.id, name = co.company_name, legal_address = co.legal_address from private.companies co where c.id = co.id;

-- null меняет на статус 'Действует'
update private.companies set status = 'Действует' where status is null;

-- Создание таблицы компаний
create table companies_18_01_2024
(
    ИНН                            text,
    "Название"                     text,
    "Юр. адрес"                    text,
    "Должность рук."               text,
    "ФИО рук."                     text,
    "ИНН рук."                     text,
    "Телефоны"                     text,
    "Почты"                        text,
    "Сайты"                        text,
    "Должность рук. в дат. падеже" text,
    "ФИО рук. в дат. падеже"       text,
    "ИО рук."                      text,
    "№ письма"                     text,
    "Уважаемый"                    text,
    "Кол-во собственности"         text,
    адреса                         text,
    объекте                        text,
    "Кол-во писем"                 text,
    "Дата письма"                  text,
    "Флажок"                       text,
    "Индекс"                       integer,
    "Менеджер"                     text,
    "Комментарий менеджера"        text,
    "собственник объекта на ЗУ"    boolean,
    "Дата добавления"              text
);

-- Все компании из источников данных
select a.company_name, a.inn_company, a.legal_address, position_head, a.fio_head, inn_head, a.telephone, a.mail, a.website, data_source, type_activity, a.revenue, email_newsletter, mail_newsletter, sms_mailing, the_bell
from private.all_data_companies a join private.companies c on a.inn_company = c.inn_company
where 'Реестр самостроя 14.01.2024' = any (a.data_source) or 'Реестр самостроя 18.01.2024' = any (a.data_source) or 'Реестр самостроя 24.01.2024' = any (a.data_source);

-- Кадастровые номера

-- Выводит объекты, которых нет в базе
select * from cadastral_numbers_samostroy where "КН" not in (select cadastral_number from private.cadastral_numbers);

-- Удалить все данные перед импортом
delete from cadastral_numbers_samostroy where "КН" != '';

-- Обновляет данные в базе
update private.cadastral_numbers co set cadastral_number = "КН", id_object_type = l.id, address = "Адрес" from cadastral_numbers_samostroy c join private.types_objects l on l.object_type = c."Вид объекта"
                                                                                                          where co.cadastral_number = "КН";
-- Добавляем в базу данные, которых нет
insert into private.cadastral_numbers (id_object_type, cadastral_number, address) select l.id as id_object_type, "КН" as cadastral_number, "Адрес" as address from cadastral_numbers_samostroy c
    join private.types_objects l on l.object_type = c."Вид объекта" where "КН" not in (select cadastral_number from private.cadastral_numbers);

-- Права

-- Удаляем бесполезные данные
delete from rights_24_1_2024 where "ИНН ЮЛ правообладателя" = '-';

-- Обновление данных
update private.cadastral_numbers co set object_land = "объект на ЗУ" from rights_24_1_2024 c where co.cadastral_number = "КН";

-- Данные которых нет в базе
select * from rights_24_1_2024 where "№ регистрации права" not in (select number_right from private.rights);

-- Компании, которых нет в базе
select * from rights_24_1_2024 where "ИНН ЮЛ правообладателя" not in (select inn_company from private.companies);

-- Объекты, которых нет в базе
select * from rights_24_1_2024 where "КН" not in (select cadastral_number from private.cadastral_numbers);

-- Добавляем объекты, которых нет в базе
insert into private.cadastral_numbers (id_object_type, cadastral_number, object_land) select distinct l.id as id_object_type, "КН" as cadastral_number, "объект на ЗУ" as object_land from rights_24_1_2024 c
    join private.types_objects l on l.object_type = c."Вид объекта" where "КН" not in (select cadastral_number from private.cadastral_numbers);

-- Добавляет компании которых нет в базе
insert into private.companies (id, id_type_activity, id_position_head, inn_company, company_name, legal_address, fio_head, inn_head, update_date, telephone, mail, website)
select distinct "ИНН ЮЛ правообладателя"::bigint as id, 57 as id_type_activity, 3 as id_position_head, "ИНН ЮЛ правообладателя" as inn_company, "Название правообладателя" as company_name, '' as legal_address, '' as fio_head,
                '' as inn_head, now() as update_date, '{}'::text[] as telephone, '{}'::text[] as mail, '' as website from rights_24_1_2024 where "ИНН ЮЛ правообладателя"::bigint not in (select id from private.companies);

-- Обновление данных
update private.rights co set id_type_right = l.id, number_right = "№ регистрации права", id_company = "ИНН ЮЛ правообладателя"::bigint, id_cadastral_number = cn.id from rights_24_1_2024 c
    join private.types_law l on l.type_right = c."Вид права" join private.cadastral_numbers cn on "КН" = cn.cadastral_number where co.number_right = "№ регистрации права";

-- Добавляем в базу данные, которых нет
insert into private.rights (id_type_right, number_right, id_company, id_cadastral_number) select l.id as id_type_right, "№ регистрации права" as number_right, "ИНН ЮЛ правообладателя"::bigint as id_company, cn.id as id_cadastral_number
                                                                                          from rights_24_1_2024 c join private.types_law l on l.type_right = c."Вид права" join private.cadastral_numbers cn on cn.cadastral_number = c."КН"
                                                                                          where "№ регистрации права" not in (select number_right from private.rights);

-- фильтр по источникам данных
select legal_address, fio_head,mail[1] as mail1,mail[2] as mail2,mail[3] as mail3,mail[4] as mail4,mail[5] as mail5,mail[6] as mail6,mail[7] as mail7,mail[8] as mail8,mail[9] as mail9,mail[10] as mail10,mail[11] as mail11,
       mail[12] as mail12,mail[13] as mail13,mail[14] as mail14,mail[15] as mail15,mail[16] as mail16,mail[17] as mail17,mail[18] as mail18,mail[19] as mail19,mail[20] as mail20,mail[21] as mail21,mail[22] as mail22,mail[23] as mail23,
       mail[24] as mail24,mail[25] as mail25
--        ,mail[2] as mail2,mail[2] as mail2,mail[2] as mail2,mail[2] as mail2,mail[2] as mail2,mail[2] as mail2,mail[2] as mail2,mail[2] as mail2,mail[2] as mail2,mail[2] as mail2,mail[2] as mail2,mail[2] as mail2,
--        mail[2] as mail2,mail[2] as mail2,mail[2] as mail2,mail[2] as mail2,mail[2] as mail2,mail[2] as mail2,mail[2] as mail2,mail[2] as mail2,mail[2] as mail2,mail[2] as mail2,mail[2] as mail2,mail[2] as mail2,mail[2] as mail2,
--        mail[2] as mail2,mail[2] as mail2,mail[2] as mail2,mail[2] as mail2,mail[2] as mail2,mail[2] as mail2,mail[2] as mail2,mail[2] as mail2,mail[2] as mail2,mail[2] as mail2,mail[2] as mail2,mail[2] as mail2,mail[2] as mail2
from private.all_data_companies
         where 'Реестр самостроя 24.01.2024' = any (data_source) or 'Реестр самостроя' = any (data_source) or 'Реестр самостроя 14.01.2024' = any (data_source) or 'Реестр самостроя 18.01.2024' = any (data_source);

delete from cadastral_companies where length("ИНН") > 10;

select * from companies_samostroy where length("ИНН") > 10;

select * from cadastral_companies where "ИНН"::bigint in (select id_company from private.companies_data_sources where id_data_source = 2);

select * from cadastral_companies where "ИНН"::bigint in (select id_company from private.mailing_companies) and "Флажок" = true;

delete from private.interaction_history where comment is null;

insert into private.interaction_history (id_company, datetime, description)
select "ИНН"::bigint, "Дата письма", 'Создана рассылка по почте '  "№ письма" from cadastral_companies where "Флажок" = true;

insert into private.interaction_history (id_company, datetime, description)
select "ИНН"::bigint, "Дата письма", 'Совершена рассылка по почте '  "№ письма" from cadastral_companies where "Флажок" = true;

select * from cadastral_companies where "ИНН" not in (select inn_company from private.companies);

select * from cadastral_companies where "Дата письма" = '2023-03-10 00:00:00.000000' and "Флажок" = true and "ИНН"::bigint not in (select id_company from private.mailing_companies where id_mailing = 6);

select id, full_name, post, personal_phone, mail, work_phone, internal_phone, telegramm, skype, bitrix24, birthday, personal_photo from planner.employee where id = 217;

select distinct pe.id::text, pe.full_name, pe.personal_photo as manager from planner.employee e join department d on d.id = any (e.division) and d.uf_head <> e.id join planner.employee pe on pe.id = d.uf_head
                                                                        where e.id = 217;

select distinct e.id, e.full_name, e.post, e.personal_phone, e.mail, e.work_phone, e.internal_phone, e.telegramm, e.skype, e.bitrix24, e.birthday, e.personal_photo, d.name as _group_ from planner.employee e join department d on d.id = any (e.division) and d.uf_head <> e.id join planner.employee pe on pe.id = d.uf_head
                                                                        where e.id = 217 and d.name ilike '%Группа%';

select distinct pe.id, pe.full_name, pe.personal_photo from planner.employee e join department d on d.id = any (e.division) and d.uf_head = e.id join planner.employee pe on d.parent = any (pe.division) and d.uf_head <> pe.id where e.id = 7 and pe.id not in (select distinct pe.id from planner.employee e join department d on d.id = any (e.division) and d.uf_head <> e.id join planner.employee pe on pe.id = d.uf_head where e.id = 7);

select distinct pe.id from planner.employee e join department d on d.id = any (e.division) and d.uf_head <> e.id join planner.employee pe on pe.id = d.uf_head where e.id = 7;

select * from planner.objects;

select e2.id::text, e2.full_name, e2.personal_photo from planner.employee e2 where e2.id in (select distinct CASE when e.id = d.uf_head then (select de.uf_head from department de where d.parent = de.id)
    else pe.id end from planner.employee e join department d on d.id = any (e.division) join planner.employee pe on pe.id = d.uf_head where e.id = 303);

select distinct e.id, e.full_name, e.personal_photo from planner.employee e join department d on d.id = any (e.division) and d.uf_head <> e.id where d.id in (select id from department where uf_head = 31);

select distinct CASE when e.id = d.uf_head then (select de.uf_head from department de where d.parent = de.id)
    else pe.id end from planner.employee e join department d on d.id = any (e.division) join planner.employee pe on pe.id = d.uf_head where d.uf_head = 31;

select e2.id::text, e2.full_name, e2.personal_photo from planner.employee e2 where e2.id in (select distinct CASE when e.id = d.uf_head then (select de.uf_head from department de where d.parent = de.id)
    else pe.id end from planner.employee e join department d on d.id = any (e.division) join planner.employee pe on pe.id = d.uf_head);

select e2.id::text, e2.full_name, e2.personal_photo from planner.employee e2 where e2.id in (select distinct CASE when e.id = d.uf_head then (select de.uf_head from department de where d.parent = de.id) else pe.id end
                                                                                             from planner.employee e join department d on d.id = any (e.division) join planner.employee pe on pe.id = d.uf_head
                                                                                             where e.id = 7) and e2.id <> 7;

select e.id, e.full_name, e.personal_photo from department d join department d2 on d2.id = d.parent join planner.employee e on e.id = d.uf_head and d.uf_head <> 31 where d2.uf_head = 31 union
select distinct e.id, e.full_name, e.personal_photo from planner.employee e join department d on d.id = any (e.division) and d.uf_head <> e.id where d.id in (select id from department where uf_head = 31);

SELECT distinct a.*, row_number() over () as rnum FROM private.all_data_companies a
left JOIN private.mailing_companies mc ON a.inn_company::bigint = mc.id_company where id_mailing != 155
ORDER BY a.company_name LIMIT 50 offset 0;

select * from private.all_data_companies a where a.id not in (select mc.id_company from private.mailing_companies mc where mc.id_mailing = 155)  order by company_name limit 50 offset 0;

select * from (SELECT a.*
FROM private.all_data_companies a
right JOIN (select * from private.mailing_companies where id_mailing = 155) mc ON a.id = mc.id_company) al
ORDER BY al.company_name
LIMIT 50
    OFFSET 0;

CREATE INDEX idx_menu_pizzeria_id ON menu(pizzeria_id);
CREATE INDEX idx_person_visits_person_id ON person_visits(person_id);
CREATE INDEX idx_person_visits_pizzeria_id ON person_visits(pizzeria_id);
CREATE INDEX idx_person_order_person_id ON person_order(person_id);
CREATE INDEX idx_person_order_menu_id ON person_order(menu_id);

SELECT * FROM (SELECT a.*, row_number() over () as rnum
               FROM (SELECT * FROM private.all_data_companies a WHERE a.id IN (SELECT id_company FROM private.mailing_companies WHERE id_mailing = 155) ORDER BY company_name) a) al
         WHERE al.rnum between 1 and 50;

select * from private.all_data_companies a where a.id not in (select mc.id_company from private.mailing_companies mc where mc.id_mailing = 155);

select * from private.all_data_companies a where a.id in (select mc.id_company from private.mailing_companies mc where mc.id_mailing = 155);

select count(*) from (select * from private.all_data_companies a where a.id in (select mc.id_company from private.mailing_companies mc where mc.id_mailing = 156)  order by company_name) as c;

SELECT * FROM (SELECT a.*, row_number() over () as rnum FROM (select * from private.all_data_companies a where a.id not in (select mc.id_company from private.mailing_companies mc where mc.id_mailing = 156)  ORDER BY company_name) as a) al) WHERE al.rnum between 1 and 50;

SELECT * FROM (SELECT a.*, row_number() over () as rnum FROM (select * from private.all_data_companies a where a.id in (select mc.id_company from private.mailing_companies mc where mc.id_mailing = 158)  and company_name != '' and legal_address != '' and position_head != '' and fio_head != '' and telephone != '{}' and mail != '{}' and website != '' and type_activity != ' ' ORDER BY company_name) a) al WHERE al.rnum between 1 and 50;

SELECT * FROM (SELECT a.*, row_number() over () as rnum FROM (select * from private.all_data_companies a where a.id not in (select mc.id_company from private.mailing_companies mc where mc.id_mailing = 158)  and company_name != '' and legal_address != '' and position_head != '' and fio_head != '' and telephone != '{}' and mail != '{}' and website != '' and type_activity != ' ' ORDER BY company_name) a) al WHERE al.rnum between 1 and 50;

SELECT * FROM (SELECT a.*, row_number() over () as rnum FROM (select * from private.all_data_companies where id > 0 ORDER BY company_name) a) al WHERE al.rnum between 101 and 150;

SELECT * FROM (SELECT a.*, row_number() over () as rnum FROM (select * from private.all_data_companies a where a.id not in (select mc.id_company from private.mailing_companies mc where mc.id_mailing = 158)  ORDER BY company_name) a) al WHERE al.rnum between 101 and 150;

select name, substr(pc.legal_address, 9, length(pc.legal_address)) as legal_address, io, appeal, pc.fio_head, split_part(m.mailing_list_name, ' ', 1) || pc.inn_company as number, m.date_creation::date::text as date from companies c join private.companies pc on c.id = pc.id join private.mailing_companies mc on mc.id_company = pc.id join private.mailing m on m.id = mc.id_mailing where m.id = 159;

select c.id, c.id_object_type, c.cadastral_number, c.address, c.square, c.object_land, t.object_type,
       case
           when substr(c.cadastral_number, 1, 5) = '77:01' then 'ЦАО'
           when substr(c.cadastral_number, 1, 5) = '77:02' then 'СВАО'
           when substr(c.cadastral_number, 1, 5) = '77:03' then 'ВАО'
           when substr(c.cadastral_number, 1, 5) = '77:04' then 'ЮВАО'
           when substr(c.cadastral_number, 1, 5) = '77:05' then 'ЮАО'
           when substr(c.cadastral_number, 1, 5) = '77:06' then 'ЮЗАО'
           when substr(c.cadastral_number, 1, 5) = '77:07' then 'ЗАО'
           when substr(c.cadastral_number, 1, 5) = '77:08' then 'СЗАО'
           when substr(c.cadastral_number, 1, 5) = '77:09' then 'САО'
           end
from private.cadastral_numbers c join private.types_objects t on c.id_object_type = t.id;

SELECT r.id_company,
       r.number_right,
       tl.type_right,
       c.id,
       c.cadastral_number,
       c.address,
       c.square::text,
       t.object_type,
       array_agg(d.data_source) AS array_agg
FROM private.rights r
         LEFT JOIN private.types_law tl ON tl.id = r.id_type_right
         LEFT JOIN private.cadastral_numbers c ON c.id = r.id_cadastral_number
         LEFT JOIN private.types_objects t ON t.id = c.id_object_type
         LEFT JOIN private.cadastral_data_sources cd ON cd.id_cadastral_number = c.id
         LEFT JOIN private.data_sources d ON cd.id_data_source = d.id
GROUP BY r.id_company, r.number_right, tl.type_right, c.id, c.cadastral_number, c.address, c.square, t.object_type
ORDER BY r.id_company;

select count(*) from (select * from private.all_data_companies where id > 0 order by company_name) as c;

SELECT * FROM (SELECT a.*, row_number() over () as rnum FROM (select * from private.all_data_companies where id > 0 ORDER BY company_name) a) al WHERE al.rnum between 1 and 50;

SELECT cn.id   AS cad_id,
       cn.cadastral_number,
       cn.address,
       cn.square::text,
       cn.object_type,
       CASE
           WHEN substr(cn.cadastral_number, 1, 5) = '77:01'::text THEN 'ЦАО'::text
           WHEN substr(cn.cadastral_number, 1, 5) = '77:02'::text THEN 'СВАО'::text
           WHEN substr(cn.cadastral_number, 1, 5) = '77:03'::text THEN 'ВАО'::text
           WHEN substr(cn.cadastral_number, 1, 5) = '77:04'::text THEN 'ЮВАО'::text
           WHEN substr(cn.cadastral_number, 1, 5) = '77:05'::text THEN 'ЮАО'::text
           WHEN substr(cn.cadastral_number, 1, 5) = '77:06'::text THEN 'ЮЗАО'::text
           WHEN substr(cn.cadastral_number, 1, 5) = '77:07'::text THEN 'ЗАО'::text
           WHEN substr(cn.cadastral_number, 1, 5) = '77:08'::text THEN 'СЗАО'::text
           WHEN substr(cn.cadastral_number, 1, 5) = '77:09'::text THEN 'САО'::text
           ELSE NULL::text
           END AS district,
       cn.data_source,
       r.number_right,
       tl.type_right,
       c.id,
       c.inn_company,
       c.company_name,
       c.email_newsletter,
       c.mail_newsletter,
       c.sms_mailing,
       c.the_bell
FROM (SELECT c_1.id,
             c_1.cadastral_number,
             c_1.address,
             c_1.square,
             t.object_type,
             array_agg(d.data_source) AS data_source
      FROM private.cadastral_numbers c_1
               LEFT JOIN private.cadastral_data_sources cd ON c_1.id = cd.id_cadastral_number
               LEFT JOIN private.data_sources d ON cd.id_data_source = d.id
               LEFT JOIN private.types_objects t ON c_1.id_object_type = t.id
      GROUP BY c_1.id, c_1.cadastral_number, c_1.address, c_1.square, t.object_type) cn
         LEFT JOIN private.rights r ON cn.id = r.id_cadastral_number
         LEFT JOIN private.types_law tl ON r.id_type_right = tl.id
         LEFT JOIN private.all_data_companies c ON r.id_company = c.id
ORDER BY cn.cadastral_number;

SELECT * FROM (SELECT a.*, row_number() over () as rnum FROM (select * from private.all_data_cadastral_numbers where id > 0 and concat(company_name, '|', inn_company, '|', address, '|', cadastral_number, '|', object_type, '|', district, '|', data_source, '|', number_right, '|', type_right, '|', email_newsletter, '|', mail_newsletter, '|', sms_mailing, '|', the_bell) ilike '%test%' ORDER BY cadastral_number) a) al
--          WHERE al.rnum between 1 and 50
