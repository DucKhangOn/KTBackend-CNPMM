'use strict';
module.exports = (sequelize, DataTypes) => {
  const BankAccount = sequelize.define('BankAccount', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    bankCardNumber: DataTypes.STRING,
    banlance: DataTypes.STRING,
    branch: DataTypes.STRING
  }, {});
  BankAccount.associate = function (models) {

  };
  return BankAccount;
};
