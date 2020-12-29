"use strict";
module.exports = (sequelize, DataTypes) => {
  const BankSavingBook = sequelize.define(
    "BankSavingBook",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      bankCardNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      savingAccountNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      term: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      length: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      prevBalance: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
      afterBalance: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
      withdrawalDate: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isActivity: {
        type: DataTypes.STRING,
        allowNull: true,
      }
    },
    {}
  );
  BankSavingBook.associate = function (models) {
  };
  return BankSavingBook;
};
