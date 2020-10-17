'use strict';
module.exports = (sequelize, DataTypes) => {
  const TransactionFee = sequelize.define(
    "TransactionFee",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      amountLimit: {
        type: DataTypes.DOUBLE,
        allowNull:false,
      },
      fee: {
        type: DataTypes.DOUBLE,
         allowNull:false,
      },
    },
    {}
  );
  TransactionFee.associate = function (models) {
    TransactionFee.hasMany(models.Transaction);
  };
  return TransactionFee;
};