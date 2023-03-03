const express = require('express');
const { getExtensionData, updateExtensionDataStatus } = require('../controllers/dataController');
const { isLoggedIn } = require('../middlewares/auth');
const router = express.Router();

router.get('/get-extension-data', isLoggedIn, getExtensionData);
router.put('/update-extension-data-status/:dataId', isLoggedIn, updateExtensionDataStatus)


module.exports = router;