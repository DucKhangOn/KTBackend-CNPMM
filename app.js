const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const morgan = require('morgan');
const path = require('path');
const handlebars = require('express-handlebars');
const Handlebars = require('handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')
const port = 5000;
const api = require('./routes/api');
const cors = require("cors");

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const allowedOrigins = ["http://localhost:5000", "http://localhost:4200"];
//const allowedOrigins = ["http://127.0.0.1:5500", "http://localhost:5000"];

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

//routes
app.use('/api', api);

//view engine
app.engine('hbs', handlebars({
  handlebars: allowInsecurePrototypeAccess(Handlebars),
  extname: '.hbs',
  defaultLayout: 'layout',
  layoutsDir: __dirname + '/views/layouts'
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
console.log(__dirname);

//init
//app.use(morgan('combined')) 

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/sync', (req, res) => {
  let models = require('./models');
  models.User.sync().then(() => {
    models.Bank.sync();
  }).then(() => {
    models.TransactionFee.sync();
  }).then(() => {
    models.Service.sync();
  }).then(() => {
    models.ExchangeRate.sync();
  }).then(() => {
    models.RateInterest.sync();
  }).then(() => {
    models.BankAccount.sync();
  }).then(() => {
    models.SavingsAccount.sync();
  }).then(() => {
    models.Card.sync();
  }).then(() => {
    models.Transaction.sync();
  }).then(() => {
    res.send('database sync completed!');
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});