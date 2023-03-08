import dashBoardPage from "./dashboardPage.js";
import { loaderCircle, notify, popup } from "./library.js";
import loginPage from "./loginPage.js";
import uploadPdfPage from "./uploadPdfPage.js";

const state = {
    data: {},
    type: ''
};

const status = {
    error: 'error',
    completed: 'completed',
    inQueue: null
};

const renderHeader = (data) => {
    const div = document.createElement('div');
    Object.keys(data.response.header).forEach((item) => {
        const p = document.createElement('p');
        const span = document.createElement('span');
        span.innerText = `${item} - `;
        p.appendChild(span);
        const span2 = document.createElement('span');
        span2.innerText = data.response.header[item];
        if (state.type === 'edit') {
            span2.setAttribute('contenteditable', 'true');
            span2.addEventListener('input', (e) => {
                span2.classList.add('highlight');
                state.data.response.header[item] = e.target.innerText;
            });
        }
        span2.classList.add('api-data');
        p.appendChild(span2);
        div.appendChild(p);
    });
    return div;
};

const renderTableRows = (data) => {
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
    data.response.body.forEach((item, index) => {
        const dataTr = document.createElement('tr');
        Object.keys(item).forEach((key) => {
            const td = document.createElement('td');
            if (key === 'status') {
                if (state.type === 'edit') {
                    //add dropdown for status
                    const td = document.createElement('td');
                    const select = document.createElement('select');
                    select.classList.add('status-select');
                    //get each key and value pair from status object
                    let isChanged = false;
                    for (const key in status) {
                        const option = document.createElement('option');
                        option.innerText = key;
                        option.value = key;
                        select.appendChild(option);
                        if (status[key] === data.response.body[index].status) {
                            isChanged = true;
                            option.setAttribute('selected', 'selected');
                        }
                    }
                    if (!isChanged) {
                        if (data.response.body[index].status === 'fileError') {
                            const option = document.createElement('option');
                            option.innerText = 'fileError';
                            option.value = 'fileError';
                            option.setAttribute('selected', 'selected');
                            select.appendChild(option);
                        } else {
                            const option = document.createElement('option');
                            option.innerText = 'processing';
                            option.value = 'processing';
                            option.setAttribute('selected', 'selected');
                            select.appendChild(option);
                        }
                    }
                    select.addEventListener('change', (e) => {
                        select.classList.add('highlight');
                        state.data.response.body[index].status = e.target.value;
                    });
                    td.appendChild(select);
                    dataTr.appendChild(td);
                }
            } else {
                td.innerText = item[key];
                if (state.type === 'edit') {
                    td.setAttribute('contenteditable', 'true');
                    td.addEventListener('input', (e) => {
                        td.classList.add('highlight');
                        state.data.response.body[index][key] = e.target.innerText;
                    });
                }
                dataTr.appendChild(td);
            }
        });
        table.appendChild(dataTr);
    });
    return table;
};

const renderFooter = (data) => {
    const div = document.createElement('div');
    Object.keys(data.response.footer).forEach((item) => {
        const p = document.createElement('p');
        const span = document.createElement('span');
        span.innerText = `${item} - `;
        p.appendChild(span);
        const span2 = document.createElement('span');
        span2.innerText = data.response.footer[item];
        if (state.type === 'edit') {
            span2.setAttribute('contenteditable', 'true');
            span2.addEventListener('input', (e) => {
                span2.classList.add('highlight');
                state.data.response.footer[item] = e.target.innerText;
            });
        }
        span2.classList.add('api-data');
        p.appendChild(span2);
        div.appendChild(p);
    });
    return div;
}


const showDataPopup = (data, type) => {
    state.data = data;
    state.type = type;
    // const body = document.querySelector('#main');
    const showDataPage = document.createElement('div');
    showDataPage.classList.add('show-data-popup');
    // const logoutButton = document.createElement('button');
    // logoutButton.classList.add('logout-button');
    // logoutButton.innerText = 'Logout';
    // const logout = async () => {
    //     const response = await fetch('/api/users/logout', {
    //         method: 'GET',
    //     });
    //     const data = await response.json();
    //     notify({ data: data.message, type: 'success' });
    //     // body.removeChild(showDataPage);
    //     window.history.pushState({}, '', `/`);
    //     loginPage();
    // };
    // logoutButton.addEventListener('click', logout);
    // const dashboardButton = document.createElement('button');
    // dashboardButton.classList.add('dashboard-button');
    // dashboardButton.innerText = 'Dashboard';
    // dashboardButton.addEventListener('click', () => {
    //     // body.removeChild(showDataPage);
    //     window.history.pushState({}, '', `/dashboard`);
    //     dashBoardPage();
    // });
    const showDataContent = document.createElement('div');
    showDataContent.classList.add('show-data-content');
    const buttonDiv = document.createElement('div');
    buttonDiv.classList.add('sticky');
    const backButton = document.createElement('button');
    backButton.classList.add('back-button');
    backButton.innerText = 'Cancel';
    const backToUpload = () => {
        // body.removeChild(showDataPage);
        if (type === 'edit') {
            popup({ state: false });
            window.history.pushState({}, '', `/dashboard`);
            dashBoardPage();
            return;
        } else {
            popup({ state: false });
            window.history.pushState({}, '', `/upload`);
            uploadPdfPage();
            return;
        }
    };
    backButton.addEventListener('click', backToUpload);
    const confirmButton = document.createElement('button');
    confirmButton.classList.add('confirm-button');
    confirmButton.innerText = 'Confirm';
    const confirmData = async () => {
        if (state.type == 'show') {
            popup({
                state: true,
                content: loaderCircle({ size: '50' }),
                options: {
                    removeButton: false,
                    backDropColor: 'rgba(0,0,0,0)',
                }
            });
            const response = await fetch('/api/datas/save-pdf-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(state.data.response)
            });
            const responseData = await response.json();
            popup({ state: false });
            if (response.status !== 200) {
                notify({ data: responseData, type: 'danger' })
                return;
            }
            notify({ data: 'Uploaded successfully', type: 'success' });
            // body.removeChild(showDataPage);
            uploadPdfPage();
            popup({ state: false });
        } else {
            // update-pdf-data
            console.log(state.data);
            popup({
                state: true,
                content: loaderCircle({ size: '50' }),
                options: {
                    removeButton: false,
                    backDropColor: 'rgba(0,0,0,0)',
                }
            });
            const response = await fetch(`/api/datas/update-pdf-data/${state.data.response.fileId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(state.data.response)
            });
            const responseData = await response.json();
            popup({ state: false });
            if (response.status !== 200) {
                notify({ data: responseData, type: 'danger' })
                return;
            }
            notify({ data: 'Uploaded successfully', type: 'success' });
            // body.removeChild(showDataPage);
            dashBoardPage();
            popup({ state: false });
        }
    };
    confirmButton.addEventListener('click', confirmData);
    buttonDiv.appendChild(backButton);
    buttonDiv.appendChild(confirmButton);
    //header
    const showHeader = document.createElement('div');
    showHeader.classList.add('show-header');
    showHeader.appendChild(renderHeader(data));
    //body
    const showBody = document.createElement('div');
    showBody.classList.add('show-body');
    showBody.appendChild(renderTableRows(data));
    //footer 
    const showFooter = document.createElement('div');
    showFooter.classList.add('show-footer');
    showFooter.appendChild(renderFooter(data));
    showDataContent.appendChild(buttonDiv);
    showDataContent.appendChild(showHeader);
    showDataContent.appendChild(showBody);
    showDataContent.appendChild(showFooter);
    showDataPage.appendChild(showDataContent);
    // showDataPage.appendChild(logoutButton);
    // showDataPage.appendChild(dashboardButton);
    return showDataPage;
    // body.appendChild(showDataPage);
};

export default showDataPopup;