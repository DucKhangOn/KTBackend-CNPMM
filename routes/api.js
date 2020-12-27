const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

//Controller
const userController = require("../controllers/userController");
const bankAccountController = require("../controllers/bankAccountController");

//----------------------------------------------
const paypal = require("paypal-rest-sdk");

const KTBANK_dBank = {
  client_id:
    "AcF0kj5czGiFt428I_VxKAk7BwGD9hNQNumG4IfljYn7wqFBYMIg9czAqZwl3DcBLi1EH6SdCmysQjEi",
  client_secret:
    "EHCelxB0xISwq_3NrV6-Mr1xhcUSIF0WpCgBXXXyk69RLULkQgpsUArhdpXTs7E2Q9ZugVHPXK7Wyoht",
};
//----------------------------------------------
const KTBANK_stripe = {
  public_key:
    "pk_test_51HkBR4FxWvodV66aUf4fbEIxVYHx33ehugmaiSoPoPGf7b2nqa8YBJzbf4g2wYq6C9y8RRKGA0Yt4MnNBxqSdl4R00V0L4uHwW",
  secret_key:
    "sk_test_51HkBR4FxWvodV66a1jhVQe2kse7uIYcqaqvptULavgWLTA6WSuwyT86SqPCxmp7hZh2O4zmNJmMecxJTJel13w9200c21nNwZ8",
};

const stripe = require("stripe")(KTBANK_stripe.secret_key);

//----------------------------UserController
//----Methor Post
//Check Login (hash password)
router.post("/users/login", async (req, res) => {
  const user = await userController.findUserByEmail(req.body.email);
  if (user == null) {
    console.log("Not found!");
  } else {
    var isMatch = await bcrypt.compare(req.body.password, user.password);
    console.log(isMatch);
    if (isMatch) {
      jwt.sign({ user }, "kkkk", { expiresIn: "0.5h" }, (err, token) => {
        res.json({
          token,
          user,
        });
      });
    } else {
      res.json({
        message: "Login failed",
      });
    }
  }
});

//Create a User(hash password)
router.post("/users/register", async (req, res) => {
  console.log(req.body);
  try {
    await bcrypt.hash(req.body.password, 10, async (err, hash) => {
      req.body.password = hash;
      let newUser = await userController.createUser(req.body);

      if (newUser.errors != null) {
        res.json({ result: "failed", user: newUser.errors });
      } else {
        let userCheck = await userController.findUserByEmail(req.body.email);
        //const card = randomNumberBankCard();
        const card = randomEnum(req.body.nameBank)
        console.log(card);
        const tempBody = {
          bankCardNumber: card,
          balance: 1,
          branch: "KTBank",
          UserId: userCheck.id,
        };
        let newbankAccount = await bankAccountController.createBankAccount(
          tempBody
        );
        console.log(newbankAccount);
        newbankAccount.errors
          ? res.json({
            result: "failed",
            newbankAccount: newbankAccount,
            newUser: newUser,
          })
          : res.json({
            result: "ok",
            newbankAccount: newbankAccount,
            newUser: newUser,
          });
      }
    });
  } catch (error) {
    res.json({
      result: "failed",
      user: {},
      message: `Insert a new User failed. Error: ${error}`,
    });
  }
});

//Generate bankAccount
const BankAccountEnum = {
  Ktbank: "KTB",
  Vietcombank: "VCB",
  Agribank: "AGB",
  Acb: "ACB",
  Sacombank: "SCB",
};

function randomEnum(value) {
  return (
    BankAccountEnum[value] + "-" + makenum(4) + "-" + makeid(3) + "-" + makenum(3)
  )
}

function makenum(length) {
  var result = "";
  var characters = "0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

//Hàm tạo số ngâu nhiên
function makeid(length) {
  var result = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

//Create a User
router.post("/users", async (req, res) => {
  const data = req.body;
  console.log(data);
  try {
    let newUser = await userController.createUser(data.user);
    newUser.errors
      ? res.json({ result: "failed", user: newUser })
      : res.json({ result: "ok", user: newUser });
  } catch (error) {
    res.json({
      result: "failed",
      user: {},
      message: `Insert a new User failed. Error: ${error}`,
    });
  }
});

//----Methor Put
//Update a User
router.put("/users/:id", async (req, res) => {
  var data = req.body;
  console.log(data.user);
  const { id } = req.params;
  try {
    let user = await userController.findUserById(id);
    if (user) {
      await bcrypt.hash(data.user.password, 10, async (err, hash) => {
        data.user.password = hash;
        await userController.updateUser(user, data.user);
        res.json({
          result: "ok",
          data: user,
          message: "update a User successfully",
        });
      });
    } else {
      res.json({
        result: "failed",
        data: {},
        message: "Cannot find User to update",
      });
    }
  } catch (error) {
    res.json({
      result: "failed",
      data: {},
      message: `Cannot update a User. Error: ${error}`,
    });
  }
});

//----Methor Delete
//Delete a User
router.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await bankAccountController.deleteBankAccountByUserId(id);
    await userController.deteleUserById(id);
    res.json({
      result: "ok",
      message: "Delete a User successfully",
      id: id,
    });
  } catch (error) {
    res.json({
      result: "failed",
      data: {},
      message: `Delete a User failed. Error: ${error}`,
    });
  }
});

//----Methor Get
//Get All Info User
router.get("/users/info", async (req, res) => {
  try {
    const users = await userController.FindAll();
    res.json({
      result: "ok",
      user: users,
      length: users.length,
      message: "query list of Users successfully",
    });
  } catch (error) {
    res.json({
      result: "failed",
      user: [],
      length: 0,
      message: `query list of Users failed. Error: ${error}`,
    });
  }
});

//Get All Users
router.get("/users", async (req, res) => {
  try {
    const users = await userController.FindAll();
    res.json({
      result: "ok",
      user: users,
      length: users.length,
      message: "query list of Users successfully",
    });
  } catch (error) {
    res.json({
      result: "failed",
      user: [],
      length: 0,
      message: `query list of Users failed. Error: ${error}`,
    });
  }
});

//Get User By Id
router.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userController.findUserById(id);
    user
      ? res.json({
        result: "ok",
        user: user,
        message: "query a User successfully",
      })
      : res.json({
        result: "failed",
        user: {},
        message: "User unvaiable",
      });
  } catch (error) {
    res.json({
      result: "failed",
      user: [],
      length: 0,
      message: `query a User failed. Error: ${error}`,
    });
  }
});

router.get("/bankAccounts/info/:UserId", async (req, res) => {
  const { UserId } = req.params;
  try {
    const bankAccount = await bankAccountController.FindBankAccountByUserId(
      UserId
    );
    bankAccount
      ? res.json({
        result: "ok",
        bankAccount: bankAccount,
        message: "query a bankAccount successfully",
      })
      : res.json({
        result: "failed",
        bankAccount: {},
        message: "bankAccount unvaiable",
      });
  } catch (error) {
    res.json({
      result: "failed",
      bankAccount: [],
      length: 0,
      message: `query a BankAccount failed. Error: ${error}`,
    });
  }
});

//---------------------------Paypal transaction
//Cancel request
router.get("/cancel", (req, res) => {
  res.json({ result: "Your transaction has been canceled" });
});
//Success request có 2 các thực hiện
//C1: truyen transaction /success/:id để lấy parameter để lấy thông tin
//C2: sử dụng section để lưu trữ thông tin
router.post("/success", async (req, res) => {
  try {
    const bankCardNumber = req.body.bankCardNumber;
    var amount = req.body.amount;
    var paymentId = req.body.paymentId;
    var payerId = { payer_id: req.body.PayerID };
    console.log(req.params);
    console.log(amount + "-  Success  - " + bankCardNumber);
    await paypal.payment.execute(
      paymentId,
      payerId,
      async function (error, payment) {
        if (error) {
          console.error(JSON.stringify(error));
          res.json({ result: "cancel" });
        } else {
          if (payment.state == "approved") {
            console.log("payment completed successfully");
            let bankAccount = await bankAccountController.FindBankAccountByCardNumber(
              bankCardNumber
            );
            console.log(bankAccount.balance + "     am: " + amount);
            var newAmount = bankAccount.balance + parseInt(amount);
            console.log(bankAccount.balance + "    sadxxaam: " + newAmount);
            let tempBody = { balance: newAmount };
            await bankAccountController.updateBankAccount(
              bankAccount,
              tempBody
            );
            res.json({ result: "oke" }); //Truyền thêm data
          } else {
            console.log("payment not successful");
            res.json({ result: "cancel" });
          }
        }
      }
    );
  } catch (error) {
    res.json({ result: "cancel" });
  }
});
//belongs to PaypalAccount
//**GET dung cho test backend
//**fix POST de ap dung cho front end
router.post("/paypal", async (req, res) => {
  const bankCardNumber = req.body.bankCardNumber;
  const amount = req.body.amount;
  const dolla = 20000;
  console.log(req.body);
  try {
    await paypal.configure({
      mode: "sandbox", //sandbox or live
      // client_id: [dBank.client_id],
      // client_secret: [dBank.client_secret],
      client_id: KTBANK_dBank.client_id,
      client_secret: KTBANK_dBank.client_secret,
    });

    let create_payment_json = await {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: `http://localhost:4200/page/success?amount=${amount}&bankCardNumber=${bankCardNumber}`, // viết theo success request
        cancel_url: "http://localhost:4200/page/error",
      },
      transactions: [
        {
          item_list: {
            items: [
              {
                name: "Charge Money",
                sku: "item",
                price: Math.ceil(amount / dolla), //body.amount,
                currency: "USD",
                quantity: 1,
              },
            ],
          },
          amount: {
            currency: "USD",
            total: Math.ceil(amount / dolla), //body.amount,
          },
          description: "This is the payment description.",
        },
      ],
    };
    paypal.payment.create(create_payment_json, function (error, payment) {
      if (error) {
        throw error;
      } else {
        console.log(amount + "-  Test  - " + bankCardNumber);
        for (let i = 0; i < payment.links.length; i++) {
          if (payment.links[i].rel === "approval_url") {
            res.json({
              link: payment.links[i].href,
            });
          }
        }
      }
    });
  } catch (error) {
    res.json({
      result: "failed",
      card: [],
      length: 0,
      message: `query a paymentFail failed. Error: ${error}`,
    });
  }
});

//------------------------Stripe transaction
router.get("/stripe", function (req, res) {
  res.json({
    key: KTBANK_stripe.public_key,
  });
});

router.post("/create-checkout-session", async (req, res) => {
  const bankCardNumber = req.body.bankCardNumber;
  const amount = req.body.amount;
  const dolla = 20000;
  console.log(req.body);
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Charge Money",
          },
          unit_amount: Math.ceil(amount / dolla) * 100,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `http://localhost:4200/page/success-stripe?amount=${amount}&bankCardNumber=${bankCardNumber}`,
    cancel_url: "https://example.com/cancel",
  });

  res.json({ id: session.id });
});

router.post("/success-stripe", async (req, res) => {
  console.log(req.body);
  try {
    const bankCardNumber = req.body.bankCardNumber;
    var amount = req.body.amount;
    console.log(req.params);
    console.log(amount + "-  Success  - " + bankCardNumber);
    console.log("payment completed successfully");
    let bankAccount = await bankAccountController.FindBankAccountByCardNumber(
      bankCardNumber
    );
    console.log(bankAccount.balance + "     am: " + amount);
    var newAmount = bankAccount.balance + parseInt(amount);
    console.log(bankAccount.balance + "    sadxxaam: " + newAmount);
    let tempBody = { balance: newAmount };
    await bankAccountController.updateBankAccount(bankAccount, tempBody);
    res.json({ result: "oke" }); //Truyền thêm data
  } catch (error) {
    res.json({ result: "cancel" });
  }
});

//Verify Token
function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    // Forbidden
    res.sendStatus(403);
  }
}

module.exports = router;
