const showDataPage = (data) => {
    console.log(data);
    const body = document.querySelector('body');
    const showDataPage = document.createElement('div');
    showDataPage.classList.add('show-data-page');
    const showDataPageTitle = document.createElement('h1');
    showDataPageTitle.classList.add('show-data-page-title');
    showDataPageTitle.innerText = `Document's Data`;
    const container = document.createElement('div');
    container.classList.add('container');
    //show pdf file 
    const showPdfFile = document.createElement('embed');
    showPdfFile.classList.add('show-pdf-file');
    showPdfFile.setAttribute('src', `/${data.file}`);
    showPdfFile.setAttribute('width', '100%');
    showPdfFile.setAttribute('height', '100vh');
    showPdfFile.setAttribute('type', 'application/pdf');
    showPdfFile.setAttribute('scrolling', 'no');
    //show data
    const showData = document.createElement('div');
    showData.classList.add('show-data');
    const showDataTitle = document.createElement('h2');
    showDataTitle.classList.add('show-data-title');
    showDataTitle.innerText = 'Data';
    showData.appendChild(showDataTitle);
    //append 
    container.appendChild(showPdfFile);
    container.appendChild(showData);
    showDataPage.appendChild(showDataPageTitle);
    showDataPage.appendChild(container);
    body.appendChild(showDataPage);
};

export default showDataPage;