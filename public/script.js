import loginPage from "./loginPage.js";
import uploadPdfPage from "./uploadPdfPage.js";
if (!localStorage.getItem('currentPage')) localStorage.setItem('currentPage', '0');
if (localStorage.getItem('currentPage') == '0') {
    loginPage();
} else {
    uploadPdfPage();
}