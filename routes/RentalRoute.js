const express = require('express');
const router = express.Router();

const authenticate = require('../authenticate');
const RentalController = require('../controllers/RentalCtrl');

router.get('/', authenticate, RentalController.getList);
router.get('/car-list', authenticate, RentalController.getCarList);
router.post('/add', authenticate, RentalController.add);
router.post('/return-car', authenticate, RentalController.returnCar);

module.exports = router;