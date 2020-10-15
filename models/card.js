'use strict';
module.exports = (sequelize, DataTypes) => {
  const Card = sequelize.define('Card', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    cardNumber: DataTypes.STRING,
    expiredDate: DataTypes.DATE,
    isLocked: DataTypes.BOOLEAN,
    type: DataTypes.STRING
  }, {});
  Card.associate = function (models) {
    Card.belongsTo(models.BankAccount, { foreignKey: "id" });
  };
  return Card;
};
