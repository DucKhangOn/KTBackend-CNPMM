'use strict';
module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define(
    "Transaction",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      sourceBank: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      desBank: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      amount: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      beforeBalance: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      afterBalance: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      transactionType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allow: false,
      },
      comment: DataTypes.STRING,
      BankAccountId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      TransactionFeeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      ServiceId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {}
  );
  Transaction.associate = function (models) {
    Transaction.belongsTo(models.BankAccount, { foreignKey: "BankAccountId" });
    Transaction.belongsTo(models.TransactionFee, {
      foreignKey: "TransactionFeeId",
    });
    Transaction.belongsTo(models.Service, { foreignKey: "ServiceId" });
  };
  return Transaction;
};