const path = require('path');
const express = require('express');
const handlebars = require('express-handlebars');
const Handlebars= require('handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')
const morgan = require('morgan');
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'resources/public')));


const users = require('./routes/users');

//routes
app.use('/users',users);

//view engine
app.engine('hbs', handlebars({
  handlebars: allowInsecurePrototypeAccess(Handlebars),
  extname: '.hbs'
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources/views'));
console.log(__dirname);

//init
//app.use(morgan('combined')) 

app.get('/', (req, res) => {
  return res.render('home');
});

app.get('/sync', (req, res) => {
  let models = require('./models');
  models.sequelize.sync()
  .then(()=>{
      res.send('database sync completed!');
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});