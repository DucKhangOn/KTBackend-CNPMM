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
    balance: DataTypes.DOUBLE,
    isFinalSettlement: DataTypes.BOOLEAN
  }, {});
  SavingsAccount.associate = function (models) {
    SavingsAccount.belongsTo(models.BankAccount, { foreignKey: "id" });
    SavingsAccount.belongsTo(models.RateInterest, { foreignKey: "id" });
  };
  return SavingsAccount;
};