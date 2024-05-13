"use strict"
document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const tabs = document.querySelectorAll('.tabs-item');
    const overlay = document.querySelector('.overlay');
    const loadImg = document.querySelector('.load-img');
    let numsWrap = document.querySelector('.more-navigation__nums');

    /*активное меню*/
    const menuItems = document.querySelectorAll('.menu-li');
    if (menuItems) {
        menuItems.forEach(item => {
            let dataItem = item.getAttribute('data-url');
            window.location.pathname.includes(`${dataItem}`) ? item.classList.add('active') : false;
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
    const columns = document.querySelectorAll('.table-block .toggle-col__li');
    if (columns) {
        columns.forEach(item => item.insertAdjacentHTML("beforeend",
            `<div class="table__col-sort-box">
                <div class="table__col-sort table__col-incr find" data-sort="1"></div>
                <div class="table__col-sort table__col-decr find" data-sort="0"></div>
            </div>`));

        document.querySelectorAll(".table__col-sort").forEach(item => item.addEventListener("click", () => {
            document.querySelectorAll(".table__col-sort").forEach(item => { item.classList.remove('table__col-sort--active'); });
            item.classList.add('table__col-sort--active');
        }));
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
    const form = document.querySelector('.header-input'),
        filter = document.querySelector('.filter-search__wrap'),
        navPrev = document.querySelector('.more-navigation__wrap .prev'),
        navNext = document.querySelector('.more-navigation__wrap .next'),
        filterCompany = document.querySelector('.filter-company'),
        addLetter = document.getElementById('addLetter');

    let navPages = document.querySelectorAll('.more-navigation__num');

    filterCompany ? form.addEventListener('click', () => filter.classList.toggle('filter-search--active')) : false;

    document.addEventListener('click', (e) => !e.target.closest('.filter-search__wrap') && !e.target.closest('.header-form') && !e.target.closest('.overlay') ? filter.classList.remove('filter-search--active') : false);

    addLetter != null ? addLetter.addEventListener('click', () => document.querySelector('.update-company').classList.add('active')) : false;

    /*фильтр*/
    let dbParams = {},
        count,
        limit = document.querySelector('.limit-sort span'),
        desc,
        search = document.querySelector('.header-input'),
        revenue = document.querySelector('#revenueNum input'),
        comparison,
        data_source,
        absence,
        url = window.location.pathname,
        email_newsletter,
        mail_newsletter,
        sms_mailing,
        countPage = 0,
        currentPage = 1,
        counterVal = document.querySelector('.counter-1'),
        counterVal2 = document.querySelector('.counter-2'),
        the_bell,
        finds = document.querySelectorAll('.find'),
        countArray = [];
    let localSettings = JSON.parse(localStorage.getItem('settings'));

    /*сброс фильтра*/
    document.querySelector('.reset').addEventListener('click', (e) => {
        e.preventDefault();

        loadFilterData();

        absence = [];
        search.value = '';
        revenue.value = '';
        dbParams = {};
        // limit = document.querySelector('.limit-sort span');
        document.querySelectorAll('.filter-search__item-empty input').forEach(item => item.checked = false);
        document.querySelectorAll('.filter-search__item .filter-drop span').forEach(item => {
            item.textContent = 'Не выбрано';
            item.dataset.result ? item.removeAttribute('data-result') : false;
        });

        limit ? limit = limit.textContent : false;

        comparison = document.querySelector('#revenueNum .filter-drop span');

        data_source = document.querySelector('.source span');
        comparison.textContent = data_source.textContent = 'Не выбран';
        comparison.dataset.result ? comparison.removeAttribute('data-result') : false;
        data_source.dataset.result ? data_source.removeAttribute('data-result') : false;

        dbParams.limit = limit;
        console.log("dbParams", dbParams);
        postRequest(dbParams, tableDataProcess);
        changeTables();
        localStorage.clear();
    });
    console.log("dbParams", dbParams);

    /*сбор данных на сервер для фильтрации данных*/
    /*нажатие на кнопку фильтрации\поиска */
    function funcFilter(e) {
        if (e.target.closest('.navigation-current')) return false;

        e.preventDefault();

        loadFilterData();
        countArray = [];

        // сортировка по столбцам: 0 - возрастанию, 1 - убыванию
        e.target.closest('.table__col-sort') ? dbParams.desc = +e.target.dataset.sort : false;
        e.target.closest('.toggle-col__li') ? dbParams['order by'] = e.target.closest('.toggle-col__li').dataset.val : false;

        //кол - во строк
        e.target.closest('.limit-sort .drop__item') ? limit = e.target.dataset.drop : (document.querySelector('.limit-sort span') ? limit = document.querySelector('.limit-sort span').textContent : false);
        dbParams.limit = +limit;

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
        comparison = document.querySelector('#revenueNum .filter-drop span');
        comparison.dataset.result ? comparison = +comparison.dataset.result : false;
        if (comparison != null && revenue.value != '') {
            dbParams.comparison = comparison;
            dbParams.revenue = revenue.value;
        }

        // постраничная навигация
        if (e.target.dataset.num) {
            currentPage = +e.target.dataset.num;
            dbParams.page = currentPage;
            changeNavPrev();
            changeNavNext();
        }

        if (e.target.closest('.more-navigation__wrap .next')) {
            countPage == currentPage ? false : ++currentPage;
            changeNavPrev();
            changeNavNext();
        }

        if (e.target.closest('.more-navigation__wrap .prev')) {
            currentPage <= 1 ? false : dbParams.page = --currentPage;
            changeNavPrev();
            changeNavNext();
        }

        //расчет текущей страницы при изменении limit
        let currentNumLimit = Math.ceil((currentPage * document.querySelector('.limit-sort span').textContent) / limit);
        currentNumLimit > countPage ? currentPage = dbParams.page = countPage : currentPage = dbParams.page = currentNumLimit;

        e.target.closest('.filter-btn') === null || navPages && navPages.length <= 29 && e.target.closest('.drop__item') === null ? false : currentPage = dbParams.page = 1;

        changeNavPrev();

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

        localStorage.setItem('settings', JSON.stringify(dbParams));
    }

    finds.forEach(filterBtn => filterBtn.addEventListener('click', (e) => funcFilter(e)));

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

            let newData = JSON.parse(data);
            console.log('newData', newData);
            return newData;

        }).then(newData => {
            func(newData);
        }).catch(err => console.error("failed", err));

        changeTables();
        revenueProcess();
    }

    function saveFilterSettings() {
        localSettings = JSON.parse(localStorage.getItem('settings'));
        if (localSettings != null) {
            loadFilterData();

            postRequest(JSON.parse(localStorage.getItem('settings')), tableDataProcess);

            localSettings.absence != null ? document.querySelectorAll('.filter-search__item-empty input').forEach(input => {
                localSettings.absence.forEach(item => input.id == item ? input.checked = true : false);
            }) : false;

            function filterRasilka(valueStorage, block) {
                if (block && valueStorage != null) {
                    const item = document.querySelector(`${block} .filter-drop span`);
                    if (item) {
                        item.setAttribute('data-result', valueStorage);
                        item.textContent = document.querySelector(`${block} .drop__item[data-drop='${valueStorage}']`).textContent;
                    }
                }
            }

            filterRasilka(localSettings.data_source, '#source');
            filterRasilka(localSettings.email_newsletter, '#email_newsletter');
            filterRasilka(localSettings.sms_mailing, '#sms_mailing');
            filterRasilka(localSettings.mail_newsletter, '#mail_newsletter');
            filterRasilka(localSettings.the_bell, '#the_bell');
            filterRasilka(localSettings.limit, '.more-box');
            filterRasilka(localSettings.comparison, '#revenueNum');
            document.querySelector('#revenueNum input').value = localSettings.comparison;

            /*рендер пагинации исходя из сохраненных настроек при перезагрузке страницы*/
            if (localSettings.page) {

                for (let i = 0; i <= navPages.length; i++) {
                    if (navPages[i]) {
                        navPages[i].classList.remove('navigation-current');
                        navPages[i].dataset.num == +localSettings.page ? navPages[i].classList.add('navigation-current') : false;
                    }
                }
                clearWrap(numsWrap);

                currentPage = +localSettings.page;

                changeNavPrev();
                for (let j = (currentPage - 15); j <= (currentPage + 15); j++)  renderPagination(j);
            }
        }
    }

    window.addEventListener("load", () => {
        saveFilterSettings();
        navigation();
        revenueProcess();
    });

    /*рендер таблицы с отфильтрованными значениями*/
    let objValue = 0;

    function tableDataProcess(data) {
        let objKeys = Object.keys(data);
        console.log('objKeys', objKeys);
        for (let i = 0; i <= objKeys.length - 1; i++) {
            let objValues = Object.values(data);
            switch (objKeys[i]) {
                case 'NotInNewsletter':
                    counterVal ? counterVal.textContent = data.count : false;
                    renderFilterData(objValues[i], "#NotInNewsletter");
                    break;
                case 'InNewsletter':
                    counterVal2 ? counterVal2.textContent = data.count2 : false;
                    renderFilterData(objValues[i], "#InNewsletter");
                    break;
                case 'Info':
                    counterVal ? counterVal.textContent = data.count : false;
                    renderFilterData(objValues[i], "#tableCompany");
                    break;
                case 'objInfo':
                    counterVal ? counterVal.textContent = data.count : false;
                    renderFilterData(objValues[i], "#tableObjects");
                    break;
            }
            console.log("objValues", objValues);
        }
        checkAllInputs(checkAllRemove, document.querySelectorAll('.update-right .lists-table__box:not(.lists-table__box-name) input'));
        checkAllInputs(checkAllAdd, document.querySelectorAll('.update-left .lists-table__box:not(.lists-table__box-name) input'));
        revenueProcess();
        navigation();
    }

    function navigation() {
        const counters = document.querySelectorAll('.counter');
        if (counters) {
            const tableItems = document.querySelectorAll('.lists-table__col-name .lists-table__box:not(.lists-table__box-name)'),
                navWrap = document.querySelector('.more-navigation__wrap');

            let lastNum = document.querySelector('.more-navigation__num-last'),
                firstNum = document.querySelector('.more-navigation__num-first'),
                navArray = [],
                sumCompany;

            clearWrap(numsWrap);
            countPage = 0;

            document.querySelector('.limit-sort span') ? limit = document.querySelector('.limit-sort span').textContent : false;

            counters.forEach(counter => {
                navArray.push(counter.textContent);
                return sumCompany = Math.max.apply(null, navArray);
            });

            dispFlex(navWrap);

            if (tableItems && tableItems.length >= +sumCompany) return dispNone(navWrap), false;

            countPage = Math.ceil(sumCompany / +limit);
            changeNavNext();

            /*рендер пагинации*/
            for (let i = 2; i <= countPage; i++)  i < 30 ? renderPagination(i) : false;

            /*рендер пагинации на последних страницах*/
            if (currentPage >= countPage - 16 && currentPage >= countPage - navPages.length) {
                clearWrap(numsWrap);
                for (let y = countPage - (navPages.length - 2); y < countPage; y++)  renderPagination(y);
            }

            /*рендер пагинации с центральной активной страницей*/
            if (currentPage >= 18 && currentPage <= countPage - 17) {
                clearWrap(numsWrap);
                for (let j = (currentPage - 15); j <= (currentPage + 15); j++)  renderPagination(j);
            }
            dbParams.page = currentPage;
            finds = document.querySelectorAll('.find');

            lastNum ? lastNum.textContent = `${countPage}` : false;
            lastNum ? lastNum.setAttribute("data-num", `${countPage}`) : false;

            removeDotsAfter();
            removeDotsBefore();
            if (navPages.length != 0) {
                navPages[navPages.length - 1].insertAdjacentHTML('beforebegin', `<span class="after-dots">...</span>`);

                if (navPages.length <= 29) {
                    clearWrap(numsWrap);
                    dispNone(firstNum);
                    dispNone(lastNum);
                    for (let i = 1; i <= countPage; i++)  i < 30 ? renderPagination(i) : false;
                    removeDotsAfter();
                    removeDotsBefore();
                } else {
                    dispFlex(firstNum);
                    dispFlex(lastNum);
                }
                for (let i = 0; i <= navPages.length; i++) {
                    if (navPages[i]) {
                        navPages[i].classList.remove('navigation-current');
                        navPages[i].dataset.num == dbParams.page ? navPages[i].classList.add('navigation-current') : false;
                        if (navPages[i].classList.contains('navigation-current') &&
                            navPages[i].dataset.num >= countPage - (Math.floor(navPages.length / 2))) {
                            removeDotsAfter();
                        }
                        if (navPages[i].classList.contains('navigation-current') && navPages[i].dataset.num >= 18 && navPages.length >= 29) {
                            navPages[0].insertAdjacentHTML('afterend', `<span class="before-dots">...</span>`);
                        } else if (navPages[i].classList.contains('navigation-current') && navPages[i].dataset.num <= 17) {
                            removeDotsBefore();
                        }
                    }
                }
            }
        }
    }

    function renderPagination(num) {
        let numPage = document.createElement('div');
        numPage.classList.add('more-navigation__num');
        numPage.setAttribute("data-num", num);
        numPage.textContent = `${num}`;
        numsWrap.append(numPage);
        navPages = document.querySelectorAll('.more-navigation__num');
    }

    function removeDotsBefore() {
        const beforeDots = document.querySelector('.before-dots');
        beforeDots ? beforeDots.remove() : false;
    }

    function removeDotsAfter() {
        const afterDots = document.querySelector('.after-dots');
        afterDots ? afterDots.remove() : false;
    }

    /*Обработка выручки*/
    function revenueProcess() {
        let revenueVal = document.querySelectorAll('.revenue-value');
        if (revenueVal) {
            revenueVal.forEach(val => {
                if (val.textContent == 'None' || val.textContent == '0' || val.textContent == '' || val.textContent.length == 0) {
                    return false;
                } else if (val.textContent.length < 7) {
                    val.textContent = +val.textContent.slice(0, -3) + " тыс. ₽";
                } else if (val.textContent.length < 10) {
                    val.textContent = +val.textContent.slice(0, -6) + " млн. ₽";
                } else if (val.textContent.length < 13) {
                    val.textContent = +val.textContent.slice(0, -9) + " млрд. ₽";
                } else if (val.textContent.length < 16) {
                    val.textContent = +val.textContent.slice(0, -12) + " трлн. ₽";
                }
            });
        }
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

    function clearWrap(wrap) {
        wrap ? wrap.innerHTML = '' : false;
    }

    function dispNone(item) {
        item ? item.style.display = "none" : false;
    }

    function dispFlex(item) {
        item ? item.style.display = "flex" : false;
    }

    function changeNavPrev() {
        currentPage <= 1 ? dispNone(navPrev) : dispFlex(navPrev);
    }

    function changeNavNext() {
        countPage == currentPage ? dispNone(navNext) : dispFlex(navNext);
    }

    function renderFilterData(data, id, ...args) {
        const renderTable = document.querySelector(`${id}`),
            renderEmpty = renderTable.querySelector('.filter-empty'),
            tableCheck = renderTable.querySelector(`.table-check`);

        let rows,
            dataCol = '',
            cols,
            rasID = window.location.pathname.replace(/[^+\d]/g, '');

        if (data === false || data.length < 1) {
            renderEmpty ? false : renderTable.insertAdjacentHTML("afterbegin", `<div class="filter-empty">По Вашему запросу ничего не найдено</div>`);
            return false;
        }
        renderEmpty ? renderEmpty.remove() : false;

        rows = renderTable.querySelectorAll(`.lists-table__col .lists-table__box:not(:first-child)`);
        cols = renderTable.querySelectorAll(`.lists-table__col:not(.table-check)`);

        const renderCheckBox = (i, checkBox, attrClass, attrName = '') => {
            checkBox.insertAdjacentHTML('afterbegin',
                `<label for="check">
                    <input type="checkbox" value="${Object.values(data[i])[2]}, ${rasID}" ${attrName} class="${attrClass}">
                    <span></span>
                </label>`);
        }

        if (rows && cols) {
            filter.classList.remove('filter-search--active');
            rows.forEach(row => row.remove());

            for (let i = 0; i <= data.length - 1; i++) {

                if (tableCheck) {

                    let renderCheck = document.createElement('div');
                    renderCheck.classList.add('lists-table__box');

                    renderTable.id == 'InNewsletter' ? renderCheckBox(i, renderCheck, 'removeFromNewsletter', 'name="interest"') : renderCheckBox(i, renderCheck, 'needad');

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
                        case 'id':
                            break;
                        case 'company_name':
                            item.innerHTML = `<p class="text"><a href="/${objValue[2]}/">${objValue[1]}</a></p>`;
                            colName.append(item);
                            break;
                        case 'inn_company':
                            renderItem(2, item, '', id, dataCol);
                            break;
                        case 'legal_address':
                            renderItem(3, item, '', id, dataCol);
                            break;
                        case 'position_head':
                            renderItem(4, item, '', id, dataCol);
                            break;
                        case 'fio_head':
                            renderItem(5, item, '', id, dataCol);
                            break;
                        case 'telephone':
                            renderItem(6, item, 'tel:', id, dataCol);
                            break;
                        case 'mail':
                            renderItem(7, item, 'mailto:', id, dataCol);
                            break;
                        case 'website':
                            item.innerHTML = `<p class="text"><a href="${objValue[8]}" target="_blank">${objValue[8]}</a></p>`;
                            dataCol = 'col8' ? colNum(8, id).append(item) : false;
                            break;
                        case 'data_source':
                            renderItem(9, item, '', id, dataCol);
                            break;
                        case 'type_activity':
                            renderItem(10, item, '', id, dataCol);
                            break;
                        case 'revenue':
                            renderItem(11, item, '', id, dataCol);
                            break;
                        case 'email_newsletter':
                            renderItem(12, item, '', id, dataCol);
                            break;
                        case 'mail_newsletter':
                            renderItem(13, item, '', id, dataCol);
                            break;
                        case 'sms_mailing':
                            renderItem(14, item, '', id, dataCol);
                            break;
                        case 'the_bell':
                            renderItem(15, item, '', id, dataCol);
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

    function renderItem(num, item, method, id, dataCol) {
        if (num == 6 || num == 7) {
            let links = objValue[num];
            if (links) {
                item.innerHTML = `<p class="text text-flex"></p>`;
                links.forEach(link => item.querySelector('.text-flex').insertAdjacentHTML("afterbegin", `<a href="${method}${link}">${link},</a>`));
            }
        } else if (num == 11) {
            item.innerHTML = `<p class="text revenue-value">${objValue[num]}</p>`;
        } else { item.innerHTML = `<p class="text">${objValue[num]}</p>`; }

        dataCol = `col${num}` ? colNum(num, id).append(item) : false;
    }

    /*tables*/
    function changeTables() {
        const tablesBlock = document.querySelectorAll('.table-block');
        if (tablesBlock) {
            tablesBlock.forEach(block => {
                const table = block.querySelector('.table');
                const colItems = block.querySelectorAll('.lists-table__col[data-col]');
                const colInputs = block.querySelectorAll('.toggle-col__li input');

                /*show or hide column*/
                const toggles = document.querySelectorAll('.toggle-col');

                if (toggles) {
                    toggles.forEach(toggle => {
                        toggle.addEventListener('click', () => toggle.classList.add('toggle-col--active'));
                        document.addEventListener('click', (e) => !e.target.closest('.toggle-col') || e.target.closest('.table__col-sort') ? toggle.classList.remove('toggle-col--active') : false);
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
                resizeCol();

                /*resize columns*/
                function updateTable() {
                    $(table).colResizable({ disable: true });

                    resizeCol();
                }

                function resizeCol() {
                    $(table).colResizable({
                        liveDrag: true,
                        resizeMode: 'overflow'
                    });
                }
            });
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

function createLabels() {
    let checkboxes = document.querySelectorAll('.lists-table__box:not(.lists-table__box-name) input:checked');
    let values = [];
    if (checkboxes.length > 1) {
        alert("Необходимо выбрать только одну рассылку")
    } else {
        if (checkboxes.length === 0) {
            alert("Необходимо выбрать хотя бы одну рассылку")
        } else {
            values.push([checkboxes[0].value]);
            const arr = values[0][0].split(', ');
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "/emailCount/createLabels/", true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify(values)); // Отправьте массив значений
            xhr.responseType = "blob";
            xhr.onreadystatechange = function () {
                xhr.onload = function () {
                    if (xhr.status === 200) {
                        var fileName = "Наклейки " + arr[arr.length - 1] + ".zip"; // Задайте имя файла для скачивания
                        var a = document.createElement("a");
                        a.href = window.URL.createObjectURL(xhr.response);
                        a.download = fileName;
                        a.style.display = "none";
                        document.body.appendChild(a);
                        a.click();
                        a.remove();
                    }
                }
            };
        }
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

function removeLine() {
    let checkboxes = document.querySelectorAll('.lists-table__box:not(.lists-table__box-name) input:checked');
    let valuesArray = []; // Используйте массив объектов
    let values = [];
    for (let i = 0; i < checkboxes.length; i++) {
        values = checkboxes[i].value.split(', ');
        if (values[2] !== 'Отправлено') {
            let values = {}; // Создайте новый объект значений для каждого чекбокса
            values['check_' + i] = [checkboxes[i].value]; // Задаем значение поля
            valuesArray.push(values); // Добавьте объект значений в массив
        }
    }
    var cadel = 0
    try {
        if (valuesArray.length > 0) {
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "/emailCount/removeLine/", true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify(valuesArray)); // Отправьте массив значений
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    location.reload();
                } else {
                    if (cadel < 1) {
                        alert("Не получилось удалить рассылки. Убедитесь, что в рассылках нет компаний.");
                        cadel = 1;
                    }
                }
            }
        } else {
            alert("Удаление запрещено")
        }
    } catch {
        alert("Не получилось удалить рассылки. Убедитесь, что в рассылках нет компаний.");
    }
}

function createLetters(type_letter) {
    let checkboxes = document.querySelectorAll('.lists-table__box:not(.lists-table__box-name) input:checked');
    let value;
    if (checkboxes.length > 1) {
        alert("Необходимо выбрать только одну рассылку")
    } else {
        if (checkboxes.length === 0) {
            alert("Необходимо выбрать хотя бы одну рассылку")
        } else {
            value = checkboxes[0].value.split(', ');
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "/emailCount/createLetters/", true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            let tmp_json = JSON.stringify(type_letter + "; " + value[0]);
            xhr.send(tmp_json); // Отправьте массив значений
            xhr.responseType = "blob";
            xhr.onreadystatechange = function () {
                xhr.onload = function () {
                    if (xhr.status === 200) {
                        var fileName = "Письма " + type_letter + ' ' + value[1] + ".zip"; // Задайте имя файла для скачивания
                        var a = document.createElement("a");
                        a.href = window.URL.createObjectURL(xhr.response);
                        a.download = fileName;
                        a.style.display = "none";
                        document.body.appendChild(a);
                        a.click();
                        a.remove();
                    } else {
                        alert("не получилось создать ")
                    }
                }
            };
        }
    }
}

function extract() {
    var source = document.getElementById("CadastrNum");
    var cadastralNumber = source.textContent;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/extract/", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(cadastralNumber)); // Отправить json
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

function changeStatus() {
    let checkboxes = document.querySelectorAll('.lists-table__box:not(.lists-table__box-name) input:checked');
    let value;
    if (checkboxes.length > 1) {
        alert("Необходимо выбрать только одну рассылку")
    } else {
        if (checkboxes.length === 0) {
            alert("Необходимо выбрать хотя бы одну рассылку")
        } else {
            value = checkboxes[0].value.split(', ');
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "/emailCount/changeStatus/", true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            let tmp_json = JSON.stringify(value[0]);
            xhr.send(tmp_json); // Отправьте массив значений
            xhr.responseType = "blob";
            xhr.onreadystatechange = function () {
                xhr.onload = function () {
                    if (xhr.status === 200) {
                        location.reload();
                    } else {
                        alert("не получилось создать ")
                    }
                }
            };
        }
    }
}