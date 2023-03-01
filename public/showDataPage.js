const showDataPage = (data) => {
    console.log(data);
    const body = document.querySelector('body');
    const showDataPage = document.createElement('div');
    showDataPage.classList.add('show-data-page');
    const showDataPageTitle = document.createElement('h1');
    showDataPageTitle.classList.add('show-data-page-title');
    showDataPageTitle.innerText = `Document's Data`;
    showDataPage.appendChild(showDataPageTitle);
    body.appendChild(showDataPage);
}

export default showDataPage;