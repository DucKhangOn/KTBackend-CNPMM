'use strict';
module.exports = (sequelize, DataTypes) => {
  const BankAccount = sequelize.define('BankAccount', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    bankCardNumber: DataTypes.STRING,
    balance: DataTypes.DOUBLE,
    branch: DataTypes.STRING
  }, {});
  BankAccount.associate = function (models) {
    BankAccount.belongsTo(models.User, { foreignKey: 'id' });
    BankAccount.hasMany(models.SavingsAccount);
    BankAccount.hasMany(models.Transaction);
    BankAccount.hasMany(models.Card);
  };
  return BankAccount;
};
