const {rental, fine} = require('../db/models');

exports.get = async (id) => {
  let condition = {id};
  return await rental.findOne({
    where: condition,
    include: [{
      model: fine
    }]
  });
};

exports.getByUserIdAdnCarId = async (userId, carId) => {
  let condition = {
    userId,
    carId
  };
  return await rental.findOne({
    where: condition
  });
};

exports.getList = async (offset, limit, userId = null) => {
  let where = {};
  if(userId) {
    where.userId = userId
  }
  return rental.findAndCountAll({
    where,
    order: [['createdAt', 'DESC']],
    offset: offset,
    limit: limit,
  })
};

exports.getDetails = async (condition) => {
  return await rental.findOne({
    where: condition,
  });
};

exports.create = async (data) => {
  return await rental.create(data)
};

exports.update = async (id, userData) => {
  return await rental.update(userData, {
    where: {id}
  });
}