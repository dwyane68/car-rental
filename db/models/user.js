'use strict';
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    firstName: {
      type: DataTypes.STRING,
      field: 'first_name'
    },
    lastName: {
      type: DataTypes.STRING,
      field: 'last_name'
    },
    phone: {
      type: DataTypes.STRING,
      field: 'phone'
    },
    emailId: {
      type: DataTypes.STRING,
      field: 'email_id'
    },
    password: {
      type: DataTypes.STRING,
      field: 'password'
    },
    profilePic: {
      type: DataTypes.STRING,
      field: 'profile_pic'
    },
    licenceId: {
      type: DataTypes.STRING,
      field: 'license_id'
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at'
    },
  }, {
    underscored: true,
  });
  user.associate = function(models) {
    // associations can be defined here
    user.hasOne(models.business);
    // user.hasOne(models.memberSubscriptions);
  };
  return user;
};