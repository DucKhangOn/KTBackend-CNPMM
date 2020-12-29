'use strict';
module.exports = (sequelize, DataTypes) => {
  const RateInterest = sequelize.define(
    "RateInterest",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      term: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      rateInterest: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      day: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      month: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      isTall: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      codeRate: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {}
  );
  RateInterest.associate = function (models) {
  };
  return RateInterest;
};