'use strict';
module.exports = (sequelize, DataTypes) => {
  const rental = sequelize.define('rental', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    carId: {
      type: DataTypes.STRING,
      field: 'car_id'
    },
    userId: {
      type: DataTypes.STRING,
      field: 'user_id'
    },
    noOfDays: {
      type: DataTypes.STRING,
      field: 'no_of_days'
    },
    amount: {
      type: DataTypes.STRING,
      field: 'amount'
    },
    returnDate: {
      type: DataTypes.DATE,
      field: 'return_date'
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
  rental.associate = function(models) {
    // associations can be defined here
    rental.belongsTo(models.user);
    rental.hasOne(models.fine);
  };
  return rental;
};