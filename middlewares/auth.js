const ExpressError = require("../utilities/expressError");

module.exports.isLoggedIn = (req, res, next) => { 
    if (!req.cookies.username) {
        throw new ExpressError(401, "You must be logged in");
    }
    next();
};