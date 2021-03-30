const {car} = require('../db/models');
const {Op} = require('sequelize');

exports.get = async (id) => {
  let condition = {id: id};
  return await car.findOne({
    where: condition
  });
};

exports.getByName = async (name) => {
  let condition = {name: name};
  return await car.findOne({
    where: condition
  });
};

exports.getList = async (offset, limit) => {
  return car.findAndCountAll({
    order: [['createdAt', 'DESC']],
    offset: offset,
    limit: limit,
  })
};

exports.getDetails = async (condition) => {
  return await car.findOne({
    where: condition,
  });
};

exports.create = async (data) => {
  return await car.create(data)
};

exports.update = async (carId, carData) => {
  return await car.update(carData, {
    where: {id: carId},
    returning: true,
  });
}

exports.like = async (search, where, offset, limit) => {

  let whereCondition = search ? {
    name: {
      [Op.like]: `%${search}%`
    },
  }: {};
  whereCondition = {...whereCondition, ...where}

  const opt = {
    where: whereCondition,
    limit: limit
  }

  if(offset){
    opt.offset = offset;
  }

  return await car.findAll(opt)
};