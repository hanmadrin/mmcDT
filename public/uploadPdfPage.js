import showDataPopup from './showDataPopup.js';
import loginPage from './loginPage.js';
import { notify, popup, confirmationPopup, loaderCircle } from './library.js';
import dashBoardPage from './dashboardPage.js';
import { menuBar } from './menuBar.js';

const uploadPdfPage = () => {
    const main = document.querySelector('#main');
    const uploadPdfPage = document.createElement('div');
    uploadPdfPage.classList.add('upload-pdf-page');
    // const logoutButton = document.createElement('button');
    // logoutButton.classList.add('logout-button');
    // logoutButton.innerText = 'Logout';
    // const logout = async () => {
    //     const response = await fetch('/api/users/logout', {
    //         method: 'GET',
    //     });
    //     const data = await response.json();
    //     notify({ data: data.message, type: 'success' });
    //     // body.removeChild(uploadPdfPage);
    //     window.history.pushState({}, '', `/`);
    //     loginPage();
    // };
    // logoutButton.addEventListener('click', logout);
    // const dashboardButton = document.createElement('button');
    // dashboardButton.classList.add('dashboard-button');
    // dashboardButton.innerText = 'Dashboard';
    // dashboardButton.addEventListener('click', () => {
    //     // body.removeChild(uploadPdfPage);
    //     window.history.pushState({}, '', `/dashboard`);
    //     dashBoardPage();
    // });
    const uploadPdfForm = document.createElement('form');
    uploadPdfForm.classList.add('upload-pdf-form');
    const uploadPdfFormTitle = document.createElement('h1');
    uploadPdfFormTitle.classList.add('upload-pdf-form-title');
    uploadPdfFormTitle.innerText = 'Upload PDF';
    const uploadPdfFormInput = document.createElement('input');
    uploadPdfFormInput.classList.add('upload-pdf-form-input');
    uploadPdfFormInput.setAttribute('type', 'file');
    uploadPdfFormInput.setAttribute('accept', '.pdf');
    uploadPdfFormInput.setAttribute('id', 'upload');
    uploadPdfFormInput.setAttribute('hidden', 'true');
    const verifyUploadPdf = async () => {
        const formData = new FormData();
        formData.append('pdf', uploadPdfFormInput.files[0]);
        // name format verification
        // 8000000_UGR0981.pdf
        let name = uploadPdfFormInput.files[0].name;
        if (!name) {
            notify({ data: 'Select a file', type: 'danger' });
            return;
        }
        if(!name.endsWith('.pdf')){
            notify({ data: 'Invalid file type.', type: 'danger' });
            return;
        }
        name = name.replace('.pdf', '');
        const nameArray = name.split('_');
        if (nameArray.length != 3) {
            notify({ data: 'Invalid file name. There will be 3 data section', type: 'danger' });
            return;
        }
        const nameArray1 = nameArray[0].split('');
        if (nameArray1.length != 7) {
            notify({ data: 'Invalid file name', type: 'danger' });
            return;
        }
        // allowed characters A-Z,0-9. verify with regex by replacing
        // const nonAllowedCharacters = nameArray[1].replace(/[A-Z0-9]/g, '');
        // if (nonAllowedCharacters.length > 0) {
        //     notify({ data: 'Invalid file name', type: 'danger' });
        //     return;
        // }




        try {
            popup({
                state: true,
                content: loaderCircle({ size: '50' }),
                options: {
                    removeButton: false,
                    backDropColor: 'rgba(0, 0, 0, 0)',
                }
            });
            const responseData = await fetch(`/api/datas/is-pdf-exists/${uploadPdfFormInput.files[0].name}`, {
                method: 'GET',
            });
            const jsonData = await responseData.json();
            popup({ state: false });
            if (jsonData.isPdfExists) {
                popup({
                    state: true,
                    content: confirmationPopup({
                        title: 'This PDF is already uploaded',
                        message: 'Do you want to upload it again?',
                        callback: async () => {
                            popup({ state: false });
                            popup({
                                state: true,
                                content: loaderCircle({ size: '50' }),
                                options: {
                                    removeButton: false,
                                    backDropColor: 'rgba(0, 0, 0, 0)',
                                }
                            });
                            try {
                                const response = await fetch('/api/datas/parse-pdf', {
                                    method: 'POST',
                                    body: formData
                                });
                                const data = await response.json();
                                if (response.status === 401) {
                                    window.history.pushState({}, '', `/`);
                                    // body.removeChild(uploadPdfPage);
                                    loginPage();
                                } else if (response.status !== 200) {
                                    notify({ data, type: 'danger' })
                                    return;
                                }
                                // body.removeChild(uploadPdfPage);
                                popup({
                                    state: true,
                                    content: showDataPopup(data, 'show'),
                                    options: {
                                        removeButton: false,
                                        backDrop: false,
                                        backDropColor: 'rgba(0,0,0,0.75)',
                                    }
                                });

                            } catch (error) {
                                notify({ data: error, type: 'danger' });
                            } finally {
                                // popup({ state: false });
                            }
                        },
                        negativeCallBack: async () => {
                            popup({ state: false });
                            uploadPdfFormInput.value = '';
                        }
                    }),
                    options: {
                        backDrop: false,
                        removeButton: false,
                        backDropColor: 'rgba(0,0,0,0.75)',
                    }
                });
            } else {
                popup({
                    state: true,
                    content: loaderCircle({ size: '50' }),
                    options: {
                        removeButton: false,
                        backDropColor: 'rgba(0, 0, 0, 0)',
                    }
                });
                try {
                    const response = await fetch('/api/datas/parse-pdf', {
                        method: 'POST',
                        body: formData
                    });
                    const data = await response.json();
                    if (response.status === 401 ) {
                        window.history.pushState({}, '', `/`);
                        // body.removeChild(uploadPdfPage);
                        loginPage();
                    } else if (response.status !== 200) {
                        popup({ state: false });
                        notify({ data, type: 'danger' })
                        return;
                    }
                    popup({ state: false });
                    // body.removeChild(uploadPdfPage);
                    // showDataPage(data);
                    popup({
                        state: true,
                        content: showDataPopup(data, 'show'),
                        options: {
                            removeButton: false,
                            backDrop: false,
                            backDropColor: 'rgba(0,0,0,0.75)',
                        }
                    });
                } catch (error) {
                    notify({ data: error, type: 'danger' });
                } finally {
                }
            }
        } catch (error) {
            popup({ state: false });
            notify({ data: error, type: 'danger' });
        }
    };
    const uploadIcon = document.createElement('label');
    uploadIcon.classList.add('upload-label');
    uploadIcon.setAttribute('for', 'upload');
    uploadIcon.innerHTML = `
        <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" fill="#000000">
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
                <path d="M512 256l144.8 144.8-36.2 36.2-83-83v311.6h-51.2V354l-83 83-36.2-36.2L512 256zM307.2 716.8V768h409.6v-51.2H307.2z" fill="#000000" fill-rule="evenodd">
                </path>
            </g>
        </svg>
    `;
    const svg = uploadIcon.querySelector('svg');
    svg.classList.add('upload-icon');
    const uploadText = document.createElement('span');
    uploadText.innerText = 'Upload PDF';
    uploadIcon.appendChild(uploadText);
    uploadPdfFormInput.addEventListener('change', verifyUploadPdf);
    uploadPdfForm.appendChild(uploadPdfFormTitle);
    uploadPdfForm.appendChild(uploadPdfFormInput);
    uploadPdfForm.appendChild(uploadIcon);
    uploadPdfPage.appendChild(uploadPdfForm);
    // uploadPdfPage.appendChild(logoutButton);
    // uploadPdfPage.appendChild(dashboardButton);
    uploadPdfPage.appendChild(menuBar());
    main.replaceChildren(uploadPdfPage);
};

export default uploadPdfPage;