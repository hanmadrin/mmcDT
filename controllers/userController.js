const { User } = require("../models");
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
        });

        if (!user)
            throw new ExpressError(400, "Invalid username or password");

        res.cookie('username', user.username, { httpOnly: true });
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

        if (!username)
            throw new ExpressError(401, "Unauthorized");

        const user = await User.scope('login').findOne({
            where: {
                username,
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