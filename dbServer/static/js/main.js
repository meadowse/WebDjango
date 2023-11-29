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
    const columns = document.querySelectorAll('.lists-table .lists-table__col:not(.table-check) .lists-table__box:first-child');
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
    const form = document.querySelector('.header-input');
    const filter = document.querySelector('.filter-search__wrap');
    const filterCompany = document.querySelector('.filter-company');
    const addLetter = document.getElementById('addLetter');

    filterCompany ? form.addEventListener('click', () => filter.classList.toggle('filter-search--active')) : false;

    document.addEventListener('click', (e) => !e.target.closest('.filter-search__wrap') && !e.target.closest('.header-form') && !e.target.closest('.overlay') ? filter.classList.remove('filter-search--active') : false);

    addLetter != null ? addLetter.addEventListener('click', () => document.querySelector('.update-company').classList.add('active')) : false;

    /*фильтр*/
    let dbParams = {},
        limit,
        desc,
        search = document.querySelector('.header-input'),
        revenue = document.querySelector('#revenue input'),
        comparison,
        data_source,
        absence,
        url = window.location.pathname,
        email_newsletter,
        mail_newsletter,
        sms_mailing,
        the_bell;

    /*сброс фильтра*/
    document.querySelector('.reset').addEventListener('click', (e) => {
        e.preventDefault();

        loadFilterData();

        absence = [];
        search.value = '';
        revenue.value = '';
        dbParams = {};
        limit = document.querySelector('.table-sort span').textContent;
        document.querySelectorAll('.filter-search__item-empty input').forEach(item => item.checked = false);
        document.querySelectorAll('.filter-search__item .filter-drop span').forEach(item => {
            item.textContent = 'Не выбрано';
            item.dataset.result ? item.removeAttribute('data-result') : false;
        });

        comparison = document.querySelector('#revenue .filter-drop span');

        data_source = document.querySelector('.source span');
        comparison.textContent = data_source.textContent = 'Не выбран';
        comparison.dataset.result ? comparison.removeAttribute('data-result') : false;
        data_source.dataset.result ? data_source.removeAttribute('data-result') : false;

        dbParams.limit = limit;
        console.log(dbParams);
        postRequest(dbParams, tableDataProcess);
        changeTables();
    });

    /*нажатие на кнопку фильтрации\поиска */
    document.querySelectorAll('.find').forEach(filterBtn => {
        filterBtn.addEventListener('click', (e) => {
            e.preventDefault();

            loadFilterData();

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

            // значение от которого отталкиваемся в обороте, 0 - равно, 1 - больше, -1 - меньше
            comparison = document.querySelector('#revenue .filter-drop span');
            comparison.dataset.result ? comparison = +comparison.dataset.result : false;
            if (comparison != null && revenue.value != '') {
                dbParams.comparison = comparison;
                dbParams.revenue = revenue.value;
            }

            //участвовал в рассылке: 1 - Да, 0 - Нет
            email_newsletter = document.querySelector('#email_newsletter .filter-drop span');
            mail_newsletter = document.querySelector('#mail_newsletter .filter-drop span');
            sms_mailing = document.querySelector('#sms_mailing .filter-drop span');
            the_bell = document.querySelector('#the_bell .filter-drop span');

            email_newsletter.dataset.result ? dbParams.email_newsletter = +email_newsletter.dataset.result : delete dbParams.email_newsletter;
            mail_newsletter.dataset.result ? dbParams.mail_newsletter = +mail_newsletter.dataset.result : delete dbParams.mail_newsletter;
            sms_mailing.dataset.result ? dbParams.sms_mailing = +sms_mailing.dataset.result : delete dbParams.sms_mailing;
            the_bell.dataset.result ? dbParams.the_bell = +the_bell.dataset.result : delete dbParams.the_bell;

            console.log('dbParams', dbParams);
            postRequest(dbParams, tableDataProcess);
        });
    });

    /*POST запрос*/
    function postRequest(params, func) {
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json;charset=utf-8' },
            body: JSON.stringify(params),
        }).then(response => {
            let data;
            response.ok ? data = response.text() : false;
            afterFilter();
            return data;
        }).then(data => {
            if (data === undefined) return false;
            let newData = parserData(data);

            return newData;

        }).then(newData => {
            func(newData);
        }).catch(err => console.error("failed", err));
    }

    /*рендер таблицы с отфильтрованными значениями*/
    let rows,
        cols,
        objValue = 0,
        dataCol = '';

    function parserData(data, NotInNewsletter, InNewsletter) {
        data = JSON.parse(data);
        if (typeof (data) == 'object') {
            InNewsletter = JSON.parse(data.InNewsletter);
            NotInNewsletter = JSON.parse(data.NotInNewsletter);
            let parseObj = { NotInNewsletter, InNewsletter }
            return parseObj;
        } else { return JSON.parse(data); }
    }

    function tableDataProcess(data) {
        if (!Array.isArray(data)) {
            let objKeys = Object.keys(data);
            for (let i = 0; i <= objKeys.length - 1; i++) {
                let objValues = Object.values(data);
                switch (objKeys[i]) {
                    case 'NotInNewsletter':
                        renderFilterData(objValues[i], "#NotInNewsletter");
                        break;
                    case 'InNewsletter':
                        renderFilterData(objValues[i], "#InNewsletter");
                        break;
                }
            }
        } else {
            renderFilterData(data, "#tableCompany");
        }
        checkAllInputs(checkAllRemove, document.querySelectorAll('.update-right .lists-table__box:not(.lists-table__box-name) input'));
        checkAllInputs(checkAllAdd, document.querySelectorAll('.update-left .lists-table__box:not(.lists-table__box-name) input'));
    }

    function afterFilter() {
        filter.classList.remove('filter-search--active');
        loadImg.classList.remove('load--active');
        overlay.classList.remove('overlay--active');
    }

    function loadFilterData() {
        loadImg.classList.add('load--active');
        overlay.classList.add('overlay--active');
    }

    function renderFilterData(data, id, ...args) {
        const renderTable = document.querySelector(`${id}`),
            renderEmpty = renderTable.querySelector('.filter-empty');

        if (data === false || data.length < 1) {
            renderEmpty ? false : renderTable.insertAdjacentHTML("afterbegin", `<div class="filter-empty">По Вашему запросу ничего не найдено</div>`);
            return false;
        }

        renderEmpty ? renderEmpty.remove() : false;

        const tableCheck = renderTable.querySelector(`.table-check`);
        rows = renderTable.querySelectorAll(`.lists-table__col .lists-table__box:not(:first-child)`);
        cols = renderTable.querySelectorAll(`.lists-table__col:not(.table-check)`);

        if (rows && cols) {
            filter.classList.remove('filter-search--active');
            rows.forEach(row => row.remove());

            for (let i = 0; i <= data.length - 1; i++) {
                if (tableCheck) {
                    let renderCheck = document.createElement('div');
                    renderCheck.classList.add('lists-table__box');
                    renderCheck.insertAdjacentHTML('afterbegin',
                        `<label for="check">
                            <input type="checkbox" value="${Object.values(data[i])[1]}">
                            <span></span>
                        </label>`);
                    tableCheck.append(renderCheck);
                }

                for (let x = 0; x <= cols.length - 1; x++) {
                    const colName = renderTable.querySelector(`.lists-table__col-name`);
                    let objKey = Object.keys(data[i])[x];
                    let item = document.createElement('div');

                    objValue = Object.values(data[i]);
                    item.classList.add('lists-table__box');
                    dataCol = cols[x].dataset.col;
                    objValue[x] === null ? objValue[x] = '' : objValue[x];

                    switch (objKey) {
                        case 'company_name':

                            // href="{% url 'info' i.inn_company %}"
                            item.innerHTML = `<p class="text"><a href="/${objValue[1]}/">${objValue[0]}</a></p>`;

                            colName.append(item);
                            break;
                        case 'inn_company':
                            renderItem(1, item, '', id);
                            break;
                        case 'legal_address':
                            renderItem(2, item, '', id);
                            break;
                        case 'position_head':
                            renderItem(3, item, '', id);
                            break;
                        case 'fio_head':
                            renderItem(4, item, '', id);
                            break;
                        case 'telephone':
                            renderItem(5, item, 'tel:', id);
                            break;
                        case 'mail':
                            renderItem(6, item, 'mailto:', id);
                            break;
                        case 'website':
                            item.innerHTML = `<p class="text"><a href="${objValue[7]}" target="_blank">${objValue[7]}</a></p>`;
                            dataCol = 'col7' ? colNum(7, id).append(item) : false;
                            break;
                        case 'data_source':
                            renderItem(8, item, '', id);
                            break;
                        case 'type_activity':
                            renderItem(9, item, '', id);
                            break;
                        case 'revenue':
                            renderItem(10, item, '', id);
                            break;
                        case 'email_newsletter':
                            renderItem(11, item, '', id);
                            break;
                        case 'mail_newsletter':
                            renderItem(12, item, '', id);
                            break;
                        case 'sms_mailing':
                            renderItem(13, item, '', id);
                            break;
                        case 'the_bell':
                            renderItem(14, item, '', id);
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

    function colNum(n, id) {
        return document.querySelector(`${id} .lists-table__col[data-col="col${n}"]`);
    }

    function renderItem(num, item, method, id) {
        if (num == 5 || num == 6) {
            let links = objValue[num];
            if (links) {
                item.innerHTML = `<p class="text text-flex"></p>`;
                links.forEach(link => item.querySelector('.text-flex').insertAdjacentHTML("afterbegin", `<a href="${method}${link}">${link},</a>`));
            }
        } else { item.innerHTML = `<p class="text">${objValue[num]}</p>`; }

        dataCol = `col${num}` ? colNum(num, id).append(item) : false;
    }

    /*tables*/
    function changeTables() {
        const tables = document.querySelectorAll('.table');
        if (tables) {
            tables.forEach(table => {
                const colItems = table.querySelectorAll('.lists-table__col[data-col]');
                const colInputs = table.querySelectorAll('.toggle-col__li input');

                /*show or hide column*/
                const toggles = table.querySelectorAll('.toggle-col');

                if (toggles) {
                    toggles.forEach(toggle => {
                        toggle.addEventListener('click', () => toggle.classList.add('toggle-col--active'));
                        document.addEventListener('click', (e) => !e.target.closest('.toggle-col') ? toggle.classList.remove('toggle-col--active') : false);
                        showOrHideElements(colInputs, 'data-col', colItems);
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
                console.log('fsdfsdfsdf');
                for (let j = 0; j < inputs.length; j++) inputs[j].checked = btnAll.checked;
                btnAll.indeterminate = false;
            });
        }
        return false;
    }

    /*popup*/
    function popupToggle() {
        const popupBtns = document.querySelectorAll('.popup-btn');

        if (popupBtns) {
            popupBtns.forEach(btn => btn.addEventListener('click', () => body.classList.add('active')));

            document.addEventListener('click', (e) => !e.target.closest('.popup-btn') && !e.target.closest('.popup') || e.target.closest('.popup>span') ? body.classList.remove('active') : false);
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
                    drop_wrap.classList.toggle('drop--active');
                    dropItems.forEach(item => {
                        item.addEventListener('click', () => {
                            let dataDrop = item.dataset.drop;
                            dropSpan.setAttribute('data-result', dataDrop);
                            res = dropSpan.getAttribute('data-result');
                            res === 'undefined' ? dropSpan.removeAttribute('data-result') : false;
                            dropSpan.textContent = item.textContent;
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

