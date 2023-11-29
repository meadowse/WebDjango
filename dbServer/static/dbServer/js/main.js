"use strict"
document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    /*активное меню*/
    const menuItems = document.querySelectorAll('.menu-li');

    if (menuItems) {
        menuItems.forEach(item => {
            let dataItem = item.getAttribute('data-url');
            if (window.location.pathname == dataItem) {
                item.classList.add('active');
            }
        });
    }

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
    const checkBtnAll = document.getElementById('checkAll'),
        checkAllAdd = document.getElementById('checkAllAdd'),
        checkAllRemove = document.getElementById('checkAllRemove'),
        allInputs = document.querySelectorAll('.lists-table__box:not(.lists-table__box-name) input'),
        allInputsChecked = document.querySelectorAll('.lists-table__box:not(.lists-table__box-name) input:checked');

    function checkAllInputs(btnAll, inputs, checkedInputs) {
        if (btnAll) {
            for (let i = 0; i < inputs.length; i++) {
                inputs[i].addEventListener("click", function () {
                    let inputsChecked = checkedInputs.length;
                    if (inputsChecked < inputs.length) {
                        btnAll.indeterminate = true;
                    }
                });
            }

            btnAll.addEventListener("click", function () {
                for (let j = 0; j < inputs.length; j++) {
                    inputs[j].checked = btnAll.checked;
                }
                btnAll.indeterminate = false;
            });
        }
    }

    checkAllInputs(checkBtnAll, allInputs, allInputsChecked);
    checkAllInputs(checkAllRemove, document.querySelectorAll('.update-right .lists-table__box:not(.lists-table__box-name) input'), document.querySelectorAll('.lists-table__box:not(.lists-table__box-name) input:checked'));
    checkAllInputs(checkAllAdd, document.querySelectorAll('.update-left .lists-table__box:not(.lists-table__box-name) input'), document.querySelectorAll('.lists-table__box:not(.lists-table__box-name) input:checked'));

    /*popup*/
    const popupBtns = document.querySelectorAll('.popup-btn');
    if (popupBtns) {
        popupBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                updateTable('#table1');
                body.classList.add('active');
            });
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.popup-btn') && !e.target.closest('.popup') || e.target.closest('.popup>span')) {
                body.classList.remove('active');
            }
        });
    }

    /*drop*/
    const drop = document.querySelector('.drop');

    if (drop) {
        const popup = document.querySelector('.popup'),
            dropItems = document.querySelectorAll('.drop__list label');

        let dropName = drop.querySelector('span');

        if (dropItems) {
            dropName.addEventListener('click', () => {
                drop.classList.add('drop--active');

                dropItems.forEach(item => {
                    item.addEventListener('click', () => {
                        let input = item.querySelector('input');
                        dropName.textContent = input.value;
                        drop.classList.remove('drop--active');
                    });
                });
            });
        }

        popup.addEventListener('click', (e) => {
            if (e.target.closest('.popup') && !e.target.closest('.drop span')) {
                drop.classList.remove('drop--active');
            }
        });
    }

    /*tables*/
    const tables = document.querySelectorAll('.table');
    if (tables) {

        tables.forEach(table => {
            const colCheck = table.querySelectorAll('.filter-col__li input');
            const colItems = table.querySelectorAll('.lists-table__col[data-col]');

            /*show or hide column*/
            const filters = table.querySelectorAll('.filter-col');

            if (filters) {
                filters.forEach(filter => {

                    filter.addEventListener('click', () => {
                        filter.classList.add('active');
                    });
                    document.addEventListener('click', removeClassActive);

                    function removeClassActive(e) {
                        if (!e.target.closest('.filter-col')) {
                            filter.classList.remove('active');
                        }
                    }
                    colCheck.forEach(item => {
                        item.addEventListener('input', () => {
                            let colId = item.getAttribute("id");
                            colItems.forEach(col => {
                                let dataCol = col.getAttribute('data-col');
                                if (item.checked == false && dataCol == colId) {
                                    col.style.display = "none";
                                }
                                if (item.checked == true && dataCol == colId) {
                                    col.style.display = "block";
                                }
                            });
                            updateTable('#table');
                            updateTable('#table1');
                        });
                    });
                });
            }

            /*move columns*/
            colItems.forEach(col => {
                col.setAttribute("draggable", "true");
                col.addEventListener("dragstart", dragstart);
                col.addEventListener("dragenter", dragenter);
                col.addEventListener("dragover", (e) => e.preventDefault());
                col.addEventListener("drop", drop);
                col.addEventListener("dragend", dragend);
            });
            let droppedItem = null;
            let draggedItem = null;
            function dragstart() {
                draggedItem = this;
            }

            function dragend() {
                colItems.forEach(col => col.classList.remove('active'));
                draggedItem = null;
            }

            function dragenter(e) {
                e.preventDefault();

                if (draggedItem !== droppedItem) {
                    droppedItem = this;
                }

                colItems.forEach(col => col.classList.add('active'));
                this.classList.remove('active');
            }

            function drop(e) {
                e.stopPropagation();
                if (droppedItem) {

                    let array = Array.from(droppedItem.parentElement.children);

                    let indexdraggedItem = array.indexOf(draggedItem);
                    let indexdroppedItem = array.indexOf(this);

                    if (indexdraggedItem > indexdroppedItem) {
                        table.insertBefore(draggedItem, this);
                    } else {
                        table.insertBefore(draggedItem, this.nextElementSibling);
                    }

                    updateTable('#table');
                    updateTable('#table1');
                }
            }
        });
    }

    /*resize columns*/
    function updateTable(table) {
        $(table).colResizable({ disable: true });

        resizeCol(table);
    }

    function resizeCol(table) {
        $(table).colResizable({
            liveDrag: true,
            resizeMode: 'overflow'
        });
    }

    resizeCol('#table1');
    resizeCol('#table');

    /*поиск*/

    // fetch('../db/db.json').then(response => response.json()).then(data => {
    // const companies = [];
    // const ul = document.querySelector('.list');
    //     const search = document.querySelector('.popup input');

    //     data.forEach(item => {
    //         companies.push(...item.companies);
    //     });

    //     function getOpt(word, companies) {

    //         return companies.filter(company => {
    //             const wordss = new RegExp(word, 'gi');

    //             return company.name.match(wordss);
    //         });
    //     }

    //     function dispOpt() {
    //         const test = getOpt(this.value, companies);

    //         let compName = test.map(name => {

    //             return `<li>${name.name}</li>`;
    //         }).join('');


    //         ul.innerHTML = compName;
    //     }

    //     search.addEventListener('input', dispOpt);

    // }).catch(err => console.error("failed", err));
});

function objects(id_cadastr, id_companys) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/infoAboutObj/", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    var value = {
        "id_cadastr": id_cadastr,
        "id_companys": id_companys
    }
    xhr.send(JSON.stringify(value));

    xhr.onreadystatechange = function () {
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
            header.textContent = jsonResponse["company_name"];
        }
    }
}

function LoginAndPass() {
    let email = document.querySelectorAll('input[type="email"]');
    let pass = document.querySelectorAll('input[id="floatingPassword"]');
    if (email[0].value == 'admin' && pass[0].value == 'admin') {
        window.open('https://rasilka.ru/')
    }
    else {
        alert("введите корректные данные")
    }
}

function addInSender() {
    let checkboxes = document.querySelectorAll('.lists-table__box:not(.lists-table__box-name) input:checked');
    let values = [];

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

function testFunct() {
    let checkboxes = document.querySelectorAll('.lists-table__box:not(.lists-table__box-name) input:checked');  // айди и тип рассылки
    let values = [];
    for (let i = 0; i < checkboxes.length; i++) {
        values.push([checkboxes[i].value]);
        // alert(checkboxes[i].value);
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

function removeLine(){
    let checkboxes = document.querySelectorAll("input[class='remove']:checked");
    let valuesArray = []; // Используйте массив объектов
    for (let i = 0; i < checkboxes.length; i++) {
        let values = {}; // Создайте новый объект значений для каждого чекбокса
        values['check_' + i] = [checkboxes[i].value]; // Задаем значение поля
        alert(values['check_' + i])
        valuesArray.push(values); // Добавьте объект значений в массив
    }

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/emailCount/removeLine/", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(valuesArray)); // Отправьте массив значений
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            location.reload();
        }
    }
}

function buttonRemove() {
    let checkboxes = document.querySelectorAll("input[class='removeFromNewsletter']:checked");
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

function createLabels() {
    var checkboxes = document.querySelectorAll('.lists-table__box:not(.lists-table__box-name) input:checked');

    var values = [];
    if (checkboxes.length === 0 || checkboxes.length > 1) {
        alert("Необходимо выбрать только одну рассылку")
    } else {
        for (let i = 0; i < checkboxes.length; i++) { // мне кажется что здесь не нужен перебор, у нас и так один элемент
            values.push([checkboxes[i].value]);
            // alert(checkboxes[i].value);
        }
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/emailCount/createLabels/", true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(values)); // Отправить json
        xhr.responseType = "blob";
        xhr.onreadystatechange = function () {
            xhr.onload = function () {
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

function createLetters(){
    let checkboxes = document.querySelectorAll('.lists-table__box:not(.lists-table__box-name) input:checked');
    let values = [];
    if (checkboxes.length === 0 || checkboxes.length > 1) {
        alert("Необходимо выбрать только одну рассылку")
    } else {
        for (let i = 0; i < checkboxes.length; i++) {
            values.push([checkboxes[i].value]);
            // alert(checkboxes[i].value);
        }
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/emailCount/createLetters/", true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(values)); // Отправьте массив значений
        xhr.responseType = "blob";
        xhr.onreadystatechange = function () {
            xhr.onload = function () {
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