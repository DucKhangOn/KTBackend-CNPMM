var controller = {};

const { sequelize } = require("../models");
const models = require("../models");

controller.createSavingsAccount = async (body) => {
  return await sequelize
    .transaction((t) => {
      return models.SavingsAccount.create({ ...body });
    })
    .then((result) => {
      return result;
    })
    .catch((err) => {
      return err;
    });
};

controller.deleteSavingsAccountId = async (id) => {
  return await models.SavingsAccount.destroy({
    where: { id: id },
  });
};

controller.updateSavingsAccount = async (savingsAccount, body) => {
  return await savingsAccount
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
  return await models.SavingsAccount.findAll();
};
controller.FindSavingsAccountByID = async (id) => {
  return await models.SavingsAccount.findOne({
    where: { id: id },
  });
};
controller.FindSavingsAccountByCarNumber = async (number) => {
  return await models.SavingsAccount.findOne({
    where: { number: number },
  });
};
controller.FindSavingsAccountByBankAccountId = async (BankAccountId) => {
  return await models.SavingsAccount.findAll({
    where: { BankAccountId: BankAccountId },
  });
};


module.exports = controller;
