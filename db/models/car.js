'use strict';
module.exports = (sequelize, DataTypes) => {
  const car = sequelize.define('car', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    name: {
      type: DataTypes.STRING,
      field: 'name'
    },
    image: {
      type: DataTypes.STRING,
      field: 'image'
    },
    color: {
      type: DataTypes.STRING,
      field: 'color'
    },
    capacity: {
      type: DataTypes.STRING,
      field: 'capacity'
    },
    price: {
      type: DataTypes.STRING,
      field: 'price'
    },
    type: {
      type: DataTypes.ENUM,
      values: ['Sedan', 'Hatchback', 'Coupe', 'Sports', 'SUV'],
      field: 'type'
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
  return car;
};