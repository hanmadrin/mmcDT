const fs = require('fs');
const ExpressError = require('../utilities/expressError');
const { pdfToText } = require('../utilities/pdfToText');
const { renameFile } = require('../utilities/renameFile');

module.exports.parsePdf = async (req, res, next) => {
    // create uploads folder if it doesn't exist
    if (!fs.existsSync('./public/uploads')) {
        fs.mkdirSync('./public/uploads');
    }
    try {
        const response = await pdfToText(req.file.path);
        if (response.error) {
            throw new ExpressError(400, response.error);
        }
        renameFile(`./${req.file.path}`, `./${req.file.path}.pdf`);
        res.json({
            file: `${req.file.path.replace('public/', '')}.pdf`,
            response
        });
    } catch (err) {
        next(err);
    }
};