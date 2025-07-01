'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../connection');

class Order extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
    Order.hasMany(models.OrderProduct, {
      foreignKey: 'orderId'
    })
  }
}

Order.init({
  userName: DataTypes.STRING,
  orderPrice: DataTypes.FLOAT,
  orderQty: DataTypes.INTEGER
}, {
  sequelize,
  tableName: 'orders',
});

module.exports = Order;