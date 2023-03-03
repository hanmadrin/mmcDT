const express = require('express');
const { parsePdf } = require('../controllers/dataController');
const { isLoggedIn } = require('../middlewares/auth');
const upload = require('../middlewares/multer');
const router = express.Router();

router.post('/parse-pdf', isLoggedIn, upload.single('pdf'), parsePdf);

module.exports = router;