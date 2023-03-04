const express = require('express');
const { parsePdf, savePdfData } = require('../controllers/dataController');
const { isLoggedIn } = require('../middlewares/auth');
const upload = require('../middlewares/multer');
const router = express.Router();

router.post('/parse-pdf', isLoggedIn, upload.single('pdf'), parsePdf);
router.post('/save-pdf-data', isLoggedIn, savePdfData);

module.exports = router;