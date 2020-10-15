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
    BankAccount.belongsTo(models.User,{foreignKey:'id'});
    BankAccount.hasOne(models.SavingsAccount);
    BankAccount.hasOne(models.Transaction);
    BankAccount.hasOne(models.Card);
  };
  return BankAccount;
};
