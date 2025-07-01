const { Model, DataTypes } = require('sequelize');
const sequelize = require('../connection');

class Vendor extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
    Vendor.hasMany(models.Product, {
      foreignKey: 'vendorId',
      as: 'products' // optional alias
    });
  }
}

Vendor.init({
  name: DataTypes.STRING
}, {
  sequelize,
  tableName: 'vendors'
});

module.exports = Vendor;
