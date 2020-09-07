const path = require('path');
const express = require('express');
const handlebars = require('express-handlebars');
const morgan = require('morgan');
const app = express();
const port = 3000;

const users=require('./routes/users');

app.use(express.static(path.join(__dirname, 'public')));

//routes
app.use('/users',users);

//engine
app.engine('hbs', handlebars({
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