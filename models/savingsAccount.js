"use strict";
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
        unique: true,
      },
      hasTerm: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      term: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      prevBalance: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      balance: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      depositDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      withdrawalDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      isFinalSettlement: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      itemChosen: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      childOf: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: false,
      },
      rateInterest: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      BankAccountId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      }
    },
    {}
  );
  SavingsAccount.associate = function (models) {
    SavingsAccount.belongsTo(models.BankAccount, {
      foreignKey: "BankAccountId",
    });
  };
  return SavingsAccount;
};
