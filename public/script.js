import loginPage from "./loginPage.js";
import uploadPdfPage from "./uploadPdfPage.js";
import { groundSetup } from "./library.js";
groundSetup();
if (!localStorage.getItem('currentPage')) localStorage.setItem('currentPage', '0');
if (localStorage.getItem('currentPage') == '0') {
    loginPage();
} else {
    uploadPdfPage();
}
