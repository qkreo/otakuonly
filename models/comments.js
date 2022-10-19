'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Comments.belongsTo(models.Posts, {
        foreignKey: "postId",
        targetKey:"postId",
        onDelete: "CASCADE",
      })

    }
  }
  Comments.init({
    commentId: {
      primaryKey: true,
      autoIncrement:true,
      type: DataTypes.INTEGER,
    },
    postId:DataTypes.INTEGER,   
    nickname: DataTypes.STRING,
    content: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Comments',
  });
  return Comments;
};