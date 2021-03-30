const express = require('express');
const router = express.Router();

const AdminUserController = require('../controllersAdmin/AdminUserCtrl');

router.get('/rentals', AdminUserController.getRentalList);
router.get('/fines', AdminUserController.getFinesList);

module.exports = router;