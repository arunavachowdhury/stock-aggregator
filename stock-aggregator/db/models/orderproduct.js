'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../connection');

class OrderProduct extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
    OrderProduct.hasOne(models.Product, {
      foreignKey: 'productId'
    })
  }
}
OrderProduct.init({
  orderId: DataTypes.INTEGER,
  productId: DataTypes.INTEGER,
  price: DataTypes.FLOAT,
  qty: DataTypes.INTEGER
}, {
  sequelize,
  tableName: 'order_products'
});

module.exports = OrderProduct;