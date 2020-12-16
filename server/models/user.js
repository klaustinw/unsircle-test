'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      user.hasOne(models.policy, { foreignKey: "id" });
    }
  };
  user.init({
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    privilege: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};