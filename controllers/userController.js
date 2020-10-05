var controller = {}

var models = require('../models');

controller.signUp = function (body, callback) {
    models.User.create({
        email: body.email,
        password: body.password,
    })
        .then(function (user) {
            callback(null, user);
        })
        .catch(function (err) {
            if (err) throw err;
            callback(null);
        });
};

controller.findAll = () => {
    return new Promise((resolve, reject) => {
        models.User
            .findAll({
                attributes: ['email', 'password']
            })
            .then(data => resolve(data))
            .catch(error => reject(new Error(error)));
    });
};

controller.findOne = (email) => {
    return new Promise((resolve, reject) => {
        let Obj = { email: email }
        models.User
            .findOne({ attributes: ['email', 'password'], where: Obj })
            .then(data => resolve(data))
            .catch(error => reject(new Error(error)));
    });
};

controller.deleteOne = async (email, callback) => {
    await models.User.destroy({
        where: {
            email: email
        }
    }).then(function (user) {
        callback(null);
    })
        .catch(function (err) {
            if (err) throw err;
            callback(null);
        });
};

controller.updateOne = async (user) => {
    await models.User.update({
        password: user.password},{
        where: {
            email: user.email
        }
    })
};

module.exports = controller;