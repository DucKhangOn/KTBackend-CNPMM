'use strict';
module.exports = (sequelize, DataTypes) => {
  const RateInterest = sequelize.define('RateInterest', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    term: DataTypes.STRING,
    rateInterest: DataTypes.STRING,
    }, {});
  RateInterest.associate = function (models) {

  };
  return RateInterest;
};