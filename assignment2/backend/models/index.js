const { Sequelize } = require('sequelize');
const Record = require('./Record');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.DB_PATH || './database.sqlite',
    logging: false // Set to console.log for SQL queries
});

// Initialize models
const models = {
    Record: Record(sequelize),
    sequelize
};

module.exports = models;


