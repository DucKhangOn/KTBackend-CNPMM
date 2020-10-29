'use strict';
module.exports = (sequelize, DataTypes) => {
  const BankAccount = sequelize.define('BankAccount', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    bankCardNumber:{
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    balance: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    branch: {
      type: DataTypes.STRING,
      allowNull: false
    },
    UserId:{
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {});
  BankAccount.associate = function (models) {
    BankAccount.belongsTo(models.User, { foreignKey: 'UserId' });
    BankAccount.hasMany(models.SavingsAccount);
    BankAccount.hasMany(models.Transaction);
    BankAccount.hasMany(models.Card);
  };
  return BankAccount;
};
