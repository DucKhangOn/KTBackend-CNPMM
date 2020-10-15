'use strict';
module.exports = (sequelize, DataTypes) => {
  const RateInterest = sequelize.define('RateInterest', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    term: DataTypes.INTEGER,
    rateInterest: DataTypes.DOUBLE
  }, {});
  RateInterest.associate = function (models) {
    RateInterest.hasMany(models.SavingsAccount);
  };
  return RateInterest;
};