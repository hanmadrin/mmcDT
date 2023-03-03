const express = require('express');
const cors = require('cors');
const app = express();
const multer = require('multer')
const { pdfToText } = require('./utilities/pdfToText');
const { deleteFile } = require('./utilities/deleteFile');
const ExpressError = require('./utilities/expressError');
const { renameFile } = require('./utilities/renameFile');
const fs = require('fs');
const { connectToDatabase } = require('./config/config');
require('dotenv').config();
const upload = multer({ dest: 'public/uploads/' })

const userRouter = require('./routes/userRoute');

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/api/users', userRouter);

app.post('/api/parse-pdf', upload.single('pdf'), async (req, res, next) => {
    // create uploads folder if it doesn't exist
    if (!fs.existsSync('./public/uploads')) {
        fs.mkdirSync('./public/uploads');
    }
    try {
        const response = await pdfToText(req.file.path);
        if (response.error) {
            throw new ExpressError(400, response.error);
        }
        // deleteFile(req.files.pdf.path);
        renameFile(`./${req.file.path}`, `./${req.file.path}.pdf`);
        res.json({
            file: `${req.file.path.replace('public/', '')}.pdf`,
            response
        });
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

app.listen(port, () => {
    console.log(`server running at http://localhost:${port}`)
});

connectToDatabase();