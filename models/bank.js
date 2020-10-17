'use strict';
module.exports = (sequelize, DataTypes) => {
  const Bank = sequelize.define(
    "Bank",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      isFriend: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    {}
  );
  Bank.associate = function (models) {

  };
  return Bank;
};
