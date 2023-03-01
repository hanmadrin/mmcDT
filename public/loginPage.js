import uploadPdfPage from './uploadPdfPage.js';
const loginPage = () => {
    const body = document.querySelector('body');
    const loginPage = document.createElement('div');
    loginPage.classList.add('login-page');
    const loginForm = document.createElement('form');
    loginForm.classList.add('login-form');
    const loginFormTitle = document.createElement('h1');
    loginFormTitle.classList.add('login-form-title');
    loginFormTitle.innerText = 'Login';
    const loginFormInput = document.createElement('input');
    loginFormInput.classList.add('login-form-input');
    loginFormInput.setAttribute('type', 'text');
    loginFormInput.setAttribute('placeholder', 'Username');
    const loginFormPassword = document.createElement('input');
    loginFormPassword.classList.add('login-form-input');
    loginFormPassword.setAttribute('type', 'password');
    loginFormPassword.setAttribute('placeholder', 'Password');
    const loginFormButton = document.createElement('button');
    loginFormButton.classList.add('login-form-button');
    loginFormButton.setAttribute('type', 'button');
    const verifyLogin = () => {
        body.removeChild(loginPage);
        uploadPdfPage();        
    };
    loginFormButton.addEventListener('click', verifyLogin);
    loginFormButton.innerText = 'Login';
    loginForm.appendChild(loginFormTitle);
    loginForm.appendChild(loginFormInput);
    loginForm.appendChild(loginFormPassword);
    loginForm.appendChild(loginFormButton);
    loginPage.appendChild(loginForm);
    body.appendChild(loginPage);
};

export default loginPage;