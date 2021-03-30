const express = require('express');
const router = express.Router();
const authenticateAdmin = require('../authenticateAdmin');
const AdminCarController = require('../controllersAdmin/AdminCarCtrl');
const {UNAUTHORISED} = require('../config/errorCodes');

const accessCheck = (req, res, next) => {
    if(!req.adminId){
        res.send(UNAUTHORISED);
        return;
    }
    next();
};
  
router.post('/add', authenticateAdmin, accessCheck, AdminCarController.add);
router.post('/add-image', authenticateAdmin, accessCheck, AdminCarController.addImage);
router.post('/update', authenticateAdmin, accessCheck, AdminCarController.update);

module.exports = router;