var controller = {}

const models = require('../models');

//Create
controller.createUser = async (body) => {
    let { email, password } = body;
    return await models.User.create({
        email,
        password
    }, {
        fields: ["email", "password"]
    });
}
//Read
controller.FindAll = async () => {
    return await models.User.findAll({
        attributes: ['id', 'email', 'password'],
    });
}

controller.findUserById = async (id) => {
    return await models.User.findOne({
        attributes: ['id', 'email', 'password'],
        where: {
            id
        }
    });
}

controller.getUser = async (body) => {
    let { email, password } = body;
    return await models.User.findOne({ where: { email: email, password: password } });
}

controller.findUserByEmail = async (email) => {
    return await models.User.findOne({ where: { email: email } });
}

//Update
controller.updateUser = async (user, body) => {
    let { email, password } = body;
    return await user.update({
        email: email ? email : user.email,
        password: password ? password : user.password
    }
    );
}

//Delete
controller.deteleUser = async (id) => {
    return await models.User.destroy({
        where: {
            id: id
        }
    })
}

module.exports = controller;