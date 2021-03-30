const {car} = require('../db/models');

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

exports.update = async (userId, userData) => {
  return await user.update(userData, {
    where: {id: userId}
  });
}

exports.like = async (search, where, offset, limit) => {

  const whereCondition = search ? {
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

  return await business.findAll(opt)
};