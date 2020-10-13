'use strict';
module.exports = (sequelize, DataTypes) => {
  const SavingsAccount = sequelize.define('SavingsAccount', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    number: DataTypes.STRING,
    rateInterestType: DataTypes.STRING,
    balance:DataTypes.STRING,
    isFinalSettlement:DataTypes.STRING,
  }, {});
  SavingsAccount.associate = function (models) {

  };
  return SavingsAccount;
};