const path = require('path');
const express = require('express');
const handlebars = require('express-handlebars');
const Handlebars= require('handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')
const morgan = require('morgan');
const app = express();
const port = 4200;

const cors = require("cors");

app.use(express.static(path.join(__dirname, 'resources/public')));

const allowedOrigins = ["http://localhost:3000", "http://localhost:4200"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        var msg =
          "The CORS policy for this site does not " +
          "allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    }
  })
); 

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
   res.render('home');
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