var controller = {};

const { sequelize } = require("../models");
const models = require("../models");

controller.createCard = async (body) => {
  return await sequelize
    .transaction((t) => {
      return models.Card.create({ ...body });
    })
    .then((result) => {
      return result;
    })
    .catch((err) => {
      return err;
    });
};

controller.deleteCardId = async (id) => {
  return await models.Card.destroy({
    where: { id: id },
  });
};

controller.updateCard = async (card, body) => {
  return await card
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
  return await models.Card.findAll();
};
controller.FindCardByID = async (id) => {
  return await models.Card.findOne({
    where: { id: id },
  });
};

module.exports = controller;
