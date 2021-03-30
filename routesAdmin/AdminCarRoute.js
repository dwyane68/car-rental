const express = require('express');
const router = express.Router();

const AdminCarController = require('../controllersAdmin/AdminCarCtrl');

router.post('/add', AdminCarController.add);
router.post('/update', AdminCarController.update);

module.exports = router;