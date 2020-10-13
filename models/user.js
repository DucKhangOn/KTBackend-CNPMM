'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    idAdmin:DataTypes.STRING,
    firstName:DataTypes.STRING,
    lastName:DataTypes.STRING,
    phone:DataTypes.STRING,
    gender:DataTypes.STRING,
    address:DataTypes.STRING
  }, {});
  User.associate = function (models) {
     
  };
  return User;
};


