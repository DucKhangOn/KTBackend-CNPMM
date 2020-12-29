var controller = {};

const { sequelize } = require("../models");
const models = require("../models");

controller.createBankSavingBook = async (body) => {
  return await sequelize
    .transaction((t) => {
      return models.BankSavingBook.create({ ...body });
    })
    .then((result) => {
      return result;
    })
    .catch((err) => {
      return err;
    });
};

controller.deleteBankSavingBookById = async (id) => {
  return await models.BankSavingBook.destroy({
    where: { id: id },
  });
};

controller.updateBankSavingBook = async (bankSavingBook, body) => {
  return await bankSavingBook
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
controller.updateActivity = async (bankSavingBook, info) => {
  return await bankSavingBook
    .update({
      prevBalance: info.prevBalance,
      afterBalance: info.afterBalance,
      withdrawalDate: info.withdrawalDate,
      isActivity: false,
    })
    .then((result) => {
      return result;
    })
    .catch((err) => {
      return err;
    });
};
controller.FindAll = async () => {
  return await models.BankSavingBook.findAll();
};
controller.FindBankSavingBookByID = async (id) => {
  return await models.BankSavingBook.findOne({
    where: { id: id },
  });
};
controller.FindSavingAccountsByBankCardNumber = async (bankCardNumber) => {
  return await models.BankSavingBook.findAll({
    where: { bankCardNumber: bankCardNumber },
  });
};

module.exports = controller;
