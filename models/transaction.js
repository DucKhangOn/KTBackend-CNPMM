'use strict';
module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    sourceBank: DataTypes.STRING,
    desBank: DataTypes.STRING,
    type:DataTypes.STRING,
    status:DataTypes.STRING,
    comment:DataTypes.STRING,
    }, {});
  Transaction.associate = function (models) {
      Transaction.belongsTo(models.BankAccount, { foreignKey: "id" });
      Transaction.belongsTo(models.TransactionFee, { foreignKey: "id" });
  };
  return Transaction;
};