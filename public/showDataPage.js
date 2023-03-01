const showDataPage = (data) => {
    const body = document.querySelector('body');
    const showDataPage = document.createElement('div');
    showDataPage.classList.add('show-data-page');
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
    //header
    const showHeader = document.createElement('div');
    showHeader.classList.add('show-header');
    showHeader.innerHTML = `
        <div>
            <p>
                <span>Invoice Number</span>
                <span>${data.response.header['Invoice Number']}</span>
            </p>
            <p>
                <span>Vendor</span>
                <span>${data.response.header['Vendor']}</span>
            </p>
            <p>
                <span>Phone</span>
                <span>${data.response.header['Phone']}</span>
            </p>
            <p>
                <span>Fax</span>
                <span>${data.response.header['Fax']}</span>
            </p>
            <p>
                <span>Insurance</span>
                <span>${data.response.header['Insurance']}</span>
            </p>
            <p>
                <span>Claim Number</span>
                <span>${data.response.header['Claim Number']}</span>
            </p>
        </div>
        <div>
            <p>
                <span>Invoice Date</span>
                <span>${data.response.header['Invoice Date']}</span>
            </p>
            <p>
                <span>RO Number</span>
                <span>${data.response.header['RO Number']}</span>
            </p>
            <p>
                <span>Discount %</span>
                <span>${data.response.header['Discount %']}</span>
            </p>
            <p>
                <span>Payment Type</span>
                <span>${data.response.header['Payment Type']}</span>
            </p>
            <p>
                <span> Check/Auth. Number</span>
                <span>${data.response.header['Check/Auth. Number']}</span>
            </p>
        </div>
    `;
    //body
    const showBody = document.createElement('div');
    showBody.classList.add('show-body');
    showBody.innerHTML = `
        <table>
            <tr>
                <th>Line</th>
                <th>Part Number</th>
                <th>Part Type</th>
                <th>RO List $</th>
                <th>RO Sales $</th>
                <th>Received</th>
                <th>Invoice</th>
                <th>Unit Cost</th>
                <th>Discount</th>
                <th>Extended</th>
            </tr>
            <tr class='table-second-header'>
                <th colspan='6'>Qty</th>
                <th>List $</th>
                <th>$</th>
                <th>%</th>
                <th>Cost $</th>
            </tr>
            ${data.response.body.map((item, index) => { 
                return `
                    <tr>
                        <td>${item['Line']}</td>
                        <td colspan='9'>${item['Description']}</td>
                    </tr>
                    <tr class='table-second-body'>
                        <td></td>
                        <td>${item['Part Number']}</td>
                        <td>${item['Part Type']}</td>
                        <td class='text-right'>${item['RO List $']}</td>
                        <td class='text-right'>${item['RO Sales $']}</td>
                        <td class='text-right'>${item['Received Qty']}</td>
                        <td class='text-right'>${item['Invoice List $']}</td>
                        <td class='text-right'>${item['Unit Cost $']}</td>
                        <td class='text-right'>${item['Discount %']}</td>
                        <td class='text-right'>${item['Extended Cost $']}</td>
                    </tr>
                `;
            })}
        </table>
    `;
    //footer 
    const showFooter = document.createElement('div');
    showFooter.classList.add('show-footer');
    showFooter.innerHTML = `
        <div>
            <p>
                <span>Received Items</span>
            </p>
            <p>
                <span>Subtotal</span>
            </p>
            <p>
                <span>Tax</span>
            </p>
            <p>
                <span>Freight</span>
            </p>
            <p>
                <span>Grand Total</span>
            </p>
        </div>
        <div>
            <p>
                <span>${data.response.footer['Received Items']}</span>
            </p>
        </div>
        <div>
            <p></p>
            </br>
            <p>
                <span>${data.response.footer['Subtotal']}</span>
            </p>
            <p>
                <span>${data.response.footer['Tax']}</span>
            </p>
            <p>
                <span>${data.response.footer['Freight']}</span>
            </p>
            <p>
                <span>$${data.response.footer['Grand Total']}</span>
            </p>
        </div>
    `;
    showData.appendChild(showHeader);
    showData.appendChild(showBody);
    showData.appendChild(showFooter);
    //append 
    container.appendChild(showPdfFile);
    container.appendChild(showData);
    showDataPage.appendChild(container);
    body.appendChild(showDataPage);
};

export default showDataPage;