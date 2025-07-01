'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      vendorId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'vendors', // The name of the referenced table
          key: 'id', // The primary key column in the referenced table
        }
      },
      vendorProductId: {
        type: Sequelize.STRING
      },
      productName: {
        type: Sequelize.STRING
      },
      actualStock: {
        type: Sequelize.INTEGER
      },
      reservedStock: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      price: {
        allowNull: true,
        type: Sequelize.DECIMAL(4)
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('products');
  }
};