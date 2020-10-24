var controller = {};

const { sequelize } = require("../models");
const models = require("../models");

controller.createBankAccount = async (body) => {
  return await sequelize
    .transaction((t) => {
      return models.BankAccount.create({ ...body });
    })
    .then((result) => {
      return result;
    })
    .catch((err) => {
      return err;
    });
};

controller.deleteBankAccountById = async (id) => {
  return await models.BankAccount.destroy({
    where: { id: id },
  });
};

controller.updateBankAccount = async (bankAccount, body) => {
  return await bankAccount
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
  return await models.BankAccount.findAll();
};
controller.FindBankAccountByID = async (id) => {
  return await models.BankAccount.findOne({
    where: { id: id },
  });
};

module.exports = controller;
