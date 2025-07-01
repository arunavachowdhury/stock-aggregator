'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('order_products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      orderId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'orders', // The name of the referenced table
          key: 'id' // The primary key column in the referenced table
        }
      },
      productId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'products', // The name of the referenced table
          key: 'id' // The primary key column in the referenced table
        }
      },
      price: {
        type: Sequelize.FLOAT
      },
      qty: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('order_products');
  }
};