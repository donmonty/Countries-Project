'use strict';


const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};

console.log("/// CONFIG VALUE:", config)

let sequelize;
if (config.url) {
  console.log("//////////////// CONFIG URL OK /////////////////")
  //sequelize = new Sequelize(process.env[config.url], config);
  sequelize = new Sequelize(config.url, config);
} else {
  // console.log("/////////////////////// CONFIG VARS //////////////////////")
  //sequelize = new Sequelize(config.database, config.username, config.password, config);

  sequelize = new Sequelize(`postgres://${config.username}:${config.password}@${config.host}:5432/${config.database}`, {
    logging: true, // set to console.log to see the raw SQL queries
    native: false, // lets Sequelize know we can use pg-native for ~30% more speed
  });

  ////////////// THIS IS THE SAFEGUARD, DO NOT DELETE!!!!!  /////////////////////
  //////////////////////////////////////////////////////////////////////////////////
  // sequelize = new Sequelize("postgres://postgres:398845110@localhost:5432/countries_test", {
  //   logging: true, // set to console.log to see the raw SQL queries
  //   native: false, // lets Sequelize know we can use pg-native for ~30% more speed
  // });
}
// if (config.use_env_variable) {
//   sequelize = new Sequelize(process.env[config.use_env_variable], config);
// } else {
//   sequelize = new Sequelize(config.database, config.username, config.password, config);
// }

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
