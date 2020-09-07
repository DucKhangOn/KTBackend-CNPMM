var express= require('express');
var router= express.Router();
var bodyParser = require('body-parser')
var userController= require('../controllers/userController');
 
 
// create application/json parser
var jsonParser = bodyParser.json()
 
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

router.get('/sign-up',(req,res)=>{
    res.render('sign-up');
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


module.exports = router;