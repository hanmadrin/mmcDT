const express = require('express');
const { getExtensionData, updateExtensionDataStatus,isLastOfFile, isFirstOfFile, test} = require('../controllers/extensionController');
const {isBot} = require('../middlewares/auth');
const {fetchBot} = require('../middlewares/fetchInfo');
const router = express.Router();

router.post('/get-extension-data', isBot, fetchBot, getExtensionData);
router.post('/update-extension-data-status', isBot, fetchBot, updateExtensionDataStatus)
router.post('/is-last-of-file', isBot, fetchBot, isLastOfFile);
router.post('/is-first-of-file', isBot, fetchBot, isFirstOfFile);

router.use("/test",isBot, fetchBot, test);
module.exports = router;