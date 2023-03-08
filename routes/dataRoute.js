const express = require('express');
const { parsePdf, savePdfData, isPdfExists, getFilesWithStatus, getAllFileData } = require('../controllers/dataController');
const { isLoggedIn } = require('../middlewares/auth');
const upload = require('../middlewares/multer');
const router = express.Router();

router.get('/get-all-file-data/:id', isLoggedIn, getAllFileData);
router.get('/get-files-with-status', isLoggedIn, getFilesWithStatus);
router.get('/is-pdf-exists/:fileName', isLoggedIn, isPdfExists);
router.post('/parse-pdf', isLoggedIn, upload.single('pdf'), parsePdf);
router.post('/save-pdf-data', isLoggedIn, savePdfData);

module.exports = router;