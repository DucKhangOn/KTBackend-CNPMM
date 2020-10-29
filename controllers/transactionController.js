var controller = {};

const { sequelize } = require("../models");
const models = require("../models");

controller.createTransaction = async (body) => {
  return await sequelize
    .transaction((t) => {
      return models.Transaction.create({ ...body });
    })
    .then((result) => {
      return result;
    })
    .catch((err) => {
      return err;
    });
};

controller.deleteTransactionById = async (id) => {
  return await models.Transaction.destroy({
    where: { id: id },
  });
};

controller.updateTransaction = async (transaction, body) => {
  return await transaction
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
  return await models.Transaction.findAll();
};
controller.FindTransactionByID = async (id) => {
  return await models.Transaction.findOne({
    where: { id: id },
  });
};

module.exports = controller;
