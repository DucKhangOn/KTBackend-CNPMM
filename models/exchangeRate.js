'use strict';
module.exports = (sequelize, DataTypes) => {
  const ExchangeRate = sequelize.define('ExchangeRate', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    unit: {
      type: DataTypes.STRING,
      allowNull:false,
      unique: true,
    },
    vnd: {
      type: DataTypes.DOUBLE,
      allowNull:false,
    },
  }, {});
  ExchangeRate.associate = function (models) {

  };
  return ExchangeRate;
};