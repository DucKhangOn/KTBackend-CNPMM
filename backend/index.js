const path = require('path');
const express = require('express');
const handlebars = require('express-handlebars');
const Handlebars= require('handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')
const morgan = require('morgan');
var bodyParser = require('body-parser')
const app = express();
const port = 5000;

app.use(express.static(path.join(__dirname, 'resources/public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const api = require('./routes/api');

//routes
app.use('/api', api);

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
   console.log("Hello");
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