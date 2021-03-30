const {fine} = require('../db/models');

exports.get = async (id) => {
  let condition = {id};
  return await fine.findOne({
    where: condition
  });
};

exports.getByUserIdAdnRentalId = async (userId, rentalId) => {
  let condition = {
    userId,
    rentalId
  };
  return await fine.findOne({
    where: condition
  });
};

exports.getList = async (offset, limit, userId = null) => {
  let where = {};
  if(userId) {
    where.userId = userId
  }
  return fine.findAndCountAll({
    where,
    order: [['createdAt', 'DESC']],
    offset: offset,
    limit: limit,
  })
};

exports.getDetails = async (condition) => {
  return await fine.findOne({
    where: condition,
  });
};

exports.create = async (data) => {
  return await fine.create(data)
};

exports.update = async (id, userData) => {
  return await fine.update(userData, {
    where: {id}
  });
}