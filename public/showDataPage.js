const showDataPage = (data) => {
    const body = document.querySelector('body');
    const showDataPage = document.createElement('div');
    showDataPage.classList.add('show-data-page');
    const showDataContent = document.createElement('div');
    showDataContent.classList.add('show-data-content');
    //header
    const showHeader = document.createElement('div');
    showHeader.classList.add('show-header');
    showHeader.innerHTML = `
        <div>
            <p>
                <span>Invoice Number</span> -
                <span class='api-data'>${data.response.header['Invoice Number']}</span>
            </p>
            <p>
                <span>Vendor</span> -
                <span class='api-data'>${data.response.header['Vendor']}</span>
            </p>
            <p>
                <span>Phone</span> -
                <span class='api-data'>${data.response.header['Phone']}</span>
            </p>
            <p>
                <span>Fax</span> -
                <span class='api-data'>${data.response.header['Fax']}</span>
            </p>
            <p>
                <span>Insurance</span> -
                <span class='api-data'>${data.response.header['Insurance']}</span>
            </p>
            <p>
                <span>Claim Number</span> -
                <span class='api-data'>${data.response.header['Claim Number']}</span>
            </p>
        </div>
        <div>
            <p>
                <span>Invoice Date</span> -
                <span class='api-data'>${data.response.header['Invoice Date']}</span>
            </p>
            <p>
                <span>RO Number</span> -
                <span class='api-data'>${data.response.header['RO Number']}</span>
            </p>
            <p>
                <span>Discount %</span> -
                <span class='api-data'>${data.response.header['Discount %']}</span>
            </p> class='api-data'
            <p>
                <span>Payment Type</span> -
                <span class='api-data'>${data.response.header['Payment Type']}</span>
            </p>
            <p>
                <span> Check/Auth. Number</span> -
                <span class='api-data'>${data.response.header['Check/Auth. Number']}</span>
            </p>
        </div>
    `;
    //body
    const showBody = document.createElement('div');
    showBody.classList.add('show-body');
    showBody.innerHTML = `<table>
            <tr class='border-bottom'>
                <th>Line</th>
                <th>Part Number</th>
                <th>Part Type</th>
                <th>RO List $</th>
                <th>RO Sales $</th>
                <th>Received Qty</th>
                <th>Invoice List $</th>
                <th>Unit Cost $</th>
                <th>Discount %</th>
                <th>Extended Cost $</th>
            </tr>
            ${data.response.body.map((item, index) => { 
                return `
                    <tr>
                        <td>${item['Line']}</td>
                        <td colspan='9'>${item['Description']}</td>
                    </tr>
                    <tr class='table-second-body border-bottom'>
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
                <span>Received Items</span> -
                <span class='api-data'>${data.response.footer['Received Items']}</span>
            </p>
            <p>
                <span>Subtotal</span> -
                <span class='api-data'>${data.response.footer['Subtotal']}</span>
            </p>
            <p>
                <span>Tax</span> -
                <span class='api-data'>${data.response.footer['Tax']}</span>
            </p>
            <p>
                <span>Freight</span> -
                <span class='api-data'>${data.response.footer['Freight']}</span>
            </p>
            <p>
                <span>Grand Total</span> -
                <span class='api-data'>$${data.response.footer['Grand Total']}</span>
            </p>
        </div>
    `;
    showDataContent.appendChild(showHeader);
    showDataContent.appendChild(showBody);
    showDataContent.appendChild(showFooter);
    showDataPage.appendChild(showDataContent);
    body.appendChild(showDataPage);
};

export default showDataPage;