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