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


module.exports = controller;