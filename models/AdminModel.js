const { admin } = require('../db/models');

exports.create = async (data) => {
  return await admin.create(data);
}
exports.get = async (id) => {
  let condition = {id: id};
  return await admin.findOne({
    where: condition
  });
};

exports.getList = async (offset, limit) => {
  return admin.findAndCountAll({
    where: {
      deleted: false
    },
    attributes: ['id', 'firstName', 'lastName', 'phone', 'createdAt', 'updatedAt'],
    order: [['createdAt', 'DESC']],
    offset: offset,
    limit: limit,
  })
};

exports.getAllByRole = async (roleId) => {
  return await admin.findAll({
    where: {
      adminRoleId: roleId,
      deleted: false
    },
    attributes: ['id', 'firstName', 'lastName', 'phone', 'createdAt', 'updatedAt'],
  });
};

exports.getByPhone = async (phone, verified) => {
  let condition = {phone: phone};
  if(verified){
    condition.verified = true
  }
  return await admin.findOne({
    where: condition,
  });
};


exports.getDetails = async (condition) => {
  return await admin.findOne({
    where: condition,
    attributes: {
      exclude: ['createdAt','updatedAt']
    },
  });
};
