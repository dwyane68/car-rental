'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('cars', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      name: {
        type: Sequelize.STRING
      },
      image: {
        type: Sequelize.STRING
      },
      color: {
        type: Sequelize.STRING
      },
      capacity: {
        type: Sequelize.STRING
      },
      price: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.ENUM,
        values: ['Sedan', 'Hatchback', 'Coupe', 'Sports', 'SUV'],
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('cars');
  }
};
