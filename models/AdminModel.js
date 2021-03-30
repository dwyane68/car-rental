const { admin, adminRole } = require('../db/models');
const { Op } = require('sequelize');

exports.create = async (data) => {
  return await admin.create(data);
}
exports.get = async (id) => {
  let condition = {id: id};
  return await admin.findOne({
    where: condition
  });
};

exports.getCountByParentAdmin = async (id) => {
  return await admin.count({
    where: {
      adminId: id
    }
  })
};

exports.getList = async (offset, limit) => {
  return admin.findAndCountAll({
    where: {
      deleted: false
    },
    attributes: ['id', 'firstName', 'lastName', 'phone', 'adminRoleId', 'visible', 'referralCode', 'createdAt', 'updatedAt'],
    include: [
      {
        model: adminRole
      },
      {
        model: admin,
        as: 'parentAdmin',
        attributes: ['id', 'firstName', 'lastName', ],
        include: [
          {
            model: adminRole
          },
        ]
      }
    ],
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
    attributes: ['id', 'firstName', 'lastName', 'phone', 'adminRoleId', 'visible', 'referralCode', 'createdAt', 'updatedAt'],
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
      exclude: ['createdAt','updatedAt','otpRequestAttempts','otpRequestedAt']
    },
    include: [
      {
        model: adminRole,
        attributes: ['id', 'role'],
      }
    ]
  });
};

exports.getByReferral = async (code) => {
  return await admin.findOne({
    where: {
      referralCode: code
    }
  })
};

exports.getIdByAdminId = async (id) => {
  return await admin.findAll({
    where: {
      adminId: id,
      deleted: false
    },
    attributes: {
      include: ['id']
    }
  });
}

exports.getAdminByParentAdmin = async (roleId, adminId) => {
  return await admin.findAll({
    where: {
      adminRoleId: roleId,
      adminId: adminId,
      deleted: false
    },
    attributes: ['id', 'firstName', 'lastName', 'phone', 'adminRoleId', 'visible', 'referralCode', 'createdAt', 'updatedAt'],
  });
};