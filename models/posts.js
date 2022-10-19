'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Posts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Posts.hasMany(models.Comments,{foreignKey:"postId",sourceKey:"postId"});
      Posts.hasMany(models.Likes,{foreignKey:"postId",sourceKey:"postId"});
      Posts.belongsTo(models.Users, {
        foreignKey: "userId",
        targetKey:"userId",
        onDelete: "CASCADE",
      })
    }
  }
  Posts.init({
    postId: {
      primaryKey: true,
      autoIncrement:true,
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    nickname: DataTypes.STRING,
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    likes:DataTypes.INTEGER,
   
  }, {
    sequelize,
    modelName: 'Posts',
  });
  return Posts;
};