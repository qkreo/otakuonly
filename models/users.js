'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Users.hasMany(models.Posts,{foreignKey:"userId",sourceKey:"userId"});

    }
  }
  Users.init({
    userId: {
      primaryKey: true,
      autoIncrement:true,
      type: DataTypes.INTEGER,
    },
    nickname: DataTypes.STRING,
    hashedPw: DataTypes.STRING,
    salt: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Users',
  });
  return Users;
};