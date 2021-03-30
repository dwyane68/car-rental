const express = require('express');
const router = express.Router();
const authenticateAdmin = require('../authenticateAdmin');
const AdminUserController = require('../controllersAdmin/AdminUserCtrl');
const {UNAUTHORISED} = require('../config/errorCodes');
const accessCheck = (req, res, next) => {
    if(!req.adminId){
        res.send(UNAUTHORISED);
        return;
    }
    next();
};

router.get('/rentals', authenticateAdmin, accessCheck, AdminUserController.getRentalList);
router.get('/fines', authenticateAdmin, accessCheck, AdminUserController.getFinesList);

module.exports = router;