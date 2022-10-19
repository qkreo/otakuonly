require('dotenv').config();
const env = process.env;

const development = {
    "username": env.rdsId,
    "password": env.rdspw,
    "database": env.rdsDatabase,
    "host": env.rdsEndPoint,
    "dialect": "mysql"
  };

  const test = {
    "username": env.resId,
    "password": env.respw,
    "database": env.rdsDatabase,
    "host": env.rdsEndPoint,
    "dialect": "mysql"
  };

const production = {
  "username": env.resId,
  "password": env.respw,
  "database": env.rdsDatabase,
  "host": env.rdsEndPoint,
    "dialect": "mysql"
  }

  module.exports = { development, production, test };
