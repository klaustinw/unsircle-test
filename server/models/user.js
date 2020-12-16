'use strict';
const bcrypt = require('bcryptjs');
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
      user.belongsTo(models.policy, { foreignKey: "privilege" });
    }
  };
  user.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [1, 12],
          msg: "Length validation error, maximum characters are 12"
        },
        notNull: {
          args: true,
          msg: "Value is null"
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        min: {
          args: 6,
          msg: "Password cannot be shorter or equals to 6 characters"
        },
        notNull: {
          args: true,
          msg: "Value is null"
        }
      }
    },
    privilege: { type: DataTypes.INTEGER, allowNull: false }
  }, {
    sequelize,
    modelName: 'user',
  });

  user.beforeCreate(async (user, option) => {
    try {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      user.password = hashedPassword;
    } catch (error) {
      console.log(error)
    }
  })
  return user;
};