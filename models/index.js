const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelizeConfig = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelizeConfig;
db.task = require("./task.model.js")(sequelizeConfig, Sequelize);
db.user = require("./user.model.js")(sequelizeConfig, Sequelize);

module.exports = db;