const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const port = 5000;
const api = require("./routes/api");
const cors = require("cors");

app.use(express.static(path.join(__dirname, "public")));
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
    },
  })
);

//routes
app.use("/api", api);

app.get("/sync", async (req, res) => {
  let models = require("./models");
  await models.User.sync()
    .then(async () => {
      await models.BankAccount.sync();
    })
    .then(() => {
      res.send("database sync completed!");
    });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
