const express = require('express');
const router = express.Router();

const { login, logout, isLoggedIn } = require('../controllers/userController');

router.post('/login', login);
router.get('/logout', logout);
router.get('/is-logged-in', isLoggedIn);

module.exports = router;