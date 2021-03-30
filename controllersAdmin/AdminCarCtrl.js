const Car = require('../models/CarModel');

const {
  buildResponse,
  validate,
  invalidResponse
} = require('../services/utils');

const { USER_EXISTS, CAR_EXISTS, UNAUTHORISED, USER_NOT_FOUND, NO_DATA_FOUND } = require('../config/errorCodes');

exports.getList = (req, res, handleError) => {
  const {page = 1} = req.query;
  const limit = 25;
  const offset = ((parseInt(page) - 1) * limit);
  Car.getList(offset, limit).then((list) => {
    res.send(buildResponse({list: list}, 'Car list'))
  }, handleError);
};

exports.add = (req, res, handleError) => {
  const sanitized = validate([
    ('name' + '|' + req.body.name + '|' + 'required'),
    ('color' + '|' + req.body.color + '|' + 'required'),
    ('capacity' + '|' + req.body.capacity + '|' + 'required'),
    ('price' + '|' + req.body.price + '|' + 'required'),
    ('type' + '|' + req.body.type + '|' + 'required'),
  ]);

  if(sanitized.error){
    res.send(invalidResponse(sanitized.error));
    return;
  }

  Car.getByName(req.body.name).then((car) => {
    if(car){
      res.send(CAR_EXISTS);
      return;
    }
    const {name, price, color, capacity, type} = sanitized.data;
    const data = {
      name, price, color, capacity, type
    }
    Car.create(data).then((car) => {
      res.send(buildResponse({car}, 'Car added!'));
    }, handleError)
  }, handleError)
};

exports.update = (req, res, handleError) => {
  const sanitized = validate([
    ('name' + '|' + req.body.name + '|' + 'required'),
    ('color' + '|' + req.body.color + '|' + 'required'),
    ('capacity' + '|' + req.body.capacity + '|' + 'required'),
    ('price' + '|' + req.body.price + '|' + 'required'),
    ('type' + '|' + req.body.type + '|' + 'required'),
  ]);

  if(sanitized.error){
    res.send(invalidResponse(sanitized.error));
    return;
  }

  Car.get(id).then(async (conf) => {
    if (!car) {
      res.send(NO_DATA_FOUND);
      return;
    }
    const {name, price, color, capacity, type} = sanitized.data;
    const data = {
      name, price, color, capacity, type
    }
    await car.update(data);
    res.send(buildResponse({car}, 'Configuration updated!'));

  }, handleError);
};

