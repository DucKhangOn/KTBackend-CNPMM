var controller = {};

const { sequelize } = require("../models");
const models = require("../models");

controller.createExchangeRate = async (body) => {
  return await sequelize
    .transaction((t) => {
      return models.ExchangeRate.create({ ...body });
    })
    .then((result) => {
      return result;
    })
    .catch((err) => {
      return err;
    });
};

controller.deleteExchangeRateById = async (id) => {
  return await models.ExchangeRate.destroy({
    where: { id: id },
  });
};

controller.updateExchangeRate = async (exchangeRate, body) => {
  return await exchangeRate
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
  return await models.ExchangeRate.findAll();
};
controller.FindExchangeRateByID = async (id) => {
  return await models.ExchangeRate.findOne({
    where: { id: id },
  });
};

module.exports = controller;
