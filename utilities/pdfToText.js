const fs = require('fs');
const pdf = require('pdf-parse');
const ExpressError = require('./expressError');

module.exports.pdfToText = async (pdfPath) => {
    try {
        function render_page(pageData) {
            //check documents https://mozilla.github.io/pdf.js/
            let render_options = {
                //replaces all occurrences of whitespace with standard spaces (0x20). The default value is `false`.
                normalizeWhitespace: true,
                //do not attempt to combine same line TextItem's. The default value is `false`.
                disableCombineTextItems: true
            }
            let count = 0;
            return pageData.getTextContent(render_options)
                .then(function (textContent) {
                    let lastY, text = '';
                    for (let item of textContent.items) {

                        // if(count<=1){
                        //     console.log(item.transform);
                        //     done = true;
                        // }
                        count++;
                        if (lastY == item.transform[5]) {
                            text += "@@@" + item.str;
                        }
                        else {
                            text += '\n' + item.str;
                        }
                        lastY = item.transform[5];
                    }
                    return text;
                });
        }

        let options = {
            pagerender: render_page
        }

        let dataBuffer = fs.readFileSync(pdfPath);

        const data = await pdf(dataBuffer, options);


        let fileData = data.text;
        fs.writeFile('test.txt', fileData, (err) => {
            if (err) throw err;
            console.log('The file has been saved!');
        });
        fileData = fileData.replace(/(\d{1,2}\/\d{1,2}\/\d{4}\s\d{1,2}:\d{1,2}:\d{1,2}\s[A|P]M)@@@Page\s\d{1,2}\n\n\nMATTHEWS MOTOR COMPANY\n/g,'');
        const header = (() => {
            const headerContentStructure = [
                {
                    "name": "Invoice Number",//numbers
                    "regex": /Invoice Number\s*:@@@(\d+)/,
                },
                {
                    "name": "Invoice Date",//date 1/31/2023 or 01/31/2023
                    "regex": /Invoice Date\s*:@@@(\d{1,2}\/\d{1,2}\/\d{4})/,
                },
                {
                    "name": "Vendor",// 
                    "regex": /Vendor\s*:@@@([A-z,\s]+)@@@/,
                },
                {
                    "name": "RO Number",//numbers
                    "regex": /RO Number\s*:@@@(\d+)/,
                },
                {
                    "name": "Discount %",//float
                    "regex": /Discount %\s*:@@@(\d+\.\d+)/,
                },
                {
                    "name": "Phone",//(877) 898-1263
                    "regex": /Phone\s*:@@@(\(\d{3}\)\s\d{3}-\d{4})/,
                },
                {
                    "name": "Fax",
                    "regex": /Fax\s*:@@@(\(\d{3}\)\s\d{3}-\d{4})/,
                },
                {
                    "name": "Insurance",
                    "regex": /Insurance\s*:@@@([A-z,\s]+)\n/,
                },
                {
                    "name": "Claim Number",//untill line end
                    "regex": /Claim Number\s*:@@@(.+)/,
                }
            ];
            // get values
            const headerValues = headerContentStructure.map((header) => {
                const match = fileData.match(header.regex);
                if (match) {
                    return match[1];
                }
                return null;
            });
            // create object
            const headerObject = {};
            headerContentStructure.forEach((header, index) => {
                headerObject[header.name] = headerValues[index];
            });
            return headerObject;
        })();

        const body = (()=>{
            // find body lines
            //         17   Bumper w/o Iron Man pkg w/fog lamps
            // 86510J9000    OEM    275.38    275.38    1    275.38    232.55    15.6    232.55
            // regex
            const bodyLineRegex = /([\d-]){1,3}[\s@]{2,4}([A-z\s,/()"'.0-9\&-]{4,})\n([~\w]+)(([@\s]{2,4})|\n)([\w\s]+)[@\s]{2,4}([\d,.]+)[@\s]{2,4}[-\d.,]+[@\s]{2,4}([\d,.]+)[@\s]{2,4}([\d,.]+)[@\s]{2,4}([\d,.]+)[@\s]{2,4}([\d,.-]+)[@\s]{2,4}([\d,.]+)\n/g;
            const bodyLines = fileData.match(bodyLineRegex);
            // create body object
            // console.log(bodyLines.length)
            if(!bodyLines){
                throw new ExpressError(400, `Program was unable to read body lines.`);
            }
            const bodyObject = [];
            bodyLines.forEach((line)=>{
                // console.log(line);
                line = line.trim();
                let firstLine='', secondLine='';
                const splitLines = line.split('\n');
                // console.log(splitLines)
                const splitLinesLength = splitLines.length;
                if(splitLinesLength>2){
                    firstLine = splitLines[0];
                    for(let i=1;i<splitLinesLength;i++){
                        if(i==splitLinesLength-1){
                            secondLine+= '   ';
                            secondLine+=splitLines[i];
                        }else{
                            secondLine+=splitLines[i];
                        }
                    }
                }else{
                    firstLine = splitLines[0];
                    secondLine = splitLines[1];
                }
                const result = {};
                console.log(firstLine)
                result['Line'] = firstLine.match(/([\d-]){1,3}/)[0];
                firstLine = firstLine.replace(/([\d-]){1,3}/,'').trim();
                result['Description'] = firstLine.match(/([A-z\s,/()"'.0-9\&-]{4,})/)[0].trim();
                result['Description'] = result['Description'].replace(/--/g,'').trim();
                // replace "    " with "@@@" to split
                secondLine = secondLine.replace(/\s{2,4}/g,'@@@');
                const metas = secondLine.split('@@@');
                result['Part Number'] = metas[0];
                result['Part Type'] = metas[1];
                result['RO List $'] = metas[2];
                result['RO Sales $'] = metas[3];
                result['Received Qty'] = metas[4];
                result['Invoice List $'] = metas[5];
                result['Unit Cost $'] = metas[6];
                result['Discount %'] = metas[7];
                result['Extended Cost $'] = metas[8];
                bodyObject.push(result);
            });
            return bodyObject;
        })();

        const footer = (() => {
            const footerContentStructure = [
                {
                    "name": "Received Items",//float
                    "regex": /Received Items\s*:@@@\$*([\d,.]+)/,
                },
                {
                    "name": "Subtotal",//float
                    "regex": /Subtotal\s*:@@@\$*([\d,.]+)/,
                },
                {
                    "name": "Tax",//float
                    "regex": /Tax\s*:@@@\$*([\d,.]+)/,
                },
                {
                    "name": "Freight",//float
                    "regex": /Freight\s*:@@@\$*([\d,.]+)/,
                },
                {
                    "name": "Grand Total",//float
                    "regex": /Grand Total\s*:@@@\$*([\d,.]+)/,
                }
            ];
            // get values
            const footerValues = footerContentStructure.map((footer) => {
                const match = fileData.match(footer.regex);
                if (match) {
                    return match[1];
                }
                return null;
            });
            // create object
            const footerObject = {};
            footerContentStructure.forEach((footer, index) => {
                footerObject[footer.name] = footerValues[index];
            });
            return footerObject;

        })();
        // console.log(body);
        const jsonData = {
            header,
            body,
            footer
        };
        let parsedRecievedQuantity = 0;
        for(let i=0;i<body.length;i++){
            parsedRecievedQuantity += parseInt(body[i]["Received Qty"]);
        }
        if(parseInt(footer["Received Items"])!=parsedRecievedQuantity){
            throw new ExpressError(400, `Received Items(${footer["Received Items"]}) does not match with body lines(${isNaN(parsedRecievedQuantity)?0:parsedRecievedQuantity})`);
        }
        return jsonData;
        // file content generate
        // const csvFileContent = (()=>{
        //     let data = "";
        //     const header = jsonData.header;
        //     const body = jsonData.body;
        //     const footer = jsonData.footer;
        //     // header
        //     Object.keys(header).forEach((key)=>{
        //         data += `${key},${header[key]}\n`;
        //     });
        //     // body
        //     data +=  Object.keys(body[0]).join(",")+'\n';
        //     body.forEach((line)=>{
        //         const lines = Object.values(line).map((value)=>{
        //             return `"${value}"`;
        //         });
        //         data += lines.join(",")+'\n';
        //     });
        //     // footer
        //     Object.keys(footer).forEach((key)=>{
        //         data += `${key},"${footer[key]}"\n`;
        //     });
        //     return data;
        // })();
        // fs.writeFile('test.csv', csvFileContent, (err) => {
        //     if (err) throw err;
        //     console.log('The file has been saved!');
        // });
        // fs.writeFile('test.json', JSON.stringify(jsonData), (err) => {
        //     if (err) throw err;
        //     console.log('The file has been saved!');
        // });

    } catch (e) {
        console.log(e)
        throw new ExpressError(400, e.message);
    }
};


