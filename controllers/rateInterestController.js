var controller = {};

const { sequelize } = require("../models");
const models = require("../models");

controller.createRateInterest = async (body) => {
  return await sequelize
    .transaction((t) => {
      return models.RateInterest.create({ ...body });
    })
    .then((result) => {
      return result;
    })
    .catch((err) => {
      return err;
    });
};

controller.deleteRateInterestById = async (id) => {
  return await models.RateInterest.destroy({
    where: { id: id },
  });
};

controller.updateRateInterest = async (rateInterest, body) => {
  return await rateInterest
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
  return await models.RateInterest.findAll();
};
controller.FindRateInterestByID = async (id) => {
  return await models.RateInterest.findOne({
    where: { id: id },
  });
};

module.exports = controller;
