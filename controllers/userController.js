var controller={}

var models = require('../models');

controller.signUp= function(body,callback){
    models.User.create({
        email: body.email,
        password: body.password,
    })
    .then(function (user) {
        callback(null,user);
    })
    .catch(function (err) {
        if (err) throw err;
    });
};

module.exports = controller;