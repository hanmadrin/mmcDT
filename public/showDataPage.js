import dashBoardPage from "./dashboardPage.js";
import { loaderCircle, notify, popup } from "./library.js";
import loginPage from "./loginPage.js";
import uploadPdfPage from "./uploadPdfPage.js";
const showDataPage = (data) => {
    const body = document.querySelector('#main');
    const showDataPage = document.createElement('div');
    showDataPage.classList.add('show-data-page');
    const logoutButton = document.createElement('button');
    logoutButton.classList.add('logout-button');
    logoutButton.innerText = 'Logout';
    const logout = async () => {
        const response = await fetch('/api/users/logout', {
            method: 'GET',
        });
        const data = await response.json();
        notify({ data: data.message, type: 'success' });
        body.removeChild(showDataPage);
        window.history.pushState({}, '', `/`);
        loginPage();
    };
    logoutButton.addEventListener('click', logout);
    const dashboardButton = document.createElement('button');
    dashboardButton.classList.add('dashboard-button');
    dashboardButton.innerText = 'Dashboard';
    dashboardButton.addEventListener('click', () => {
        body.removeChild(showDataPage);
        window.history.pushState({}, '', `/dashboard`);
        dashBoardPage();
    });
    const showDataContent = document.createElement('div');
    showDataContent.classList.add('show-data-content');
    const buttonDiv = document.createElement('div');
    buttonDiv.classList.add('sticky');
    const backButton = document.createElement('button');
    backButton.classList.add('back-button');
    backButton.innerText = 'Cancel';
    const backToUpload = () => {
        body.removeChild(showDataPage);
        uploadPdfPage();
    };
    backButton.addEventListener('click', backToUpload);
    const confirmButton = document.createElement('button');
    confirmButton.classList.add('confirm-button');
    confirmButton.innerText = 'Confirm';
    const confirmData = async () => {
        popup({
            state: true,
            content: loaderCircle({size: '50'}),
            options:{
                removeButton: false,
            }
        });
        const response = await fetch('/api/datas/save-pdf-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data.response)
        });
        const responseData = await response.json();
        popup({ state: false });
        if (response.status !== 200) {
            notify({ data: responseData, type: 'danger' })
            return;
        }
        notify({ data: 'Uploaded successfully', type: 'success' });
        body.removeChild(showDataPage);
        uploadPdfPage();
    };
    confirmButton.addEventListener('click', confirmData);
    buttonDiv.appendChild(backButton);
    buttonDiv.appendChild(confirmButton);
    //header
    const showHeader = document.createElement('div');
    showHeader.classList.add('show-header');
    Object.keys(data.response.header).forEach((item) => {
        const p = document.createElement('p');
        const span = document.createElement('span');
        span.innerText = `${item} - `;
        p.appendChild(span);
        const span2 = document.createElement('span');
        span2.innerText = data.response.header[item];
        span2.classList.add('api-data');
        p.appendChild(span2);
        showHeader.appendChild(p);
    });
    //body
    const showBody = document.createElement('div');
    showBody.classList.add('show-body');
    const table = document.createElement('table');
    const tr = document.createElement('tr');
    data.response.body.forEach((item, index) => {
        if (index > 0) return;
        Object.keys(item).forEach((key) => {
            const th = document.createElement('th');
            th.innerText = key;
            tr.appendChild(th);
        });
    });
    table.appendChild(tr);
    data.response.body.forEach((item) => {
        const dataTr = document.createElement('tr');
        Object.keys(item).forEach((key) => {
            const td = document.createElement('td');
            td.innerText = item[key];
            dataTr.appendChild(td);
        });
        table.appendChild(dataTr);
    })
    showBody.appendChild(table);
    //footer 
    const showFooter = document.createElement('div');
    showFooter.classList.add('show-footer');
    Object.keys(data.response.footer).forEach((item) => {
        const p = document.createElement('p');
        const span = document.createElement('span');
        span.innerText = `${item} - `;
        p.appendChild(span);
        const span2 = document.createElement('span');
        span2.innerText = data.response.footer[item];
        span2.classList.add('api-data');
        p.appendChild(span2);
        showFooter.appendChild(p);
    });
    showDataContent.appendChild(buttonDiv);
    showDataContent.appendChild(showHeader);
    showDataContent.appendChild(showBody);
    showDataContent.appendChild(showFooter);
    showDataPage.appendChild(showDataContent);
    showDataPage.appendChild(logoutButton);
    showDataPage.appendChild(dashboardButton);
    body.appendChild(showDataPage);
};

export default showDataPage;