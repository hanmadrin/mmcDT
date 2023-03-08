import loginPage from "./loginPage.js";
import uploadPdfPage from "./uploadPdfPage.js";
import { groundSetup } from "./library.js";
import dashBoardPage from "./dashboardPage.js";
groundSetup();
// window.history.pushState({}, '', `/account/${fb_id}`);
const view = async () => {
    const url = new URL(window.location.href);
    const path = url.pathname;
    if (path == '/') {
        await loginPage();
    } else {
        const response = await fetch('/api/users/is-logged-in', {
            method: 'GET',
        });
        const data = await response.json();
        if (data.username) {
            if (path == '/dashboard') {
                await dashBoardPage();
            } else if (path == '/upload') {
                await uploadPdfPage();
            }
        } else {
            window.history.pushState({}, '', `/`);
            await loginPage();
        }
    }
};
view();
