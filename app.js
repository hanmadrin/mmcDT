const express = require('express');
const cors = require('cors');
const formidableMiddleware = require('express-formidable');
const app = express();
const { pdfToText } = require('./utilities');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(formidableMiddleware({
    encoding: 'utf-8',
    uploadDir: './public/uploads',
}));

app.post('/api/parse-pdf', async (req, res) => {
    console.log("req.body");
    const response = await pdfToText(req.files.pdf.path);
    console.log(response);
    res.send('hello');
});

app.use('/', (req, res) => { res.sendFile('./public/index.html', { root: __dirname }); });

app.listen(PORT, () => {
    console.log(`server running at http://localhost:${PORT}`)
});