import  loginPage  from './loginPage.js';
import  uploadPdfPage from './uploadPdfPage.js';
import  dashBoardPage  from './dashboardPage.js';
import { notify,loaderCircle,sleep } from './library.js';
import scrapingSwitchStatus from './scrapingSwitchState.js';
const menuBar = () => {
    const companyNameBlock = document.createElement('div');
    companyNameBlock.classList.add('company-name-block');
    // companyNameBlock.innerText = localStorage.getItem('companyName');
    companyNameBlock.addEventListener('click', () => {
        // body.removeChild(editDataPage);
        window.history.pushState({}, '', `/dashboard`);
        dashBoardPage();
    });
    // background image
    const logo = document.createElement('img');
    logo.src = '/public/logo.png';
    logo.classList = 'logo';
    const text = document.createElement('span');
    text.innerText = localStorage.getItem('companyName');
    text.classList = 'name';
    companyNameBlock.append(logo, text);

    const menuBarHolder = document.createElement('div');
    menuBarHolder.classList.add('menu-bar');
    const logoutButton = document.createElement('button');
    logoutButton.classList.add('logout-button');
    logoutButton.innerText = 'Logout';
    const logout = async () => {
        const response = await fetch('/api/users/logout', {
            method: 'GET',
        });
        const data = await response.json();
        notify({ data: data.message, type: 'success' });
        // body.removeChild(dashBoardPage);
        window.history.pushState({}, '', `/`);
        loginPage();
    };
    logoutButton.addEventListener('click', logout);
    const uploadButton = document.createElement('button');
    uploadButton.classList.add('upload-button');
    uploadButton.innerText = 'Upload';
    uploadButton.addEventListener('click', () => {
        // body.removeChild(dashBoardPage);
        window.history.pushState({}, '', `/upload`);
        uploadPdfPage();
    });
    const dashboardButton = document.createElement('button');
    dashboardButton.classList.add('dashboard-button');
    dashboardButton.innerText = 'Dashboard';
    dashboardButton.addEventListener('click', () => {
        // body.removeChild(editDataPage);
        window.history.pushState({}, '', `/dashboard`);
        dashBoardPage();
    });
    // slider
    const sliderLabel = document.createElement('label');
    sliderLabel.classList.add('switch');
    const sliderInput = document.createElement('input');
    sliderInput.type = 'checkbox';
    sliderInput.disabled = true;
    sliderInput.addEventListener('change', async() => {
        const extensionSwitch = sliderInput.checked;
        const response = await fetch('/api/datas/set-switch-status', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ extensionSwitch })
        });
        const data = await response.json();
        console.log(data.extensionToken)
        notify({ data: data.message, type: 'success' });
    });
    const sliderSpan = document.createElement('span');
    sliderSpan.classList.add('slider');
    const loaderHolder = document.createElement('div');
    loaderHolder.classList = "h-100p w-100p box-shadow-inset-5px bg-dark position-absolute top-50p left-50p transform-n-50p d-flex justify-content-center align-items-center";
    loaderHolder.append(loaderCircle({size: 25}));
    sliderLabel.append(sliderInput, sliderSpan , loaderHolder);
    // bubble false for loaderHolder


    (async ()=>{
        const extensionSwitch = await scrapingSwitchStatus();
        sliderInput.checked = extensionSwitch;
        sliderInput.disabled = false;
        loaderHolder.remove();
    })();


    menuBarHolder.append(companyNameBlock, sliderLabel,uploadButton, dashboardButton, logoutButton);


    

    return menuBarHolder;

}

export { menuBar };