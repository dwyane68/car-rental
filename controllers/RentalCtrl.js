const Rental = require('../models/RentalModel');
const Car = require('../models/CarModel');
const Fine = require('../models/FineModel');

const {
  buildResponse,
  getDateDiffFromNow,
  validate,
  invalidResponse,
  getDateDiffDays
} = require('../services/utils');

const {
  FINE_PER_DAY
} = require('../config/constants');

const { USER_EXISTS, CAR_EXISTS, UNAUTHORISED, USER_NOT_FOUND, NO_DATA_FOUND } = require('../config/errorCodes');


exports.getCarList = (req, res, handleError) => {
  const {page = 1, keyword, color, type, capacity} = req.query;
  const limit = 25;
  const offset = ((parseInt(page) - 1) * limit);
  let where = {}
  if(color) {
    where.color = color;
  }
  
  Car.like(keyword, where, offset, limit).then((list) => {
    res.send(buildResponse({list: list}, 'Car list'))
  }, handleError);
};

exports.getList = (req, res, handleError) => {
  const {page = 1} = req.query;
  const limit = 25;
  const offset = ((parseInt(page) - 1) * limit);
  if(!req.userId) {
    return res.send(UNAUTHORISED);
  }
  Rental.getList(offset, limit, req.userId).then((list) => {
    res.send(buildResponse({list: list}, 'Rental list'))
  }, handleError);
};

exports.add = async (req, res, handleError) => {
  if(!req.userId) {
    res.send(UNAUTHORISED);
    return;
  }
  const sanitized = validate([
    ('noOfDays' + '|' + req.body.noOfDays + '|' + 'required'),
    ('carId' + '|' + req.body.carId + '|' + 'required'),
  ]);
  console.log(sanitized);
  if(sanitized.error){
    res.send(invalidResponse(sanitized.error));
    return;
  }

  const { carId, noOfDays } = sanitized.data;
  let data = {
    userId: req.userId,
    carId,
    noOfDays
  }

  const car = await Car.get(carId);
  if(!car) {
    return res.send(NO_DATA_FOUND);
  }

  data.amount = parseInt(car.dataValues.price) * parseInt(noOfDays);
  Rental.create(data).then((rental) => {
    res.send(buildResponse({rental}, 'Rental added!'));
  }, handleError)
};

exports.returnCar = (req, res, handleError) => {
  const sanitized = validate([
    ('returnDate' + '|' + req.body.returnDate + '|' + 'required'),
    ('rentalId' + '|' + req.body.rentalId + '|' + 'required'),
  ]);

  if(sanitized.error){
    res.send(invalidResponse(sanitized.error));
    return;
  }

  const { rentalId, returnDate } = sanitized.data;
  Rental.get(rentalId).then(async (rental) => {
    if (!rental) {
      res.send(NO_DATA_FOUND);
      return;
    }
    if(rental.returnDate) {
      return res.send(buildResponse({}, "Return date already exist"))
    }
    let dateDiff = getDateDiffDays(returnDate, rental.createdAt);
    dateDiff = dateDiff - rental.noOfDays;
    let fineData = {};
    if(dateDiff > 0) {
      fineData = {
        userId: req.userId,
        rentalId: rental.id,
        amount: dateDiff * FINE_PER_DAY
      }
      await Fine.create(fineData);
    }
    //Calculate fine
    await rental.update({returnDate});
    rental.dataValues.fine = fineData;
    res.send(buildResponse({rental}, 'Car returned!'));

  }, handleError);
};

