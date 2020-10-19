var controller = {};

const { sequelize } = require("../models");
const models = require("../models");

controller.createTransactionFee = async (body) => {
  return await sequelize
    .transaction((t) => {
      return models.TransactionFee.create({ ...body });
    })
    .then((result) => {
      return result;
    })
    .catch((err) => {
      return err;
    });
};

controller.deleteTransactionFeeById = async (id) => {
  return await models.TransactionFee.destroy({
    where: { id: id },
  });
};

controller.updateTransactionFee = async (transactionFee, body) => {
  return await transactionFee
    .update({
      ...body,
    })
    .then((result) => {
      return result;
    })
    .catch((err) => {
      return err;
    });
};
controller.FindAll = async () => {
  return await models.TransactionFee.findAll();
};
controller.FindTransactionFeeByID = async (id) => {
  return await models.TransactionFee.findOne({
    where: { id: id },
  });
};

module.exports = controller;
