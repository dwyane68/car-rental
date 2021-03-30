const User = require('../models/UserModel');

const {
  buildResponse,
} = require('../services/utils');


exports.getRentalList = (req, res, handleError) => {
  const {page = 1} = req.query;
  const limit = 25;
  const offset = ((parseInt(page) - 1) * limit);
  User.getRentalList(offset, limit).then((list) => {
    res.send(buildResponse({list: list}, 'Rental list'))
  }, handleError);
};

exports.getFinesList = (req, res, handleError) => {
  const {page = 1} = req.query;
  const limit = 25;
  const offset = ((parseInt(page) - 1) * limit);
  User.getFinesList(offset, limit).then((list) => {
    res.send(buildResponse({list: list}, 'Fines list'))
  }, handleError);
};