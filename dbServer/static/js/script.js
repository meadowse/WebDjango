function buttonadd() {
    let checkboxes = document.querySelectorAll("input[class='needad']:checked");
    let valuesArray = []; // Используйте массив объектов
    for (let i = 0; i < checkboxes.length; i++) {
        let values = {}; // Создайте новый объект значений для каждого чекбокса
        values['check_' + i] = [checkboxes[i].value]; // Задаем значение поля
        valuesArray.push(values); // Добавьте объект значений в массив
    }
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/emailCount/addTarget/", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(valuesArray)); // Отправьте массив значений
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            location.reload();
        }
    }
}

function buttonRemove() {
    let checkboxes = document.querySelectorAll("input[name='interest']:checked");
    let valuesArray = []; // Используйте массив объектов
    for (let i = 0; i < checkboxes.length; i++) {
        let values = {}; // Создайте новый объект значений для каждого чекбокса
        values['check_' + i] = [checkboxes[i].value]; // Задаем значение поля
        valuesArray.push(values); // Добавьте объект значений в массив
    }
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/emailCount/removeTarget/", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(valuesArray)); // Отправьте массив значений
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            location.reload();
        }
    }
}

function objects(id_cadastr, id_companys) {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/infoAboutObj/", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    let value = {
        "id_cadastr": id_cadastr,
        "id_companys": id_companys
    }
    xhr.send(JSON.stringify(value));

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let mas = xhr.responseText;

            let jsonResponse = JSON.parse(mas);
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
            header.textContent = jsonResponse["company_name"];
        }
    }
}

function LoginAndPass() {
    let email = document.querySelectorAll('input[type="email"]');
    let pass = document.querySelectorAll('input[id="floatingPassword"]');
    if (email[0].value == 'admin' && pass[0].value == 'admin') {
        window.open('/main/')
    }
    else {
        alert("введите корректные данные")
    }
}

function addInSender() {
    let checkboxes = document.querySelectorAll('.lists-table__box:not(.lists-table__box-name) input:checked');
    let values = [];
    if (checkboxes.length == 0 || checkboxes.length > 1) {
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

let testUsers = {mail: "testlettersInner@outlook.com", legal_addres:"testAdress", fio_head:"test_name"}

function SendTestEmail(){
    let json = JSON.stringify([testUsers]);
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/emailCount/sendtestEmail/", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(json); // Отправьте массив значений
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            location.reload();
        }
    }
}
function SendEmail() {
    let checkboxes = document.querySelectorAll('.lists-table__box:not(.lists-table__box-name) input:checked');  // айди и тип рассылки
    let values = [];
    for (let i = 0; i < checkboxes.length; i++) {
        values.push([checkboxes[i].value]);
        alert(checkboxes[i].value);
    }
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/emailCount/sendEmail/", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(values)); // Отправьте массив значений
    xhr.onreadystatechange = function () {
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

function createLabels() {
    let checkboxes = document.querySelectorAll('.lists-table__box:not(.lists-table__box-name) input:checked');
    let values = [];
    if (checkboxes.length == 0 || checkboxes.length > 1) {
        alert("Необходимо выбрать только одну рассылку")
    } else {
        for (let i = 0; i < checkboxes.length; i++) {
            values.push([checkboxes[i].value]);
            // alert(checkboxes[i].value);
        }
        const arr = values[0][0].split(', ');
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/emailCount/createLabels/", true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(values)); // Отправьте массив значений
        xhr.responseType = "blob";
        xhr.onreadystatechange = function () {
            xhr.onload = function () {
                if (xhr.status === 200) {
                    var fileName = arr[arr.length - 1] +".docx"; // Задайте имя файла для скачивания
                    var a = document.createElement("a");
                    a.href = window.URL.createObjectURL(xhr.response);
                    a.download = fileName;
                    a.style.display = "none";
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                }
            };
        }
    }
}

function removeLine(){
       let checkboxes = document.querySelectorAll('.lists-table__box:not(.lists-table__box-name) input:checked');
    let valuesArray = []; // Используйте массив объектов

    for (let i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].value[1] != 'N') {
            let values = {}; // Создайте новый объект значений для каждого чекбокса
            values['check_' + i] = [checkboxes[i].value]; // Задаем значение поля
            valuesArray.push(values); // Добавьте объект значений в массив
        }
    }
    var cadel= 0
    try {
        if (valuesArray.length > 0){
            var xhr = new XMLHttpRequest();

            xhr.open("POST", "/emailCount/removeLine/", true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify(valuesArray)); // Отправьте массив значений
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    location.reload();
                }
                else {
                    if(cadel < 1){
                        alert("не получилось удалить записи. Убедитесь что в рассылках нет компаний");
                        cadel = 1;
                    }
                }
            }
        }
        else {
            alert("удаление запрещено")
        }
    }
    catch
        {
            alert("не получилось удалить записи. Убедитесь что в рассылках нет компаний");
        }
}



function createLetters(){
    let checkboxes = document.querySelectorAll('.lists-table__box:not(.lists-table__box-name) input:checked');
    let values = [];
    if (checkboxes.length === 0 || checkboxes.length > 1) {
        alert("Необходимо выбрать только одну рассылку")
    } else {
        for (let i = 0; i < checkboxes.length; i++) {
            values.push([checkboxes[i].value]);

        }
        const arr = values[0][0].split(', ');
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/emailCount/createLetters/", true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(values)); // Отправьте массив значений
        xhr.responseType = "blob";
        xhr.onreadystatechange = function () {
            xhr.onload = function () {
                if (xhr.status === 200) {
                    var fileName = arr[arr.length - 1] +".docx"; // Задайте имя файла для скачивания
                    var a = document.createElement("a");
                    a.href = window.URL.createObjectURL(xhr.response);
                    a.download = fileName;
                    a.style.display = "none";
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                }
            };
        }
    }
}

function extract() {
    var source = document.getElementById("CadastrNum");
    var cadastralNumber = source.textContent;
    source = document.getElementById("ObjView");
    var typeObject = source.textContent;
    var value = {'cadastralNumber': cadastralNumber, 'typeObject' : typeObject};
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/extract/", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(value)); // Отправить json
    xhr.responseType = "blob";
    xhr.onreadystatechange = function () {
        xhr.onload = function () {
            if (xhr.status === 200) {
                var fileName = cadastralNumber + ".pdf"; // Задайте имя файла для скачивания
                var a = document.createElement("a");
                a.href = window.URL.createObjectURL(xhr.response);
                a.download = fileName;
                a.style.display = "none";
                document.body.appendChild(a);
                a.click();
                a.remove();
            }
        };
    }
}