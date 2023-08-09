const { User,Company } = require("../models");
const jwt = require('jsonwebtoken');
const ExpressError = require("../utilities/expressError");

module.exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        if (!username || !password)
            throw new ExpressError(400, "Username and password are required");

        const user = await User.scope('login').findOne({
            where: {
                username,
                password,
                status: "active",
            },
            include: [
                {
                    model: Company,
                    attributes: ['id', 'name'],
                }
            ]
        });

        if (!user)
            throw new ExpressError(400, "Invalid username or password");
        // generate token
        const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY);
        // set cookie


        res.cookie('username', token, { httpOnly: true });
        res.json(user);
    } catch (err) {
        next(err);
    }
};

module.exports.logout = async (req, res, next) => {
    try {
        res.clearCookie('username');
        res.json({ message: "Logged out" });
    } catch (err) {
        next(err);
    }
};

module.exports.isLoggedIn = async (req, res, next) => {
    try {
        const { username } = req.cookies;
        
        try{
            const decoded = jwt.verify(username, process.env.SECRET_KEY);
            req.user = decoded;
        }catch(err){
            throw new ExpressError(401, "Unauthorized");
        }

        if (!username)
            throw new ExpressError(401, "Unauthorized");

        const user = await User.scope('login').findOne({
            where: {
                id: req.user.id,
                status: "active",
            },
        });

        if (!user)
            throw new ExpressError(401, "Unauthorized");

        res.json(user);
    } catch (err) {
        next(err);
    }
};