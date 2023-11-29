<<<<<<< HEAD
"use strict";
const body = document.body;

/*табы*/
const tabs = document.querySelectorAll('.tabs-item');

function funcTabs(dataAttr, inner) {
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(tab => {
                tab.classList.remove('tabs-item--active');
            });

            const dataTab = tab.getAttribute('data-tabs');

            document.querySelectorAll(inner).forEach(item => {
                item.classList.remove('active');
                const dataItem = item.getAttribute(dataAttr);
                if (dataItem == dataTab) {
                    item.classList.add('active');
                }
            });

            tab.classList.add('tabs-item--active');
        });
    });
}

funcTabs('data-about', '.about-inner__item');
funcTabs('data-court', '.court-inner__item');

/*выбор всех чекбоксов*/
const checkAllAdd = document.getElementById('checkAllCompaniesAdd'),
    checkAllRemove = document.getElementById('checkAllCompaniesRemove'),
    checkCourtInputs = document.querySelectorAll('.court-table-main td input'),
    checkEmailInputs = document.querySelectorAll('.email-table-main td input'),
    checkMailInputs = document.querySelectorAll('.mail-table-main td input'),
    checkSmsInputs = document.querySelectorAll('.sms-table-main td input'),
    checkCompaniesRemove = document.querySelectorAll('.popup-right td input'),
    checkCompaniesAdd = document.querySelectorAll('.popup-left td input'),
    checkAllAddEmail = document.getElementById('checkAllAddEmail'),
    checkAllAddSms = document.getElementById('checkAllAddSms'),
    checkAllCourts = document.getElementById('checkAllCourt'),
    checkAllMail = document.getElementById('checkAllMail'),
    popupBtns = document.querySelectorAll('.popup-btn');

function checkAllInputs(btnAll, inputs, selector) {
    if (btnAll) {
        for (let check = 0; check < inputs.length; check++) {
            inputs[check].addEventListener("click", function () {
                let inputsChecked = document.querySelectorAll(selector).length;
                if (inputsChecked < inputs.length) {
                    btnAll.indeterminate = true;
                }
            });
        }

        btnAll.addEventListener("click", function () {
            for (let check = 0; check < inputs.length; check++) {
                inputs[check].checked = btnAll.checked;
            }
        });
    }
}

/*добавить/удалить все компании из таблицы*/
checkAllInputs(checkAllAddEmail, checkEmailInputs, '.email-table-main td input:checked');
checkAllInputs(checkAllCourts, checkCourtInputs, '.court-table-main td input:checked');
checkAllInputs(checkAllAddSms, checkSmsInputs, '.sms-table-main td input:checked');
checkAllInputs(checkAllMail, checkMailInputs, '.mail-table-main td input:checked');

/*добавить/удалить все компании из рассылки в поп-ап*/
checkAllInputs(checkAllRemove, checkCompaniesRemove, '.popup-right td input:checked');
checkAllInputs(checkAllAdd, checkCompaniesAdd, '.popup-left td input:checked');

/*popup*/
if (popupBtns) {
    popupBtns.forEach(btn => {
        btn.addEventListener('click', () => body.classList.add('active'));
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.popup-btn') && !e.target.closest('.popup') || e.target.closest('.popup>span')) {
            body.classList.remove('active');
        }
    });
}

/*resize tables*/
const colsTH = document.querySelectorAll('th');
const colsTD = document.querySelectorAll('td');

function createResizableColumn(col, resizer) {
    // Track the current position of mouse
    let x = 0;
    let w = 0;

    const mouseDownHandler = function (e) {
        // Get the current mouse position
        x = e.clientX;

        // Calculate the current width of column
        const styles = window.getComputedStyle(col);
        w = parseInt(styles.width, 10);

        // Attach listeners for document's events
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    };

    const mouseMoveHandler = function (e) {
        // Determine how far the mouse has been moved
        const dx = e.clientX - x;

        // Update the width of column
        col.style.width = `${w + dx}px`;
    };

    // When user releases the mouse, remove the existing event listeners
    const mouseUpHandler = function () {
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
    };

    resizer.addEventListener('mousedown', mouseDownHandler);
};

function addResizer(cols) {
    cols.forEach(col => {
        const resizer = document.createElement('div');
        resizer.classList.add('resizer');

        col.append(resizer);

        // Will be implemented in the next section
        createResizableColumn(col, resizer);
    });
}

addResizer(colsTH);
addResizer(colsTD);

function LoginAndPass(){
    let email = document.querySelectorAll('input[type="email"]');
    let pass = document.querySelectorAll('input[id="floatingPassword"]');
   if(email[0].value == 'admin' && pass[0].value == 'admin'){
       window.open('http://127.0.0.1:8000/main/')
   }
   else{
       alert("введите корректные данные")
   }


}


function addInSender(){
    let checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    let values = [];
    if(checkboxes.length == 0 || checkboxes.length > 1){
        alert("Необходимо выбрать только одну рассылку")
    }
    else {
        for (let i = 0; i < checkboxes.length; i++) {
            values.push([checkboxes[i].value]);
            // alert(checkboxes[i].value);
        }
        var form = document.createElement('form');
        document.body.appendChild(form);
        form.target = '_self';
        form.method = 'post';
        form.action = "/emailCount/emailinfo/";
        for (let i = 0; i < values.length; i++) {
            let inputElem = document.createElement('input');
            inputElem.type = 'hidden'; // Используем скрытые поля, чтобы они не отображались
            inputElem.name = 'check_' + i; // Задаем имя поля
            inputElem.value = values[i]; // Задаем значение поля
            form.appendChild(inputElem); // Добавляем элемент input в форму
        }
        // form.appendChild(values);
        form.submit();
        document.body.removeChild(form);
    }
}

function objectsInfo(id_cadastr, id_companys){
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://127.0.0.1:8000/infoAboutObj/", true);
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



function checkAll(myCheckbox) {
    var checkboxes = document.querySelectorAll("input[type='checkbox']");
    if (myCheckbox.checked == true) {
        checkboxes.forEach(function(checkbox) {
            checkbox.checked = true;
        });
    } else {
        checkboxes.forEach(function(checkbox) {
            checkbox.checked = false;
        });
    }
}

function checkAllForDel(myCheckbox) {
    var checkboxes = document.querySelectorAll("input[name='interest']");
    if (myCheckbox.checked == true) {
        checkboxes.forEach(function(checkbox) {
            checkbox.checked = true;
        });
    } else {
        checkboxes.forEach(function(checkbox) {
            checkbox.checked = false;
        });
    }
}


function checkAllForADD(myCheckbox) {
    var checkboxes = document.querySelectorAll("input[name='notInterest']");
    if (myCheckbox.checked == true) {
        checkboxes.forEach(function(checkbox) {
            checkbox.checked = true;
        });
    } else {
        checkboxes.forEach(function(checkbox) {
            checkbox.checked = false;
        });
    }
}

function buttonAdd(){
    let checkboxes = document.querySelectorAll("input[name='notInterest']:checked");
    let valuesArray = []; // Используйте массив объектов
    for (let i = 0; i < checkboxes.length; i++) {
        let values = {}; // Создайте новый объект значений для каждого чекбокса
        values['check_' + i] = [checkboxes[i].value]; // Задаем значение поля
        valuesArray.push(values); // Добавьте объект значений в массив
    }
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://127.0.0.1:8000/emailCount/addTarget/", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(valuesArray)); // Отправьте массив значений
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            location.reload();
        }
    }
}


function buttonRemove(){
        let checkboxes = document.querySelectorAll("input[name='interest']:checked");
    let valuesArray = []; // Используйте массив объектов
    for (let i = 0; i < checkboxes.length; i++) {
        let values = {}; // Создайте новый объект значений для каждого чекбокса
        values['check_' + i] = [checkboxes[i].value]; // Задаем значение поля
        valuesArray.push(values); // Добавьте объект значений в массив
    }
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://127.0.0.1:8000/emailCount/removeTarget/", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(valuesArray)); // Отправьте массив значений
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            location.reload();
        }
    }
}



function createLabels() {


    let checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    let values = [];
    if (checkboxes.length == 0 || checkboxes.length > 1) {
        alert("Необходимо выбрать только одну рассылку")
    } else {
        for (let i = 0; i < checkboxes.length; i++) {
            values.push([checkboxes[i].value]);
            // alert(checkboxes[i].value);
        }
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/emailCount/createLabels/", true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(values)); // Отправьте массив значений
        xhr.responseType = "blob";
        xhr.onreadystatechange = function () {
            xhr.onload = function() {
        if (xhr.status === 200) {
            var fileName = "downloaded_file.docx"; // Задайте имя файла для скачивания
            var a = document.createElement("a");
            a.href = window.URL.createObjectURL(xhr.response);
            a.download = fileName;
            a.style.display = "none";
            document.body.appendChild(a);
            a.click();
            a.remove();
        }
    };

    xhr.send();
        }
    }
}




function NewRow(){

=======
"use strict";


"use strict"
const body = document.body;

/*табы*/
const tabs = document.querySelectorAll('.tabs-item');

function funcTabs(dataAttr, inner) {
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(tab => {
                tab.classList.remove('tabs-item--active');
            });

            const dataTab = tab.getAttribute('data-tabs');

            document.querySelectorAll(inner).forEach(item => {
                item.classList.remove('active');
                const dataItem = item.getAttribute(dataAttr);
                if (dataItem == dataTab) {
                    item.classList.add('active');
                }
            });

            tab.classList.add('tabs-item--active');
        });
    });
}

funcTabs('data-about', '.about-inner__item');
funcTabs('data-court', '.court-inner__item');

/*выбор всех чекбоксов*/
const checkAllAdd = document.getElementById('checkAllCompaniesAdd'),
    checkAllRemove = document.getElementById('checkAllCompaniesRemove'),
    checkCourtInputs = document.querySelectorAll('.court-table-main td input'),
    checkEmailInputs = document.querySelectorAll('.email-table-main td input'),
    checkMailInputs = document.querySelectorAll('.mail-table-main td input'),
    checkSmsInputs = document.querySelectorAll('.sms-table-main td input'),
    checkCompaniesRemove = document.querySelectorAll('.popup-right td input'),
    checkCompaniesAdd = document.querySelectorAll('.popup-left td input'),
    checkAllAddEmail = document.getElementById('checkAllAddEmail'),
    checkAllAddSms = document.getElementById('checkAllAddSms'),
    checkAllCourts = document.getElementById('checkAllCourt'),
    checkAllMail = document.getElementById('checkAllMail'),
    popupBtns = document.querySelectorAll('.popup-btn');

function checkAllInputs(btnAll, inputs, selector) {
    if (btnAll) {
        for (let check = 0; check < inputs.length; check++) {
            inputs[check].addEventListener("click", function () {
                let inputsChecked = document.querySelectorAll(selector).length;
                if (inputsChecked < inputs.length) {
                    btnAll.indeterminate = true;
                }
            });
        }

        btnAll.addEventListener("click", function () {
            for (let check = 0; check < inputs.length; check++) {
                inputs[check].checked = btnAll.checked;
            }
        });
    }
}

/*добавить/удалить все компании из таблицы*/
checkAllInputs(checkAllAddEmail, checkEmailInputs, '.email-table-main td input:checked');
checkAllInputs(checkAllCourts, checkCourtInputs, '.court-table-main td input:checked');
checkAllInputs(checkAllAddSms, checkSmsInputs, '.sms-table-main td input:checked');
checkAllInputs(checkAllMail, checkMailInputs, '.mail-table-main td input:checked');

/*добавить/удалить все компании из рассылки в поп-ап*/
checkAllInputs(checkAllRemove, checkCompaniesRemove, '.popup-right td input:checked');
checkAllInputs(checkAllAdd, checkCompaniesAdd, '.popup-left td input:checked');

/*popup*/
if (popupBtns) {
    popupBtns.forEach(btn => {
        btn.addEventListener('click', () => body.classList.add('active'));
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.popup-btn') && !e.target.closest('.popup') || e.target.closest('.popup>span')) {
            body.classList.remove('active');
        }
    });
}

/*resize tables*/
const colsTH = document.querySelectorAll('th');
const colsTD = document.querySelectorAll('td');

function createResizableColumn(col, resizer) {
    // Track the current position of mouse
    let x = 0;
    let w = 0;

    const mouseDownHandler = function (e) {
        // Get the current mouse position
        x = e.clientX;

        // Calculate the current width of column
        const styles = window.getComputedStyle(col);
        w = parseInt(styles.width, 10);

        // Attach listeners for document's events
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    };

    const mouseMoveHandler = function (e) {
        // Determine how far the mouse has been moved
        const dx = e.clientX - x;

        // Update the width of column
        col.style.width = `${w + dx}px`;
    };

    // When user releases the mouse, remove the existing event listeners
    const mouseUpHandler = function () {
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
    };

    resizer.addEventListener('mousedown', mouseDownHandler);
};

function addResizer(cols) {
    cols.forEach(col => {
        const resizer = document.createElement('div');
        resizer.classList.add('resizer');

        col.append(resizer);

        // Will be implemented in the next section
        createResizableColumn(col, resizer);
    });
}

addResizer(colsTH);
addResizer(colsTD);


function LoginAndPass(){
    let email = document.querySelectorAll('input[type="email"]');
    let pass = document.querySelectorAll('input[id="floatingPassword"]');
   if(email[0].value == 'admin' && pass[0].value == 'admin'){
       window.open('http://127.0.0.1:8000/main/')
   }
   else{
       alert("введите корректные данные")
   }


}


function addInSender(){
    let checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    let values = [];
    if(checkboxes.length == 0 || checkboxes.length > 1){
        alert("Необходимо выбрать только одну рассылку")
    }
    else {
        for (let i = 0; i < checkboxes.length; i++) {
            values.push([checkboxes[i].value]);
            // alert(checkboxes[i].value);
        }
        var form = document.createElement('form');
        document.body.appendChild(form);
        form.target = '_self';
        form.method = 'post';
        form.action = "/emailCount/emailinfo/";
        for (let i = 0; i < values.length; i++) {
            let inputElem = document.createElement('input');
            inputElem.type = 'hidden'; // Используем скрытые поля, чтобы они не отображались
            inputElem.name = 'check_' + i; // Задаем имя поля
            inputElem.value = values[i]; // Задаем значение поля
            form.appendChild(inputElem); // Добавляем элемент input в форму
        }
        // form.appendChild(values);
        form.submit();
        document.body.removeChild(form);
    }
}

function objectsInfo(id_cadastr, id_companys){
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://127.0.0.1:8000/infoAboutObj/", true);
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

function testFunct(){
    let checkboxes = document.querySelectorAll('input[type="checkbox"]:checked'); // айди и тип рассылки
    let values = [];
        for (let i = 0; i < checkboxes.length; i++) {
            values.push([checkboxes[i].value]);
            // alert(checkboxes[i].value);
        }
        var xhr = new XMLHttpRequest();
    xhr.open("POST", "/emailCount/sendEmail/", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(values)); // Отправьте массив значений
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            location.reload();
        }
    }



        // var form = document.createElement('form');
        // document.body.appendChild(form);
        // form.target = '_blank'; // если не хочу открывать в новом окне то изменить на _self
        // form.method = 'post';
        // form.action = "./sendEmail/";
        // for (let i = 0; i < values.length; i++) {
        //     let inputElem = document.createElement('input');
        //     inputElem.type = 'hidden'; // Используем скрытые поля, чтобы они не отображались
        //     inputElem.name = 'check_' + i; // Задаем имя поля
        //     inputElem.value = values[i]; // Задаем значение поля
        //     form.appendChild(inputElem); // Добавляем элемент input в форму
        // }
}



function checkAll(myCheckbox) {
    var checkboxes = document.querySelectorAll("input[type='checkbox']");
    if (myCheckbox.checked == true) {
        checkboxes.forEach(function(checkbox) {
            checkbox.checked = true;
        });
    } else {
        checkboxes.forEach(function(checkbox) {
            checkbox.checked = false;
        });
    }
}

function checkAllForDel(myCheckbox) {
    var checkboxes = document.querySelectorAll("input[name='interest']");
    if (myCheckbox.checked == true) {
        checkboxes.forEach(function(checkbox) {
            checkbox.checked = true;
        });
    } else {
        checkboxes.forEach(function(checkbox) {
            checkbox.checked = false;
        });
    }
}


function checkAllForADD(myCheckbox) {
    var checkboxes = document.querySelectorAll("input[name='notInterest']");
    if (myCheckbox.checked == true) {
        checkboxes.forEach(function(checkbox) {
            checkbox.checked = true;
        });
    } else {
        checkboxes.forEach(function(checkbox) {
            checkbox.checked = false;
        });
    }
}

function buttonAdd(){
    let checkboxes = document.querySelectorAll("input[name='notInterest']:checked");
    let valuesArray = []; // Используйте массив объектов
    for (let i = 0; i < checkboxes.length; i++) {
        let values = {}; // Создайте новый объект значений для каждого чекбокса
        values['check_' + i] = [checkboxes[i].value]; // Задаем значение поля
        valuesArray.push(values); // Добавьте объект значений в массив
    }
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://127.0.0.1:8000/emailCount/addTarget/", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(valuesArray)); // Отправьте массив значений
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            location.reload();
        }
    }
}


function buttonRemove(){
        let checkboxes = document.querySelectorAll("input[name='interest']:checked");
    let valuesArray = []; // Используйте массив объектов
    for (let i = 0; i < checkboxes.length; i++) {
        let values = {}; // Создайте новый объект значений для каждого чекбокса
        values['check_' + i] = [checkboxes[i].value]; // Задаем значение поля
        valuesArray.push(values); // Добавьте объект значений в массив
    }
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://127.0.0.1:8000/emailCount/removeTarget/", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(valuesArray)); // Отправьте массив значений
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            location.reload();
        }
    }
}



function createLabels() {


    let checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    let values = [];
    if (checkboxes.length == 0 || checkboxes.length > 1) {
        alert("Необходимо выбрать только одну рассылку")
    } else {
        for (let i = 0; i < checkboxes.length; i++) {
            values.push([checkboxes[i].value]);
            // alert(checkboxes[i].value);
        }
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/emailCount/createLabels/", true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(values)); // Отправьте массив значений
        xhr.responseType = "blob";
        xhr.onreadystatechange = function () {
            xhr.onload = function() {
        if (xhr.status === 200) {
            var fileName = "downloaded_file.docx"; // Задайте имя файла для скачивания
            var a = document.createElement("a");
            a.href = window.URL.createObjectURL(xhr.response);
            a.download = fileName;
            a.style.display = "none";
            document.body.appendChild(a);
            a.click();
            a.remove();
        }
    };

    xhr.send();
        }
    }
}




function NewRow(){

>>>>>>> main
}