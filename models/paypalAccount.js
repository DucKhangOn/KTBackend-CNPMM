"use strict";
module.exports = (sequelize, DataTypes) => {
  const PaypalAccount = sequelize.define(
    "PaypalAccount",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      bankAccountId:{
        type: DataTypes.INTEGER,
        allowNull:false,
        unique: true,
      },
      client_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      client_secret: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {}
  );
  PaypalAccount.associate = function (models) {};
  return PaypalAccount;
};
