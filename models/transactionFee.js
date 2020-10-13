'use strict';
module.exports = (sequelize, DataTypes) => {
  const TransactionFee = sequelize.define('TransactionFee', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: DataTypes.STRING,
    amountLimit: DataTypes.STRING,
    fee:DataTypes.STRING,
    }, {});
  TransactionFee.associate = function (models) {

  };
  return TransactionFee;
};