const {user, business, businessCategory, city, usertree, contract, counterEnlistment, ftPay} = require('../db/models');
const {USER_TYPE} = require('../config/constants');

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
      exclude: ['createdAt', 'updatedAt', 'otpRequestAttempts', 'otpRequestedAt', 'fcmToken', 'visible']
    },
    include: [{
      model: business,
      include: [{
        model: businessCategory
      }, {
        model: counterEnlistment
      }]
    }, {
      model: city
    }, {
      model: usertree,
      attributes:["id", "walletAmount", "discountAmount", "planExpiry", "planStatus"],
    },{
      model: contract,
      attributes:["id", "file", "startDate", "endDate", "type"],
    }, {
      model: ftPay
    }]
  });
};

exports.getSelfDetails = async (condition) => {
  return await user.findOne({
    where: condition,
    attributes: ['id', 'firstName', 'lastName', 'phone', 'emailId', 'dob', "profilePic", "profilePicUpdatedAt"]
  });
};
exports.getAddressDetails = async (condition) => {
  return await user.findOne({
    where: condition,
    attributes: ['id', 'cityId'],
    include: [{
      model: city
    }],
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