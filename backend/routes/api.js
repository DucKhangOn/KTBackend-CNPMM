var express = require('express');
var router = express.Router();
const models = require('../models');

//User
router.post('/users', async (req, res) => {
    let { email, password } = req.body;
    try {
        let newUser = await models.User.create({
            email,
            password
        },{
                fields: ["email", "password"]
        });
        if(newUser) {
            res.json({
                result: 'ok',
                user: newUser
            });
        } else {
            res.json({
                result: 'failed',
                user: {},
                message: `Insert a new User failed`
            });
        }
    } catch(error) {
        res.json({
            result: 'failed',
            user: {},
            message: `Insert a new User failed. Error: ${error}`
        });
    }    
});

router.get('/users', async (req, res) => {
    try {
        const users = await models.User.findAll({
            attributes: ['id', 'email', 'password'],
        });
        res.json({
            result: 'ok',
            user: users,
            length: users.length,
            message: "query list of Users successfully"
        });
    } catch (error) {
        res.json({
            result: 'failed',
            user: [],
            length: 0,
            message: `query list of Users failed. Error: ${error}`
        });
    }
});

module.exports = router;