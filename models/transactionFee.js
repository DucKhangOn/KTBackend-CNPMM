'use strict';
module.exports = (sequelize, DataTypes) => {
  const TransactionFee = sequelize.define('TransactionFee', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: DataTypes.STRING,
    amountLimit: DataTypes.DOUBLE,
    fee: DataTypes.DOUBLE
  }, {});
  TransactionFee.associate = function (models) {
    TransactionFee.hasMany(models.Transaction);
  };
  return TransactionFee;
};