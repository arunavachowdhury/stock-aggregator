const { Sequelize } = require('sequelize');
require('dotenv').config();

const env = process.env.NODE_ENV;

const config = require('../config/database');

const sequelize = new Sequelize(config[env]);

module.exports = sequelize;