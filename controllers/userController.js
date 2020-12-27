var controller = {};

const { sequelize } = require("../models");
const models = require("../models");

//Create (Register)
controller.createUser = async (body) => {
  return await sequelize
    .transaction((t) => {
      return models.User.create({ ...body, isAdmin: false });
    })
    .then((result) => {
      return result;
    })
    .catch((err) => {
      return err;
    });
};
//Read
controller.FindAllUser = async () => {
  return await models.User.findAll({
    attributes: ["id", "email", "password"],
  });
};
controller.FindAll = async () => {
  return await models.User.findAll();
};

controller.findUserById = async (id) => {
  return await models.User.findOne({
    where: { id: id },
  });
};

controller.findUserByEmail = async (email) => {
  return await models.User.findOne({ where: { email: email } });
};

//Change Password
controller.updatePassword = async (user, newPassword) => {
  return await user
    .update({
      password: newPassword
    })
    .then((result) => {
      return result;
    })
    .catch((err) => {
      return err;
    });
};

//Update
controller.updateUser = async (user, body) => {
  return await user
    .update({
      firstName: body.firstName,
      lastName: body.lastName,
      phone: body.phone,
      gender: body.gender,
      address: body.address,
      isAdmin: body.isAdmin
    })
    .then((result) => {
      return result;
    })
    .catch((err) => {
      return err;
    });
};

//Delete
controller.deteleUserById = async (id) => {
  return await models.User.destroy({
    where: { id: id },
  });
};

module.exports = controller;
