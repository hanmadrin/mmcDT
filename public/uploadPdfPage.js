import showDataPage from './showDataPage.js';

const uploadPdfPage = () => {
    console.log('uploadPdfPage');
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
    const uploadPdfFormButton = document.createElement('button');
    uploadPdfFormButton.classList.add('upload-pdf-form-button');
    uploadPdfFormButton.setAttribute('type', 'button');
    const verifyUploadPdf = async () => {
        console.log("verifyUploadPdf");
        const formData = new FormData();
        formData.append('pdf', uploadPdfFormInput.files[0]);
        const response = await fetch('/api/parse-pdf', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        body.removeChild(uploadPdfPage);
        showDataPage(data);
    }
    uploadPdfFormButton.addEventListener('click', verifyUploadPdf);
    uploadPdfFormButton.innerText = 'Upload';
    uploadPdfForm.appendChild(uploadPdfFormTitle);
    uploadPdfForm.appendChild(uploadPdfFormInput);
    uploadPdfForm.appendChild(uploadPdfFormButton);
    uploadPdfPage.appendChild(uploadPdfForm);
    body.appendChild(uploadPdfPage);
};

export default uploadPdfPage;