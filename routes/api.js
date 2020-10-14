const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const userController = require('../controllers/userController');
const bcrypt = require('bcrypt')

//----------------------------UserController {6..152}
//----Methor Post
//Check Login
router.post('/users/login', async (req, res) => {
    const user = await userController.findUserByEmail(req.body.email);
    if (user == null) {
        console.log('Not found!');
    } else {
        var isMatch = await bcrypt.compare(req.body.password, user.password);
        console.log(isMatch);
        if (isMatch) {
            jwt.sign({ user }, 'kkkk', { expiresIn: '0.5h' }, (err, token) => {
                res.json({
                    token,
                    user
                });
            });
        }
        else {
            res.json({
                message: "Login failed"
            });
        }
    }
});

//Register
router.post('/users/register', async (req, res) => {
    try {
        await bcrypt.hash(req.body.password, 10, async (err, hash) => {
            req.body.password = hash;
            let newUser = await userController.createUser(req.body);
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
        });
    } catch (error) {
        res.json({
            result: 'failed',
            user: {},
            message: `Insert a new User failed. Error: ${error}`
        });
    }
});

//Create a User
router.post('/users', async (req, res) => {
    try {
        let newUser = await userController.createUser(req.body);
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

//----Methor Put
//Update a User
router.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { email, password } = req.body;
    try {
        let user = await userController.findUserById(id);
        if (user) {
            await userController.updateUser(user, req.body);
            res.json({
                result: 'ok',
                data: user,
                message: "update a User successfully"
            });
        } else {
            res.json({
                result: 'failed',
                data: {},
                message: "Cannot find User to update"
            });
        }
    } catch (error) {
        res.json({
            result: 'failed',
            data: {},
            message: `Cannot update a User. Error: ${error}`
        });
    }
});

//----Methor Put
//Delete a User
router.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await userController.deteleUser(id);
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

//----Methor Get
//Get All Users
router.get('/users', async (req, res) => {
    try {
        const users = await userController.FindAll();
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

//Get User By Id
router.get('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await userController.findUserById(id);
        res.json({
            result: 'ok',
            user: user,
            message: "query a User successfully",
        });
    } catch (error) {
        res.json({
            result: 'failed',
            user: [],
            length: 0,
            message: `query a User failed. Error: ${error}`,
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