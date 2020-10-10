const express = require('express');
const router = express.Router();
const models = require('../models');
const jwt = require('jsonwebtoken');

//Login
router.post('/users/login', async (req, res) => {
    let { email, password } = req.body;

    const user = await models.User.findOne({ where: { email: email, password: password } });
    if (user === null) {
        console.log('Not found!');
    } else {
        jwt.sign({ user }, 'kkkk', { expiresIn: '0.5h' }, (err, token) => {
            res.json({
                token,
                user
            });
        });
    }
});

//Create User
router.post('/users', async (req, res) => {
    let { email, password } = req.body;
    try {
        let newUser = await models.User.create({
            email,
            password
        }, {
            fields: ["email", "password"]
        });
        if (newUser) {
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
    } catch (error) {
        res.json({
            result: 'failed',
            user: {},
            message: `Insert a new User failed. Error: ${error}`
        });
    }
});

//Update data in DB
router.put('/users/:id', async (req, res) => {
    const {id} = req.params;
    const { email, password } = req.body;
    try {
        let users = await models.User.findAll({
            attributes: ['id', 'email', 'password'],
            where: {
                id
            }
        });
        if(users.length > 0) {
            users.forEach(async (user) => {
              await user.update({
                  email: email ? email : user.email,
                  password: password ? password : user.password,
              });  
            });
            res.json({
                result: 'ok',
                data: users,
                message: "update a User successfully"
            });
        } else {
            res.json({
                result: 'failed',
                data: {},
                message: "Cannot find User to update"
            });
        }
    } catch(error) {
        res.json({
            result: 'failed',
            data: {},
            message: `Cannot update a User. Error: ${error}`
        });
    }
});

//Delete a User
router.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await models.User.destroy({
            where: {
                id: id
            }
        });
        res.json({
            result: 'ok',
            message: "Delete a User successfully",
            id: id
        });	
    } catch (error) {
        res.json({
            result: 'failed',
            data: {},
            message: `Delete a User failed. Error: ${error}`
        });
    }
});

//Get Users with verifyToken
// router.get('/users', verifyToken, (req, res) => {
//     jwt.verify(req.token, 'kkkk', async (err, authData) => {
//         if (err) {
//             res.sendStatus(403);
//         } else {
//             try {
//                 const users = await models.User.findAll({
//                     attributes: ['id', 'email', 'password'],
//                 });
//                 res.json({
//                     result: 'ok',
//                     user: users,
//                     length: users.length,
//                     message: "query list of Users successfully",
//                     authData
//                 });
//             } catch (error) {
//                 res.json({
//                     result: 'failed',
//                     user: [],
//                     length: 0,
//                     message: `query list of Users failed. Error: ${error}`,
//                     authData
//                 });
//             }
//         }
//     });

// });

//Get all Users
router.get('/users', async (req, res) => {
    try {
        const users = await models.User.findAll({
            attributes: ['id', 'email', 'password'],
        });
        res.json({
            result: 'ok',
            user: users,
            length: users.length,
            message: "query list of Users successfully",
        });
    } catch (error) {
        res.json({
            result: 'failed',
            user: [],
            length: 0,
            message: `query list of Users failed. Error: ${error}`,
        });
    }
});

//Verify Token
function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        // Forbidden
        res.sendStatus(403);
    }
}

module.exports = router;