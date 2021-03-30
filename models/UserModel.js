const {user, rental, fine} = require('../db/models');

exports.get = async (id) => {
  let condition = {id: id};
  return await user.findOne({
    where: condition
  });
};

exports.getList = async (offset, limit) => {
  return user.findAndCountAll({
    attributes: {
      exclude: ['password']
    },
    order: [['createdAt', 'DESC']],
    offset: offset,
    limit: limit,
  })
};

exports.getRentalList = async (offset, limit) => {
  return user.findAndCountAll({
    attributes: {
      exclude: ['password']
    },
    include: [{
      model: rental
    }],
    order: [['createdAt', 'DESC']],
    offset: offset,
    limit: limit,
  })
};

exports.getFinesList = async (offset, limit) => {
  return user.findAndCountAll({
    attributes: {
      exclude: ['password']
    },
    include: [{
      model: fine
    }],
    order: [['createdAt', 'DESC']],
    offset: offset,
    limit: limit,
  })
};

exports.getBasicDetails = async (id) => {
  return await user.findOne({
    where: {id: id},
    attributes: ['id', 'firstName', 'lastName'],
    include: [{
      model: city
    }]
  });
};

exports.getByEmail = async (email) => {
  let condition = {emailId: email};
  return await user.findOne({
    where: condition,
  });
};

exports.getDetails = async (condition) => {
  return await user.findOne({
    where: condition,
    attributes: {
      exclude: ['createdAt', 'updatedAt', 'password']
    },
  });
};

exports.getSelfDetails = async (condition) => {
  return await user.findOne({
    where: condition,
    attributes: ['id', 'firstName', 'lastName', 'phone', 'emailId', 'profilePic']
  });
};

exports.create = async (data) => {
  return await user.create(data)
};

exports.update = async (userId, userData) => {
  return await user.update(userData, {
    where: {id: userId}
  });
}