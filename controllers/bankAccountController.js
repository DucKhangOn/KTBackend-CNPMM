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

controller.deleteBankAccountByUserId = async (id) => {
  return await models.BankAccount.destroy({
    where: { UserId: id },
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

controller.FindAllCards = async () => {
  return await models.BankAccount.findAll(
    {
      attributes: ['id', 'bankCardNumber', 'UserId']
    }
  );
};

controller.FindBankAccountByID = async (id) => {
  return await models.BankAccount.findOne({
    where: { id: id },
  });
};

controller.FindBankAccountByCardNumber = async (bankCardNumber) => {
  return await models.BankAccount.findOne({
    where: { bankCardNumber: bankCardNumber },
  });
};

controller.FindBankAccountByUserId = async (UserId) => {
  return await models.BankAccount.findOne({
    where: { UserId: UserId },
  });
};

module.exports = controller;
