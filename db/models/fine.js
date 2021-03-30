'use strict';
module.exports = (sequelize, DataTypes) => {
  const fine = sequelize.define('fine', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    userId: {
      type: DataTypes.STRING,
      field: 'user_id'
    },
    rentalId: {
      type: DataTypes.STRING,
      field: 'rental_id'
    },
    amount: {
      type: DataTypes.STRING,
      field: 'amount'
    },
    paid: {
      type: DataTypes.BOOLEAN,
      field: 'paid'
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
  fine.associate = function(models) {
    // associations can be defined here
    fine.belongsTo(models.user);
    fine.belongsTo(models.rental);
  };
  return fine;
};