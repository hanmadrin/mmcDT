import showDataPage from './showDataPage.js';
import loginPage from './loginPage.js';
import { notify,popup,confirmationPopup } from './library.js';

const uploadPdfPage = () => {
    popup({
       state: true,
       content: confirmationPopup({
        title: 'Upload PDF',
        message: 'Upload a PDF file to parse data from it',
        callback: ()=>{
            console.log('ashik lol')
            popup({state:false});
        },
       }),
       options:{
        backDrop: true,
        removeButton: true,
        backDropColor: 'rgba(0,0,0,0.75)',
       }
    })
    const body = document.querySelector('body');
    const uploadPdfPage = document.createElement('div');
    uploadPdfPage.classList.add('upload-pdf-page');
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
        const response = await fetch('/api/datas/parse-pdf', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        if (response.status === 401) {
            localStorage.setItem('currentPage', '0');
            body.removeChild(uploadPdfPage);
            loginPage();
        } else if (response.status !== 200) {
            notify({ data, type: 'danger' })
            return;
        }
        body.removeChild(uploadPdfPage);
        showDataPage(data);
    }
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
    body.appendChild(uploadPdfPage);
};

export default uploadPdfPage;