var controller = {};

const { sequelize } = require("../models");
const models = require("../models");

controller.createService = async (body) => {
  return await sequelize
    .transaction((t) => {
      return models.Service.create({ ...body });
    })
    .then((result) => {
      return result;
    })
    .catch((err) => {
      return err;
    });
};

controller.deleteServiceById = async (id) => {
  return await models.Service.destroy({
    where: { id: id },
  });
};

controller.updateService = async (service, body) => {
  return await service
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
  return await models.Service.findAll();
};
controller.FindServiceByID = async (id) => {
  return await models.Service.findOne({
    where: { id: id },
  });
};

module.exports = controller;
