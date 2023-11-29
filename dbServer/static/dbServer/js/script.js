
// "use strict"
// document.addEventListener("DOMContentLoaded", () => {
//     const body = document.body;

//     /*табы*/
//     const tabs = document.querySelectorAll('.tabs-item');

//     function funcTabs(dataAttr, inner) {
//         tabs.forEach(tab => {
//             tab.addEventListener('click', () => {
//                 tabs.forEach(tab => {
//                     tab.classList.remove('tabs-item--active');
//                 });

//                 const dataTab = tab.getAttribute('data-tabs');

//                 document.querySelectorAll(inner).forEach(item => {
//                     item.classList.remove('active');
//                     const dataItem = item.getAttribute(dataAttr);
//                     if (dataItem == dataTab) {
//                         item.classList.add('active');
//                     }
//                 });

//                 tab.classList.add('tabs-item--active');
//             });
//         });
//     }

//     funcTabs('data-about', '.about-inner__item');
//     funcTabs('data-court', '.court-inner__item');

//     /*выбор всех чекбоксов*/
//     const checkAllAdd = document.getElementById('checkAllCompaniesAdd'),
//         checkAllRemove = document.getElementById('checkAllCompaniesRemove'),
//         checkCourtInputs = document.querySelectorAll('.court-table-main .lists-table__box:not(.lists-table__box-name) input'),
//         checkEmailInputs = document.querySelectorAll('.email-table-main .lists-table__box:not(.lists-table__box-name) input'),
//         checkMailInputs = document.querySelectorAll('.mail-table-main .lists-table__box:not(.lists-table__box-name) input'),
//         checkSmsInputs = document.querySelectorAll('.sms-table-main .lists-table__box:not(.lists-table__box-name) input'),
//         checkCompaniesRemove = document.querySelectorAll('.popup-right .lists-table__box:not(.lists-table__box-name) input'),
//         checkCompaniesAdd = document.querySelectorAll('.popup-left .lists-table__box:not(.lists-table__box-name) input'),
//         checkAllAddEmail = document.getElementById('checkAllAddEmail'),
//         checkAllAddSms = document.getElementById('checkAllAddSms'),
//         checkAllCourts = document.getElementById('checkAllCourt'),
//         checkAllMail = document.getElementById('checkAllMail'),
//         popupBtns = document.querySelectorAll('.popup-btn');

//     function checkAllInputs(btnAll, inputs, selector) {
//         if (btnAll) {
//             for (let check = 0; check < inputs.length; check++) {
//                 inputs[check].addEventListener("click", function () {
//                     let inputsChecked = document.querySelectorAll(selector).length;
//                     if (inputsChecked < inputs.length) {
//                         btnAll.indeterminate = true;
//                     }
//                 });
//             }

//             btnAll.addEventListener("click", function () {
//                 for (let check = 0; check < inputs.length; check++) {
//                     inputs[check].checked = btnAll.checked;
//                 }
//             });
//         }
//     }

//     /*добавить/удалить все компании из таблицы*/
//     checkAllInputs(checkAllAddEmail, checkEmailInputs, '.email-table-main .lists-table__box-check input:checked');
//     checkAllInputs(checkAllCourts, checkCourtInputs, '.court-table-main .lists-table__box:not(.lists-table__box-name) input:checked');
//     checkAllInputs(checkAllAddSms, checkSmsInputs, '.sms-table-main .lists-table__box:not(.lists-table__box-name) input:checked');
//     checkAllInputs(checkAllMail, checkMailInputs, '.mail-table-main .lists-table__box:not(.lists-table__box-name) input:checked');

//     /*добавить/удалить все компании из рассылки в поп-ап*/
//     checkAllInputs(checkAllRemove, checkCompaniesRemove, '.popup-right .lists-table__box:not(.lists-table__box-name) input:checked');
//     checkAllInputs(checkAllAdd, checkCompaniesAdd, '.popup-left .lists-table__box:not(.lists-table__box-name) input:checked');

//     /*popup*/
//     if (popupBtns) {
//         popupBtns.forEach(btn => {
//             btn.addEventListener('click', () => body.classList.add('active'));
//         });

//         document.addEventListener('click', (e) => {
//             if (!e.target.closest('.popup-btn') && !e.target.closest('.popup') || e.target.closest('.popup>span')) {
//                 body.classList.remove('active');
//             }
//         });
//     }
//     /*show or hide column*/
//     const filter = document.querySelector('.filter-col');
//     const colCheck = document.querySelectorAll('.filter-col__li input');
//     const colItems = document.querySelectorAll('.lists-table__col[data-col]');

//     if (filter) {
//         filter.addEventListener('click', () => {
//             filter.classList.add('active');
//         });
//     }

//     colCheck.forEach(item => {
//         item.addEventListener('input', () => {
//             let colId = item.getAttribute("id");
//             colItems.forEach(col => {
//                 let dataCol = col.getAttribute('data-col');
//                 if (item.checked == false && dataCol == colId) {
//                     col.style.display = "none";
//                 }
//                 if (item.checked == true && dataCol == colId) {
//                     col.style.display = "block";
//                 }
//             });
//             filter.classList.remove('active');
//             updateTable();
//         });
//     });
//     function removeClassActive(e) {
//         if (!e.target.closest('.filter-col')) {
//             filter.classList.remove('active');
//         }
//     }
//     document.addEventListener('click', removeClassActive);

//     /*move columns*/
//     const table = document.querySelector('#table');
//     let droppedItem = null;
//     let draggedItem = null;

//     colItems.forEach(col => {
//         col.setAttribute("draggable", "true");
//         col.addEventListener("dragstart", dragstart);
//         col.addEventListener("dragenter", dragenter);
//         col.addEventListener("dragover", (e) => e.preventDefault());
//         col.addEventListener("drop", drop);
//         col.addEventListener("dragend", dragend);
//     });

//     function dragstart() {
//         draggedItem = this;
//     }

//     function dragend() {
//         colItems.forEach(col => col.classList.remove('active'));
//         draggedItem = null;
//     }

//     function dragenter(e) {
//         e.preventDefault();

//         if (draggedItem !== droppedItem) {
//             droppedItem = this;
//         }

//         colItems.forEach(col => col.classList.add('active'));
//         this.classList.remove('active');
//     }

//     function drop(e) {
//         e.stopPropagation();
//         if (droppedItem) {

//             let array = Array.from(droppedItem.parentElement.children);

//             let indexdraggedItem = array.indexOf(draggedItem);
//             let indexdroppedItem = array.indexOf(this);

//             if (indexdraggedItem > indexdroppedItem) {
//                 table.insertBefore(draggedItem, this);
//             } else {
//                 table.insertBefore(draggedItem, this.nextElementSibling);
//             }
//             updateTable();
//         }
//     }

//     /*resize columns*/
//     function updateTable() {
//         $('#table').colResizable({ disable: true });

//         resizeCol();
//     }

//     function resizeCol() {
//         $("#table").colResizable({
//             minWidth: 50,
//             liveDrag: true,
//         });
//     }
//     resizeCol();

//     /*поиск*/

//     // fetch('../db/db.json').then(response => response.json()).then(data => {
//     // const companies = [];
//     // const ul = document.querySelector('.list');
//     //     const search = document.querySelector('.popup input');

//     //     data.forEach(item => {
//     //         companies.push(...item.companies);
//     //     });

//     //     function getOpt(word, companies) {

//     //         return companies.filter(company => {
//     //             const wordss = new RegExp(word, 'gi');

//     //             return company.name.match(wordss);
//     //         });
//     //     }

//     //     function dispOpt() {
//     //         const test = getOpt(this.value, companies);

//     //         let compName = test.map(name => {

//     //             return `<li>${name.name}</li>`;
//     //         }).join('');


//     //         ul.innerHTML = compName;
//     //     }

//     //     search.addEventListener('input', dispOpt);

//     // }).catch(err => console.error("failed", err));
// });

// function objects(id_cadastr, id_companys){
//     var xhr = new XMLHttpRequest();
//     xhr.open("POST", "http://127.0.0.1:8000/infoAboutObj/", true);
//     xhr.setRequestHeader('Content-Type', 'application/json');
//     var value ={
//         "id_cadastr": id_cadastr,
//         "id_companys":id_companys
//     }
//     xhr.send(JSON.stringify(value));

//     xhr.onreadystatechange = function() {
//     if (xhr.readyState === 4 && xhr.status === 200) {
//         var mas = xhr.responseText;

//         var jsonResponse = JSON.parse(mas);
//         jsonResponse = JSON.parse(jsonResponse);

//         var header = document.getElementById("CadastrNum");
//         header.textContent = jsonResponse["cadastral_number"];

//        header = document.getElementById("ObjView");
//         header.textContent = jsonResponse["object_type"];

//         header = document.getElementById("TypeRight");
//         header.textContent = jsonResponse["type_right"];

//         header = document.getElementById("NumRight");
//         header.textContent = jsonResponse["number_right"];

//         header = document.getElementById("FIO");
//         header.textContent = jsonResponse[ "company_name"];

//         header = document.getElementById("NameHolder");
//         header.textContent = jsonResponse[ "link_statement"];
//     }
// }
// }
