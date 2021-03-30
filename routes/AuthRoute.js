const express = require('express');
const router = express.Router();

const authenticate = require('../authenticate');
const AuthController = require('../controllers/AuthCtrl');

router.post('/login', AuthController.login);
router.post('/register', AuthController.register);
router.post('/reset-password', authenticate, AuthController.resetPassword);

module.exports = router;