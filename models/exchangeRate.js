'use strict';
module.exports = (sequelize, DataTypes) => {
  const ExchangeRate = sequelize.define('ExchangeRate', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    unit: DataTypes.STRING,
    vnd: DataTypes.STRING,
    }, {});
  ExchangeRate.associate = function (models) {

  };
  return ExchangeRate;
};