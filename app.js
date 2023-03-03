const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
const ExpressError = require('./utilities/expressError');
const { connectToDatabase } = require('./config/config');
require('dotenv').config();

const userRouter = require('./routes/userRoute');
const dataRouter = require('./routes/dataRoute');

const port = process.env.PORT || 3000;

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/api/users', userRouter);
app.use('/api/datas', dataRouter);

app.use("/api/*", (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});

app.use('/', (req, res) => { res.sendFile('./public/index.html', { root: __dirname }); });

app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Server Error" } = err;
    res.status(statusCode).json(message);
});

app.listen(port, () => {
    console.log(`server running at http://localhost:${port}`)
});

connectToDatabase();