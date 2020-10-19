var controller = {};

const { sequelize } = require("../models");
const models = require("../models");

controller.createBank = async (body) => {
  return await sequelize
    .transaction((t) => {
      return models.Bank.create({ ...body });
    })
    .then((result) => {
      return result;
    })
    .catch((err) => {
      return err;
    });
};

controller.deleteBankById = async (id) => {
  return await models.Bank.destroy({
    where: { id: id },
  });
};

controller.updateBank = async (bank, body) => {
  return await bank
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
  return await models.Bank.findAll();
};
controller.FindBankByID = async (id) => {
  return await models.Bank.findOne({
    where: { id: id },
  });
};

module.exports = controller;
