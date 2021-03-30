const express = require('express');
const router = express.Router();

const AdminAuthController = require('../controllersAdmin/AdminAuthCtrl');

router.post('/login', AdminAuthController.login);
router.post('/register', AdminAuthController.register);

module.exports = router;