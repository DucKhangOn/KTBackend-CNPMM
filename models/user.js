'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {  type: DataTypes.STRING,
              primaryKey: true,},
    password: DataTypes.STRING,
  }, {});
  User.associate = function (models) {

  };
  return User;
};


