const fs = require('fs');
const ExpressError = require('./expressError');

module.exports.deleteFile = (filePath) => {
    fs.stat(filePath, function (err, stats) {
        if (err) throw new ExpressError(404, "File not found");
        fs.unlink(filePath, function (err) {
            if (err) throw new ExpressError(500, "Failed to delete file");
        });
    });
};
