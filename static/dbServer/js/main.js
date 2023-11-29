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

// /*поиск*/
// const companies = [];

// fetch('../db/db.json').then(response => response.json()).then(data => {

//     data.forEach(item => {
//         companies.push(...item.companies);

//     });

// }).catch(err => console.error("failed", err));

// const search = document.querySelector('.header-input');
// const ul = document.querySelector('.list');
// function getOpt(word, companies) {

//     return companies.filter(company => {
//         const wordss = new RegExp(word, 'gi');

//         return company.name.match(wordss);
//     });
// }


// function dispOpt() {
//     const test = getOpt(this.value, companies);

//     const compName = test.map(name => {
//         return `<li>${name.name}</li>`;
//     }).join('');

//     ul.innerHTML = compName;
// }

// search.addEventListener('input', dispOpt);