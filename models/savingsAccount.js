'use strict';
module.exports = (sequelize, DataTypes) => {
  const SavingsAccount = sequelize.define(
    "SavingsAccount",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      number: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      rateInterestType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      balance: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      isFinalSettlement: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      BankAccountId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      RateInterestId:{
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {}
  );
  SavingsAccount.associate = function (models) {
    SavingsAccount.belongsTo(models.BankAccount, {
      foreignKey: "BankAccountId",
    });
    SavingsAccount.belongsTo(models.RateInterest, {
      foreignKey: "RateInterestId",
    });
  };
  return SavingsAccount;
};