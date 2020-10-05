var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser')
var userController = require('../controllers/userController');
require('isomorphic-fetch');

// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

// ---------------------------SIGN-UP---------------------------//
router.get('/sign-in', (req, res) => {
    res.render('sign-up-in');
})
router.get('/sign-up', (req, res) => {
    res.render('sign-up-in');
})
router.post('/sign-up', urlencodedParser, (req, res) => {
    console.log(req.body.email);
    var user = {
        email: req.body.email,
        password: req.body.password
    }
    userController.signUp(user, function (err, us) {
        if (err) throw err;
        console.log("ThanhCongNha");
    })
    res.render('home');
})

router.post('/sign-in', urlencodedParser, (req, res) => {
    console.log(req.body.email);
    var user = {
        email: req.body.email,
        password: req.body.password
    }
    // FIND-ONE
    userController.findOne(user.email).then(data => {
        if(data){
            if (data.password == user.password)
                //set session
                res.redirect('/');
        }
        else {
            console.log('Dang nhap that bai');
        }
    });

    // UPDATE-USER
    // userController.updateOne(user);
    // res.render('home');

    // DELETE-USER
    // userController.deleteOne(user.email).then(data => {
    //     if(data){
    //         console.log('Xoa thanh cong')
    //     }
    //     else {
    //         console.log('Xoa that bai');
    //     }
    // });

})

router.post('/sign-in', urlencodedParser, (req, res) => {

    res.render('home');
})

//---------------------------USER-MANAGE---------------------------//
router.get('/manage-user', (req, res) => {
    userController.findAll()
        .then(data => {
            res.locals.listUsers = data;
            res.render('manage-user');
        })
})

router.get('/thongtin',async (req,res)=>{
    try{
        const users= await userController.findAll();
        console.log(users);
        res.json(users);
    }catch (err){
        res.json({message:err});
    }
})

module.exports = router;