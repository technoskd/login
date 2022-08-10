const Sequelize = require('sequelize');

const dbConfig = require('../config/db.config');

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: 0,
  dialectOptions: {
    ssl: {
      MYSQL_ATTR_SSL_CA: '/etc/ssl/cert.pem',
    }
  },
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {
  sequelize: sequelize,
  User: require('./user')(sequelize, Sequelize),
  Session: require('./session')(sequelize, Sequelize),

};

db.sequelize.sync({ alter: true, }).then(() => {
  console.log('Yes re-sync');
})

module.exports = db;