const express = require('express');
const router = express.Router();

const { login, getAllUsers } = require('../controllers/userController');

router.get('/login', login);
router.get('/', getAllUsers);

module.exports = router;