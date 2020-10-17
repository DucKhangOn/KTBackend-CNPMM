'use strict';
module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    sourceBank: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    desBank: {
      type: DataTypes.STRING,
      allowNull:false,
    },
    amount: {
      type:DataTypes.DOUBLE,
      allowNull: false,
    },
    transactionType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allow: false,
    },
    comment: DataTypes.STRING
  }, {});
  Transaction.associate = function (models) {
    Transaction.belongsTo(models.BankAccount, { foreignKey: "id" });
    Transaction.belongsTo(models.TransactionFee, { foreignKey: "id" });
    Transaction.belongsTo(models.Service, { foreignKey: "id" });
  };
  return Transaction;
};