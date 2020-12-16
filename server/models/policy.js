'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class policy extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  policy.init({
    name: DataTypes.STRING,
    add_permit: DataTypes.BOOLEAN,
    del_permit: DataTypes.BOOLEAN,
    update_permit: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'policy',
  });
  return policy;
};