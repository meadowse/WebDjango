
# serverDB
для запуска миграций удалить файл в папке миграции и папку с sql
python manage.py makemigrations  
python manage.py migrate  
 запуск сервера poetry run python manage.py runserver 
если просит админа : 
python manage.py createsuperuser - добавить нового пользователя с правами 


пароль от админа джанго admin 
логин admin



_____________________________________________________________________________________
## получить информацию на главную страницу списки 

get: json/

необязательно но можно в get запросе передать по какому столбцу идет сортировка. 

columnSorted - имя столбца для сортировки 
Sorted - desc или asc

возвращает : 
 company_name (название компании), inn_company (инн компании), legal_address (юридический адресс),  position_head(должность руководителя), fio_head( фио руководителя), telephone ( список телефонов),
mail (почта),website (веб сайт), data_sourse(иоткуда получили информацию), activity_type_code(код Деятельность), revenue(доход), email_newsletter(код рассылкы по электронной почте), 
mail_newsletter(код рассылки по почте физической), sms_mailing(код рассылки по смс), the_bell(код рассылки по телефону)
 
## информация о компании 

### get: json/info 
в гет запросе должен быть id компании или инн передаваемый int
обязательно передать
"companyId"

необязательно:
'table' -  какую таблицу открываем. object возвращает объекты. любое другое значение будет возвращать информацию о компании 

при ошибке возвращает 500 
при успешном обращении  :
при вызове основной информации о компании 
  company_name (название компании), inn_company (инн компании), legal_address (юридический адресс),  position_head(должность руководителя), fio_head( фио руководителя), telephone ( список телефонов),
  mail (почта),website (веб сайт), data_sourse(иоткуда получили информацию), activity_type_code(код Деятельность), revenue(доход), email_newsletter(код рассылкы по электронной почте), 
  mail_newsletter(код рассылки по почте физической), sms_mailing(код рассылки по смс), the_bell(код рассылки по телефону)
  date(дата события)
  description(событие)
  

при передаче object 
'objects_owned'(объекты в собственности): 
        id_cadastral_number (кадастровый номер)
        objects_owned (адресс объекта)
(id_cadastral_number (кадастровый номер) и objects_owned (адресс объекта) вложенны в objects_owned)

'objects_rent'(объекты в аренде):
        id_cadastral_number (кадастровый номер)
        objects_owned (адресс объекта)


'lands_owned'(земля в собственности): 
        id_cadastral_number (кадастровый номер)
        objects_owned (адресс объекта)


'lands_rent'(земля в аренде): 
        id_cadastral_number (кадастровый номер)
        objects_owned (адресс объекта)

 
## получить информацию об определенном объекете 
### get: json/infoAboutObj/
обязательно передать: 
companyId - id компании 
id_cadastr - кадастровый номер объекта. 

возвращает:
object_type (вид объекта)
type_right (вид права)
number_right (номер регистрации права )
company_name (название правообладателя)
link_statement (ссылка на выписку)

## получить информацию о суде

### json/court/ главная страница суда

### json/court/courtinfo информация об определенном деле


## информация о рассылках 
### get  /json/mailing/email/ - вывод всех email

возвращает
id (айди рассылки )
type_mailing (тип рассылки )
template (шаблон рассылки)
quantity (сколько в рассылке целей)
date_creation (дата создания)
date_dispatch (дата изменения)
fio (фио ответственного за рассылку)
status ( статус отправлено или создано )
contacts (контакры для отправки)


### get /json/mailing/sendEmail/ - отправить email рассылку 
обязательно передать
id_mailing - номер рассылки в которой нужно все отправить 
возвращает 200


### get /json/mailing/mailingInfo/ - информация о компаниях в расылке и не в рассылке 
id_mailing - номер рассылки 
возвращает:
    notInMailing{
        inn_company, - инн
        company_name, -имя
        legal_address -юр.фдресс
} - компании которых нет в рассылке

    inMailing {
        inn_company, - инн
        company_name, -имя
        legal_address -юр.фдресс
} - компании которые есть в рассылке


### get /json/mailing/addTarget - добавить цель в рассылку какую либо
inn_company - инн которые надо добавить 
id_mailing - id в какую рассылку добавить цель 

возвращает 
статус сервера 200

### /json/mailing/removeTarget - удалить цель из какой либо рассылки 
inn_company - инн которые надо удалить 
id_mailing - id из какой рассылки удалить цель 

возвращает 
статус сервера 200

### /json/mailing/createLabels/ - сделать наклейки для почты

### /json/mailing/mail/ - вывести все рассылки почты 

### /json/mailing/cals/ - вывести все рассылки звонков 

### /json/mailing/sms/ - вывести все рассылки смс





пример того как я работала с js 
function objectsInfo(id_cadastr, id_companys){
    var xhr = new XMLHttpRequest();
    xhr.open("get", "http://127.0.0.1:8000/infoAboutObj/", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    var value ={
        "id_cadastr": id_cadastr,
        "id_companys":id_companys
    }
    xhr.send(JSON.stringify(value));

    xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
        var mas = xhr.responseText;

        var jsonResponse = JSON.parse(mas);
        jsonResponse = JSON.parse(jsonResponse);

        var header = document.getElementById("CadastrNum");
        header.textContent = jsonResponse["cadastral_number"];

       header = document.getElementById("ObjView");
        header.textContent = jsonResponse["object_type"];

        header = document.getElementById("TypeRight");
        header.textContent = jsonResponse["type_right"];

        header = document.getElementById("NumRight");
        header.textContent = jsonResponse["number_right"];

        header = document.getElementById("FIO");
        header.textContent = jsonResponse[ "company_name"];

        header = document.getElementById("NameHolder");
        header.textContent = jsonResponse[ "link_statement"];
    }
}
}

