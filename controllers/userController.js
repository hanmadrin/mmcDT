const User = require("../models/user");
const ExpressError = require("../utilities/expressError");

module.exports.login = async (req, res, next) => {
    console.log("login");
    try {
        console.log(req.body);
        const { username, password } = req.body;
        console.log(username, password);

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

        // res.cookie('username', user.username, { httpOnly: true });
        res.json(user);
    } catch (err) {
        console.log("error");
        next(err);
    }
};

module.exports.getAllUsers = async (req, res) => {
    const users = await User.findAll();
    res.json(users);
}