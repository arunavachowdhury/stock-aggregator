const { Model, DataTypes } = require('sequelize');
const sequelize = require('../connection');

class Product extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    Product.belongsTo(models.Vendor, {
      foreignKey: 'vendorId',
      as: 'vendor' // optional alias
    });
  }
}
Product.init({
  vendorId: DataTypes.NUMBER,
  vendorProductId: DataTypes.STRING,
  productName: DataTypes.STRING,
  actualStock: DataTypes.NUMBER,
  reservedStock: DataTypes.NUMBER,
  price: DataTypes.DECIMAL(4),
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
  deletedAt: DataTypes.DATE
}, {
  sequelize,
  tableName: 'products',
  paranoid: true
});

module.exports = Product;

