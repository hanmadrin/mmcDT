import { loaderCircle, notify, popup } from "./library.js";
import loginPage from "./loginPage.js";
import uploadPdfPage from "./uploadPdfPage.js";

const fileFields = {
    file_name: 'File Name',
    time_string: 'Upload Time',
    username: 'Uploaded By',
    status: 'Status',
};

const statusCodes = {
    completed: 'success-chip',
    error: 'error-chip',
    processing: 'processing-chip',
    inQueue: 'in-queue-chip',
};

const filterFields = {
    page: 1,
    status: '',
    username: '',
    date: '',
    fileName: '',
};

const getFilesWithStatus = async (dashBoardDataList) => {
    popup({
        state: true,
        content: loaderCircle({ size: '50' }),
        options: {
            removeButton: false,
        }
    });
    const response =
        await fetch(`api/datas/get-files-with-status?page=${filterFields.page}&status=${filterFields.status}&username=${filterFields.username}&date=${filterFields.date}&fileName=${filterFields.fileName}`, {
            method: 'GET',
        });
    const data = await response.json();
    if (response.status !== 200) {
        notify({ data: data, type: 'danger' });
        return;
    }
    const oldStatusData = document.getElementById('status-data');
    if (oldStatusData) {
        dashBoardDataList.removeChild(oldStatusData);
    }
    const div = document.createElement('div');
    div.setAttribute('id', 'status-data');
    data.rows.forEach((file) => {
        const dashBoardData = document.createElement('div');
        dashBoardData.classList.add('dashboard-data');
        Object.keys(fileFields).forEach((key) => {
            const dashBoardDataField = document.createElement('p');
            if (key === 'username') {
                dashBoardDataField.innerText = file["User"][key];
            } else if (key === 'time_string') {
                const timeString = file[key];
                dashBoardDataField.innerText = new Date(parseInt(timeString)).toLocaleString();
            } else {
                if (key === 'status') {
                    if (file[key].length) {
                        file[key].forEach((status) => {
                            const span = document.createElement('span');
                            span.innerText = status;
                            span.classList.add(statusCodes[status]);
                            dashBoardDataField.appendChild(span);
                        });
                    }
                } else {
                    dashBoardDataField.innerText = file[key];
                }
            }
            dashBoardData.appendChild(dashBoardDataField);
        });
        div.appendChild(dashBoardData);
        // dashBoardDataList.appendChild(dashBoardData);
    });
    dashBoardDataList.appendChild(div);
    //pagination
    const oldPagination = document.getElementById('pagination');
    if (oldPagination) {
        dashBoardDataList.removeChild(oldPagination);
    }
    const pagination = document.createElement('div');
    pagination.setAttribute('id', 'pagination');
    pagination.classList.add('pagination');
    const paginationPrev = document.createElement('p');
    paginationPrev.classList.add('pagination-button');
    paginationPrev.innerText = 'Prev';
    if (filterFields.page > 1) {
        paginationPrev.addEventListener('click', () => {
            filterFields.page--;
            getFilesWithStatus(dashBoardDataList);
        });
    } else {
        paginationPrev.classList.add('disabled');
    }
    pagination.appendChild(paginationPrev);
    const paginationNext = document.createElement('p');
    paginationNext.classList.add('pagination-button');
    paginationNext.innerText = 'Next';
    if (filterFields.page < data.count / 10) {
        paginationNext.addEventListener('click', () => {
            filterFields.page++;
            getFilesWithStatus(dashBoardDataList);

        });
    } else {
        paginationNext.classList.add('disabled');
    }
    pagination.appendChild(paginationNext);
    dashBoardDataList.appendChild(pagination);
    popup({
        state: false,
    })
};

const renderStatus = (dashBoardStatus, dashBoardDataList) => {
    const handleStatusClick = async (status) => {
        if (filterFields.status === status) {
            filterFields.status = '';
        } else {
            filterFields.status = status;
        }
        renderStatus(dashBoardStatus, dashBoardDataList);
        filterFields.page = 1;
        getFilesWithStatus(dashBoardDataList);
    };
    dashBoardStatus.innerHTML = '';
    Object.keys(statusCodes).forEach((key) => {
        const dashBoardStatusField = document.createElement('p');
        if (filterFields.status === key) {
            dashBoardStatusField.classList.add(statusCodes[key]);
        } else {
            dashBoardStatusField.classList.add('disabled-chip');
        }
        dashBoardStatusField.innerText = key;
        dashBoardStatusField.addEventListener('click', () => handleStatusClick(key));
        dashBoardStatus.appendChild(dashBoardStatusField);
    });
}

const dashBoardPage = async () => {
    const body = document.querySelector('#main');
    const dashBoardPage = document.createElement('div');
    dashBoardPage.classList.add('dashboard-page');
    const logoutButton = document.createElement('button');
    logoutButton.classList.add('logout-button');
    logoutButton.innerText = 'Logout';
    const logout = async () => {
        const response = await fetch('/api/users/logout', {
            method: 'GET',
        });
        const data = await response.json();
        notify({ data: data.message, type: 'success' });
        body.removeChild(dashBoardPage);
        window.history.pushState({}, '', `/`);
        loginPage();
    };
    logoutButton.addEventListener('click', logout);
    const uploadButton = document.createElement('button');
    uploadButton.classList.add('upload-button');
    uploadButton.innerText = 'Upload';
    uploadButton.addEventListener('click', () => {
        body.removeChild(dashBoardPage);
        window.history.pushState({}, '', `/upload`);
        uploadPdfPage();
    });
    const dashBoardContent = document.createElement('div');
    dashBoardContent.classList.add('dashboard-content');
    const dashBoardHeader = document.createElement('div');
    dashBoardHeader.classList.add('dashboard-header');
    const dashBoardHeaderTitle = document.createElement('h1');
    dashBoardHeaderTitle.innerText = 'Dashboard';
    dashBoardHeader.appendChild(dashBoardHeaderTitle);
    dashBoardContent.appendChild(dashBoardHeader);
    const dashBoardBody = document.createElement('div');
    dashBoardBody.classList.add('dashboard-body');
    const dashBoardDataList = document.createElement('div');
    dashBoardDataList.classList.add('dashboard-data-list');
    const dashBoardData = document.createElement('div');
    Object.keys(fileFields).forEach((key) => {
        const dashBoardDataField = document.createElement('div');
        if (key === 'status') {
            dashBoardDataField.innerText = fileFields[key];
            dashBoardDataField.classList.add('status-header');
            const dashBoardStatus = document.createElement('div');
            renderStatus(dashBoardStatus, dashBoardDataList);
            dashBoardStatus.classList.add('dashboard-status-header');
            dashBoardDataField.appendChild(dashBoardStatus);
            dashBoardData.appendChild(dashBoardDataField);
        } else if (key === 'username') {
            dashBoardDataField.innerText = fileFields[key];
            dashBoardDataField.classList.add('search-header');
            const dashBoardSearch = document.createElement('input');
            dashBoardSearch.setAttribute('type', 'text');
            dashBoardSearch.setAttribute('placeholder', 'Search');
            dashBoardSearch.classList.add('dashboard-search');
            dashBoardSearch.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    filterFields.username = e.target.value;
                    filterFields.page = 1;
                    getFilesWithStatus(dashBoardDataList);
                }
            });
            dashBoardDataField.appendChild(dashBoardSearch);
            dashBoardData.appendChild(dashBoardDataField);
        } else if (key === 'time_string') {
            dashBoardDataField.innerText = fileFields[key];
            dashBoardDataField.classList.add('time-header');
            const datePicker = document.createElement('input');
            datePicker.setAttribute('type', 'date');
            datePicker.classList.add('date-picker');
            datePicker.addEventListener('change', (e) => {
                filterFields.date = e.target.value;
                filterFields.page = 1;
                getFilesWithStatus(dashBoardDataList);
            });
            dashBoardDataField.appendChild(datePicker);
            dashBoardData.appendChild(dashBoardDataField);
        } else {
            dashBoardDataField.innerText = fileFields[key];
            dashBoardDataField.classList.add('file-header');
            const dashBoardSearch = document.createElement('input');
            dashBoardSearch.setAttribute('type', 'text');
            dashBoardSearch.setAttribute('placeholder', 'Search');
            dashBoardSearch.classList.add('dashboard-search');
            dashBoardSearch.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    filterFields.fileName = e.target.value;
                    filterFields.page = 1;
                    getFilesWithStatus(dashBoardDataList);
                }
            });
            dashBoardDataField.appendChild(dashBoardSearch);
            dashBoardData.appendChild(dashBoardDataField);
        }
    });
    dashBoardData.classList.add('dashboard-data-header');
    dashBoardDataList.appendChild(dashBoardData);
    getFilesWithStatus(dashBoardDataList);
    dashBoardBody.appendChild(dashBoardDataList);
    dashBoardContent.appendChild(dashBoardBody);
    dashBoardPage.appendChild(dashBoardContent);
    dashBoardPage.appendChild(logoutButton);
    dashBoardPage.appendChild(uploadButton);
    body.appendChild(dashBoardPage);
};

export default dashBoardPage;