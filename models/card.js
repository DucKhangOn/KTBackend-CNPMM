'use strict';
module.exports = (sequelize, DataTypes) => {
  const Card = sequelize.define('Card', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    cardNumber: {
      type:DataTypes.STRING,
      allowNull: false,
    },
    expiredDate:{
      type: DataTypes.DATE,
      allowNull:false
    } ,
    isLocked: {
      type:DataTypes.BOOLEAN,
      allowNull: false,
    },
    type:{
      type: DataTypes.STRING,
      allowNull:false,
    },
    BankAccountId:{
      type:DataTypes.INTEGER,
      allowNull: false,
    }
  }, {});
  Card.associate = function (models) {
    Card.belongsTo(models.BankAccount, { foreignKey: "BankAccountId" });
  };
  return Card;
};
