'use strict';
module.exports = (sequelize, DataTypes) => {
  const RateInterest = sequelize.define('RateInterest', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    term:{
       type: DataTypes.DOUBLE,
       allowNull:false,
      },
    rateInterest: {
      type: DataTypes.DOUBLE,
      allowNull:false,
    },
  }, {});
  RateInterest.associate = function (models) {
    RateInterest.hasMany(models.SavingsAccount);
  };
  return RateInterest;
};