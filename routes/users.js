var express= require('express');
var router= express.Router();
var bodyParser = require('body-parser')
var userController= require('../controllers/userController');

// create application/json parser
var jsonParser = bodyParser.json()
 
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

// ---------------------------SIGN-UP---------------------------//
router.get('/sign-in', (req, res) => {
    res.render('sign-up-in');
})
router.post('/sign-up',urlencodedParser,(req,res)=>{
    console.log(req.body.email);
    var user={
        email: req.body.email,
        password: req.body.password
    }
    userController.signUp(user,function(err,us)
    {
        if(err) throw err;
        console.log("ThanhCongNha");
    })
    res.render('home');
})

router.post('/sign-in', urlencodedParser,(req,res)=>{
   
    res.render('home');
})

//---------------------------USER-MANAGE---------------------------//
router.get('/manage-user',(req,res)=>{
   userController.findAll()
   .then(data=>{
       res.locals.listUsers=data;
        res.render('manage-user');
   })      
})

module.exports = router;