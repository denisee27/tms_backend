const Sequelize = require("sequelize");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const config = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    pool: {
        max: parseInt(process.env.DB_POOL_MAX, 10),
        min: parseInt(process.env.DB_POOL_MIN, 10),
        acquire: parseInt(process.env.DB_POOL_ACQUIRE, 10),
        idle: parseInt(process.env.DB_POOL_IDLE, 10),
    }
});

const db = {};
db.sequelize = config;
const models = path.join(__dirname, "../models");
fs.readdirSync(models)
    .filter((file) => file.endsWith(".model.js"))
    .forEach((file) => {
        const model = require(path.join(models, file))(config, Sequelize);
        const modelName = path.basename(file).replace(".model.js", "");
        db[modelName] = model;
    });
module.exports = db;