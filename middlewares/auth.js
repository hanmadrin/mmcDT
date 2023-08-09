
const ExpressError = require("../utilities/expressError");
const jwt = require('jsonwebtoken');
module.exports.isLoggedIn = (req, res, next) => { 
    if (!req.cookies.username) {
        next(new ExpressError(401, "You must be logged in"));
    }
    const token = req.cookies.username;
    try{
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user_id = decoded.id;
        
        // req.user = decoded;
    }catch(err){
        // console.log(err)
        next(new ExpressError(401, "You must be logged in"));
    }
    next(); 
};

module.exports.isBot = (req, res, next) => {
    const {deviceId, token} = req.body;
    if(!deviceId){
        next(new ExpressError(401, {
            action: 'settingError',
            message: 'Device id is required',
        }))
    }
    if(!token){
        next(new ExpressError(401, {
            action: 'settingError',
            message: 'Token is required',
        }));
    }
    try{
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.company_code = decoded.company_code;
        if(req.company_code!==deviceId){
            next(new ExpressError(401, {
                action: 'settingError',
                message: 'Invalid device id',
            }));
        }
    }catch(err){
        next(new ExpressError(401, {
            action: 'settingError',
            message: 'Invalid token',
        }));
    }
    
    next();
};