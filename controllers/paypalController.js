var controller = {};

const { sequelize } = require("../models");
const models = require("../models");

controller.createPaypalAccount = async (body) => {
  return await sequelize
    .transaction((t) => {
      return models.PaypalAccount.create({ ...body });
    })
    .then((result) => {
      return result;
    })
    .catch((err) => {
      return err;
    });
};

controller.deletePaypalAccountById = async (id) => {
  return await models.PaypalAccount.destroy({
    where: { id: id },
  });
};

controller.updatePaypalAccount = async (paypalAccount, body) => {
  return await paypalAccount.update({
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
  return await models.PaypalAccount.findAll();
};
controller.FindPaypalAccountByID = async (id) => {
  return await models.PaypalAccount.findOne({
    where: { id: id },
  });
};
controller.FindBankAccountUsingSevice=async(bankAccountId)=>{
  return await models.paypalAccount.findOne({
    where:{bankAccountId:bankAccountId},
  })
}

module.exports = controller;
