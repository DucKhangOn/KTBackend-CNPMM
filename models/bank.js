'use strict';
module.exports = (sequelize, DataTypes) => {
  const Bank = sequelize.define('Bank', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: DataTypes.STRING,
    isFriend: DataTypes.STRING
  }, {});
  Bank.associate = function (models) {

  };
  return Bank;
};