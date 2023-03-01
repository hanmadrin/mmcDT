const express = require('express');
const cors = require('cors');
const formidableMiddleware = require('express-formidable');
const app = express();
const { pdfToText } = require('./utilities/pdfToText');
const { deleteFile } = require('./utilities/deleteFile');
const ExpressError = require('./utilities/expressError');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(express.static('public'));
app.use(formidableMiddleware({
    encoding: 'utf-8',
    uploadDir: './public/uploads',
}));

app.post('/api/parse-pdf', async (req, res, next) => {
    try {
        console.log("req.body");
        const response = await pdfToText(req.files.pdf.path);
        if (response.error) {
            throw new ExpressError(400, response.error);
        }
        deleteFile(req.files.pdf.path);
        res.json(response);
    } catch (err) {
        next(err);
    }
});

app.use("/api/*", (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});

app.use('/', (req, res) => { res.sendFile('./public/index.html', { root: __dirname }); });

app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Server Error" } = err;
    res.status(statusCode).json(message);
});

app.listen(PORT, () => {
    console.log(`server running at http://localhost:${PORT}`)
});