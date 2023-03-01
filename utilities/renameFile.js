const fs = require('fs');
const ExpressError = require('./expressError');

module.exports.renameFile = (oldPath, newPath) => {
    fs.rename(oldPath, newPath, function (err) {
        if (err) throw new ExpressError(500, "Failed to rename file");
    });
}