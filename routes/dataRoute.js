const express = require('express');
const { parsePdf, savePdfData, isPdfExists, getFilesWithStatus, getAllFileData, updatePdfData,getSwitchStatus, setSwitchStatus } = require('../controllers/dataController');
const { isLoggedIn } = require('../middlewares/auth');
const {fetchUser} = require('../middlewares/fetchInfo');
const upload = require('../middlewares/multer');
const router = express.Router();

router.get('/get-all-file-data/:id', isLoggedIn, fetchUser, getAllFileData);
router.get('/get-files-with-status', isLoggedIn, fetchUser, getFilesWithStatus);
router.get('/is-pdf-exists/:fileName', isLoggedIn, fetchUser, isPdfExists);
router.post('/parse-pdf', isLoggedIn, upload.single('pdf'), fetchUser, parsePdf);
router.post('/save-pdf-data', isLoggedIn, fetchUser, savePdfData);
router.put('/update-pdf-data/:id', isLoggedIn, fetchUser, updatePdfData);
router.post('/get-switch-status', isLoggedIn, fetchUser, getSwitchStatus);
router.post('/set-switch-status', isLoggedIn, fetchUser, setSwitchStatus);

module.exports = router;