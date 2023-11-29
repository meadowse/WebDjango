"use strict"
document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const tabs = document.querySelectorAll('.tabs-item');
    const overlay = document.querySelector('.overlay');
    const loadImg = document.querySelector('.load-img');

    /*активное меню*/
    const menuItems = document.querySelectorAll('.menu-li');

    if (menuItems) {
        menuItems.forEach(item => {
            let dataItem = item.getAttribute('data-url');
            window.location.pathname == dataItem ? item.classList.add('active') : false;
        });
    }
    const checkBtnAll = document.getElementById('checkAll'),
        checkAllAdd = document.getElementById('checkAllAdd'),
        checkAllRemove = document.getElementById('checkAllRemove'),
        allInputs = document.querySelectorAll('.lists-table__box:not(.lists-table__box-name) input'),
        allInputsRight = document.querySelectorAll('.update-right .lists-table__box:not(.lists-table__box-name) input'),
        allInputsLeft = document.querySelectorAll('.update-left .lists-table__box:not(.lists-table__box-name) input'),
        allInputsChecked = document.querySelectorAll('.lists-table__box:not(.lists-table__box-name) input:checked');

    /*drop*/
    const columns = document.querySelectorAll('.lists-table .lists-table__box:first-child');
    if (columns) {
        columns.forEach(item => item.insertAdjacentHTML("afterbegin",
            `<div class="table__col-sort table__col-incr find" data-sort="0"></div>
            <div class="table__col-sort table__col-decr find" data-sort="1"></div>`))
    }

    changeTables();
    checkAllInputs(checkBtnAll, allInputs);
    checkAllInputs(checkAllRemove, allInputsRight);
    checkAllInputs(checkAllAdd, allInputsLeft);
    funcTabs('data-tab', '.tab-content');
    popupToggle();
    dropFunc();

    const aboutObj = document.querySelectorAll('.about-obj__box');
    if (aboutObj) {
        aboutObj.forEach(about => {
            let text = about.querySelector('.text-obj');
            if (text) {
                about.addEventListener('click', () => {
                    document.querySelectorAll('.text-obj').forEach(text => text.classList.remove('text-obj--active'));
                    text.classList.add('text-obj--active');
                });
            }
        });
    }

    /*form*/
    const form = document.querySelector('.header-form input');
    const filter = document.querySelector('.filter-search__wrap');
    const addLetter = document.getElementById('addLetter');

    form.addEventListener('click', () => filter.classList.toggle('filter-search--active'));

    document.addEventListener('click', (e) => !e.target.closest('.filter-search__wrap') && !e.target.closest('.header-form') && !e.target.closest('.overlay') ? filter.classList.remove('filter-search--active') : false);

    addLetter != null ? addLetter.addEventListener('click', () => document.querySelector('.update-company').classList.add('active')) : false;

    /*фильтр*/
    let dbParams = {},
        limit,
        desc,
        search = document.querySelector('.header input'),
        revenue = document.querySelector('#revenue input'),
        comparison,
        data_source,
        absence;


    /*сброс фильтра*/
    document.querySelector('.reset').addEventListener('click', (e) => {
        e.preventDefault();

        filter.classList.remove('filter-search--active');
        loadImg.classList.add('load--active');
        overlay.classList.add('overlay--active');

        absence = [];
        search.value = '';
        revenue.value = '';
        dbParams = {};
        limit = document.querySelector('.table-sort span').textContent;
        document.querySelectorAll('.filter-newsletter input[type="radio"]').forEach(item => item.checked = false);
        document.querySelectorAll('.filter-search__item-empty input').forEach(item => item.checked = false);
        comparison = document.querySelector('#revenue .filter-drop span');
        data_source = document.querySelector('.source span');
        comparison.textContent = data_source.textContent = 'Не выбран';
        comparison.dataset.result ? comparison.removeAttribute('data-result') : false;
        data_source.dataset.result ? data_source.removeAttribute('data-result') : false;

        dbParams.limit = limit;
        console.log(dbParams);
        postRequest("/", dbParams, renderFilterData);
    });

    /*нажатие на кнопку фильтрации\поиска */
    document.querySelectorAll('.find').forEach(filterBtn => {
        filterBtn.addEventListener('click', (e) => {
            e.preventDefault();

            loadImg.classList.add('load--active');
            overlay.classList.add('overlay--active');

            // сортировка по столбцам: 0 - возрастанию, 1 - убыванию
            e.target.closest('.table__col-sort') ? dbParams.desc = +e.target.dataset.sort : false;
            e.target.closest('.lists-table__col') ? dbParams['order by'] = e.target.closest('.lists-table__col').dataset.val : false;

            //кол - во строк
            e.target.closest('.table-sort .drop__item') ? limit = e.target.dataset.drop : limit = document.querySelector('.table-sort span').textContent;
            dbParams.limit = limit;

            /*сбор данных в поле фильтрации*/
            // исключить пустые строки столбцов, это массив перечисленных столбцов, в которых надо исключить пустые строки
            absence = [];
            document.querySelectorAll('.filter-search__item-empty input').forEach(item => item.checked === true ? absence.push(item.id) : false);
            absence.length > 0 ? dbParams.absence = absence : delete dbParams.absence;

            // что мы ищем
            search.value != '' ? dbParams.search = search.value : delete dbParams.search;

            // источник данных
            data_source = document.querySelector('.source span');
            data_source.dataset.result ? dbParams.data_source = data_source.dataset.result : delete dbParams.data_source;

            // значение от которого отталкиваемся в обороте, 0 - равно, 1 - больше, - 2 - меньше
            comparison = document.querySelector('#revenue .filter-drop span');
            comparison.dataset.result ? comparison = +comparison.dataset.result : false;
            if (comparison != null && revenue.value != '') {
                dbParams.comparison = comparison;
                dbParams.revenue = revenue.value;
            }

            //участвовал в рассылке: 1 - Да, 0 - Нет
            letter('#email_newsletter') !== undefined ? dbParams.email_newsletter = letter('#email_newsletter') : false;
            letter('#mail_newsletter') !== undefined ? dbParams.mail_newsletter = letter('#mail_newsletter') : false;
            letter('#sms_mailing') !== undefined ? dbParams.sms_mailing = letter('#sms_mailing') : false;
            letter('#the_bell') !== undefined ? dbParams.the_bell = letter('#the_bell') : false;

            console.log('dbParams', dbParams);
            postRequest("/", dbParams, renderFilterData);
        });
    });

    /*POST запрос*/
    function postRequest(url, params, func) {
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json;charset=utf-8' },
            body: JSON.stringify(params),
        }).then(response => {
            let data;
            response.ok ? data = response.text() : false;
            return data;
        }).then(data => {
            loadImg.classList.remove('load--active');
            overlay.classList.remove('overlay--active');

            if (data === undefined) return false;

            let newData = JSON.parse(data);
            newData = JSON.parse(newData);

            return newData;
        }).then(newData => {
            func(newData);

        }).catch(err => console.error("failed", err));

        changeTables();
    }

    /*рендер таблицы с отфильтрованными значениями*/
    let rows,
        cols,
        objValue = 0,
        dataCol = '';

    function renderFilterData(data) {
        if (data === false || data.length < 1) {
            document.querySelector('.filter-empty').classList.add('filter-empty--active');
            return false;
        }

        document.querySelector('.filter-empty').classList.remove('filter-empty--active');

        rows = document.querySelectorAll('.lists-table .lists-table__col .lists-table__box:not(:first-child)');
        cols = document.querySelectorAll('.lists-table .lists-table__col');

        if (rows && cols) {
            filter.classList.remove('filter-search--active');
            rows.forEach(row => {
                row.remove();
            });

            for (let i = 0; i <= data.length - 1; i++) {
                for (let x = 0; x <= cols.length - 1; x++) {
                    objValue = Object.values(data[i]);
                    let objKey = Object.keys(data[i])[x];
                    let item = document.createElement('div');

                    dataCol = cols[x].dataset.col;

                    objValue[x] === null ? objValue[x] = '' : objValue[x];

                    item.classList.add('lists-table__box');

                    switch (objKey) {
                        case 'company_name':
                            item.innerHTML = `<p class="text"><a href="${objValue[1]}">${objValue[0]}</a></p>`;
                            cols[0].append(item);
                            break;
                        case 'inn_company':
                            renderItem(1, item, '');
                            break;
                        case 'legal_address':
                            renderItem(2, item, '');
                            break;
                        case 'position_head':
                            renderItem(3, item, '');
                            break;
                        case 'fio_head':
                            renderItem(4, item, '');
                            break;
                        case 'telephone':
                            renderItem(5, item, 'tel:');
                            break;
                        case 'mail':
                            renderItem(6, item, 'mailto:');
                            break;
                        case 'website':
                            item.innerHTML = `<p class="text"><a href="${objValue[7]}">${objValue[7]}</a></p>`;
                            dataCol = 'col7' ? colNum(7).append(item) : false;
                            break;
                        case 'data_source':
                            renderItem(8, item, '');
                            break;
                        case 'type_activity':
                            renderItem(9, item, '');
                            break;
                        case 'revenue':
                            renderItem(10, item, '');
                            break;
                        case 'email_newsletter':
                            renderItem(11, item, '');
                            break;
                        case 'mail_newsletter':
                            renderItem(12, item, '');
                            break;
                        case 'sms_mailing':
                            renderItem(13, item, '');
                            break;
                        case 'the_bell':
                            renderItem(14, item, '');
                            break;
                        default:
                            item.innerHTML = `<p class="text">${objValue[x]}</p>`;
                            return false;
                    }
                }
            }
        }
        changeTables();
    }

    function colNum(n) {
        return document.querySelector(`.lists-table .lists-table__col[data-col="col${n}"]`);
    }

    function renderItem(num, item, method) {
        if (num == 5 || num == 6) {
            let links = objValue[num];
            if (links) {
                item.innerHTML = `<p class="text text-flex"></p>`;
                links.forEach(link => item.querySelector('.text-flex').insertAdjacentHTML("afterbegin", `<a href="${method}${link}">${link},</a>`));
            }
        } else {
            item.innerHTML = `<p class="text">${objValue[num]}</p>`;
        }

        dataCol = `col${num}` ? colNum(num).append(item) : false;
    }

    /*tables*/
    function changeTables() {
        const tables = document.querySelectorAll('.table');
        if (tables) {
            const colItems = document.querySelectorAll('.lists-table__col[data-col]');
            const colInputs = document.querySelectorAll('.toggle-col__li input');

            /*show or hide column*/
            const toggles = document.querySelectorAll('.toggle-col');

            if (toggles) {
                toggles.forEach(toggle => {
                    toggle.addEventListener('click', () => toggle.classList.add('toggle-col--active'));
                    document.addEventListener('click', (e) => !e.target.closest('.toggle-col') ? toggle.classList.remove('toggle-col--active') : false);
                    showOrHideElements(colInputs, 'data-col', colItems);
                });
            }

            tables.forEach(table => {
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
                    colItems.forEach(col => col.classList.remove('col--active'));
                    draggedItem = null;
                }

                function dragenter(e) {
                    e.preventDefault();

                    if (draggedItem !== droppedItem) {
                        droppedItem = this;
                    }

                    colItems.forEach(col => col.classList.add('col--active'));
                    this.classList.remove('col--active');
                }

                function drop(e) {
                    e.stopPropagation();
                    if (droppedItem) {

                        let array = Array.from(droppedItem.parentElement.children);
                        let indexdraggedItem = array.indexOf(draggedItem);
                        let indexdroppedItem = array.indexOf(this);

                        indexdraggedItem > indexdroppedItem ? table.insertBefore(draggedItem, this) : table.insertBefore(draggedItem, this.nextElementSibling);

                        updateTable();
                    }
                }
            });

            resizeCol();

            /*resize columns*/
            function updateTable() {
                tables.forEach(table => {
                    $(table).colResizable({ disable: true });

                    resizeCol();
                });
            }

            function resizeCol() {
                tables.forEach(table => {
                    $(table).colResizable({
                        liveDrag: true,
                        resizeMode: 'overflow'
                    });
                });
            }
        }
    }

    /*скрыть показать/элементы*/
    function showOrHideElements(inputs, data_attr, items) {
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                let input_id = input.getAttribute("id");
                items.forEach(item => {
                    let data = item.getAttribute(data_attr);
                    input.checked == false && data == input_id ? item.classList.add('dn') : false;
                    input.checked == true && data == input_id ? item.classList.remove('dn') : false;
                });
            });
        });
    }

    /*выбор всех чекбоксов*/
    function checkAllInputs(btnAll, inputs) {
        if (btnAll) {
            for (let i = 0; i < inputs.length; i++) {
                inputs[i].addEventListener("click", function () {
                    let inputsChecked = allInputsChecked.length;
                    inputsChecked < inputs.length ? btnAll.indeterminate = true : false;
                });
            }

            btnAll.addEventListener("click", () => {
                for (let j = 0; j < inputs.length; j++) inputs[j].checked = btnAll.checked;
                btnAll.indeterminate = false;
            });
        }
    }

    /*popup*/
    function popupToggle() {
        const popupBtns = document.querySelectorAll('.popup-btn');

        if (popupBtns) {
            popupBtns.forEach(btn => btn.addEventListener('click', () => body.classList.add('active')));

            document.addEventListener('click', (e) => !e.target.closest('.popup-btn') && !e.target.closest('.popup') || e.target.closest('.popup>span') ? body.classList.remove('active') : false);
        }
    }

    /*рассылки*/
    function letter(id) {
        let check = document.querySelector(`${id} input:checked`);
        if (check) {
            check.dataset.newsletter == 1 ? check = 1 : check = 0;
            return check;
        }
    }

    /*перемещение столбцов таблицы*/
    function dropFunc(res) {
        const drops = document.querySelectorAll('.drop');
        document.addEventListener('click', (e) => {
            !e.target.closest('.drop') || e.target.closest('.drop__item') ? drops.forEach(drop => drop.classList.remove('drop--active')) : false;
        });

        drops.forEach(drop_wrap => {
            const dropItems = drop_wrap.querySelectorAll('.drop__item');
            const dropSpan = drop_wrap.querySelector('span');

            if (dropItems) {
                drop_wrap.addEventListener('click', () => {
                    drop_wrap.classList.add('drop--active');
                    dropItems.forEach(item => {
                        item.addEventListener('click', () => {
                            let dataDrop = item.dataset.drop;
                            dropSpan.setAttribute('data-result', dataDrop);
                            res = dropSpan.getAttribute('data-result');
                            res === 'undefined' ? dropSpan.removeAttribute('data-result') : false;
                            dropSpan.textContent = item.textContent;
                            drop_wrap.classList.remove('drop--active');
                        });
                    });
                });
            }
        });
    }

    /*табы*/
    function funcTabs(dataAttr, inner) {
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(tab => tab.classList.remove('tabs-item--active'));

                const dataTab = tab.getAttribute('data-tabs');

                document.querySelectorAll(inner).forEach(item => {
                    item.classList.remove('tabs--active');
                    const dataItem = item.getAttribute(dataAttr);
                    dataItem == dataTab ? item.classList.add('tabs--active') : false;
                });

                tab.classList.add('tabs-item--active');
            });
        });
    }
});

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
    let checkboxes = document.querySelectorAll('.lists-table__box:not(.lists-table__box-name) input:checked');

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

// function createLetters(){
//     let checkboxes = document.querySelectorAll('.lists-table__box:not(.lists-table__box-name) input:checked');
//     let values = [];
//     if (checkboxes.length === 0 || checkboxes.length > 1) {
//         alert("Необходимо выбрать только одну рассылку")
//     } else {
//         alert(tutu)
//         for (let i = 0; i < checkboxes.length; i++) {
//             values.push([checkboxes[i].value]);
//             alert(checkboxes[i].value);
//         }
//
//         var xhr = new XMLHttpRequest();
//         xhr.open("POST", "/emailCount/createLetters/", true);
//         xhr.setRequestHeader('Content-Type', 'application/json');
//         xhr.send(JSON.stringify(values)); // Отправьте массив значений
//         xhr.responseType = "blob";
//         xhr.onreadystatechange = function () {
//             xhr.onload = function () {
//                 if (xhr.status === 200) {
//                     var fileName = ".docx"; // Задайте имя файла для скачивания
//                     var a = document.createElement("a");
//                     a.href = window.URL.createObjectURL(xhr.response);
//                     a.download = fileName;
//                     a.style.display = "none";
//                     document.body.appendChild(a);
//                     a.click();
//                     a.remove();
//                 }
//             };
//         }
//     }
// }

function removeLine(){
       let checkboxes = document.querySelectorAll('.lists-table__box:not(.lists-table__box-name) input:checked');
    let valuesArray = []; // Используйте массив объектов
    for (let i = 0; i < checkboxes.length; i++) {
        let values = {}; // Создайте новый объект значений для каждого чекбокса
        values['check_' + i] = [checkboxes[i].value]; // Задаем значение поля
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