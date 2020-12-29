const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

//Controller
const userController = require("../controllers/userController");
const bankAccountController = require("../controllers/bankAccountController");
const bankSavingBookController = require("../controllers/bankSavingBookController");
const rateInterestController = require("../controllers/rateInterestController");
const savingsAccountController = require("../controllers/savingsAccountController");

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
    res.json({
      message: "Login failed",
    });
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
        const card = randomEnum(req.body.nameBank);
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
    BankAccountEnum[value] +
    "-" +
    makenum(4) +
    "-" +
    makeid(3) +
    "-" +
    makenum(3)
  );
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

//Forgot password
router.post("/testMail", async function (req, res) {
  const OTP = req.body.otp;
  const email = req.body.email;
  console.log(req.body);
  var transporter = await nodemailer.createTransport({
    // config mail server
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "KTBankDemoTest@gmail.com",
      pass: "123456@Aa",
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  var content = "";
  content += `
        <div style="padding: 10px; background-color: #003375">
            <div style="padding: 10px; background-color: white;">
                <h4 style="color: #0085ff">Gửi mail với nodemailer và express</h4>
                <span style="color: black">Đây là mã OPT của bạn</span>
                <span>${OTP}</span>
            </div>
        </div>
    `;
  var mainOptions = {
    // thiết lập đối tượng, nội dung gửi mail
    from: "KTBanking nodemailer",
    to: email, //req.body.mail,
    subject: "Test Nodemailer",
    text: "Your text is here",
    html: content,
  };
  transporter.sendMail(mainOptions, function (err, info) {
    if (err) {
      console.log(err);
      res.json({ mess: "Lỗi gửi mail: " + err });
      //res.redirect("/");
    } else {
      console.log("Message sent: " + info.response);
      res.json({
        mess: "Một email đã được gửi đến tài khoản của bạn",
        otp: OTP,
      }); //Gửi thông báo đến người dùng
    }
  });
});

router.post("/testChangePassword", async function (req, res) {
  const email = req.body.email;
  const newPassword = req.body.newPassword;
  console.log(req.body);
  try {
    let user = await userController.findUserByEmail(email);
    console.log(user);
    if (user) {
      await bcrypt.hash(req.body.newPassword, 10, async (err, hash) => {
        req.body.newPassword = hash;
        await userController.updatePassword(user, hash);
        res.json({
          result: "ok",
          message: "Change User's password successfully",
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
      message: `Cannot change User's password. Error: ${error}`,
    });
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

//---------------------------SavingsAccountController
async function createSavingsAccount(req, res) {
  //Check rateInterest
  let rateInterest = await rateInterestController.FindRateInterestByID(
    req.body.RateInterestId
  );
  if (rateInterest != null) {
    //Check bankAccount
    let bankAccount = await bankAccountController.FindBankAccountByID(
      req.body.BankAccountId
    );
    if (bankAccount != null) {
      let newsavingsAccount = await savingsAccountController.createSavingsAccount(
        req.body
      );
      newsavingsAccount.errors
        ? res.json({ result: "failed", savingsAccount: newsavingsAccount })
        : res.json({ result: "ok", savingsAccount: newsavingsAccount });
    } else {
      res.json({
        result: "failed",
        data: {},
        message: `BankAccount invaiable. Please choose another bankAccount`,
      });
    }
  } else {
    res.json({
      result: "failed",
      data: {},
      message: `RateInterest invaiable. Please choose another rateInterest`,
    });
  }
}
//----------------------TestCode
router.post("/test", async (req, res) => {
  console.log(req.body);
  try {
    result = await testFinancialCapacity(req, res);
    if (result == false) {
      res.json({
        result:
          "Số dư trong tài khoản quỷ khách không đủ để thực hiện giao dịch",
      });
    } else {
      res.json({
        result: result,
      });
    }
  } catch (err) {
    res.json({
      result: false,
      data: err,
    });
  }
});
//--------------------add Saving Card
router.post("/testSavingCard", async (req, res) => {
  try {
    //Lấy sổ tiết kiệm của khách hàng
    const rootBankSavingBook = await bankSavingBookController.FindBankSavingBookByID(
      req.body.bankSavingBookID
    );
    console.log(rootBankSavingBook.isActivity + "-----------------");
    if (rootBankSavingBook.isActivity == "false") {
      res.json({
        result: true,
        data: "Đã tất toán",
      });
    } else {
      const pkey = rootBankSavingBook.savingAccountNumber; //key root
      const fkey = rootBankSavingBook.savingAccountNumber; //key child
      withdrawalDate = req.body.withdrawalDate;
      const length = { length: rootBankSavingBook.length };

      //console.log(length.length+"asdasd")

      const lastAccount = await addLinkedListForSavingBook(
        withdrawalDate,
        fkey,
        length
      );
      await bankSavingBookController.updateBankSavingBook(
        rootBankSavingBook,
        length
      );
      const rootAccount = await savingsAccountController.FindSavingsAccountByCarNumber(
        pkey
      );

      const info = {
        prevBalance: rootAccount.prevBalance,
        afterBalance: lastAccount.balance,
        withdrawalDate: withdrawalDate,
      };
      await bankSavingBookController.updateActivity(rootBankSavingBook, info);
      const bankAccount = await bankAccountController.FindBankAccountByCardNumber(
        rootBankSavingBook.bankCardNumber
      );
      await bankAccountController.updateBankAccount(bankAccount, {
        balance: bankAccount.balance + lastAccount.balance,
      });

      console.log("-------data-final---");
      console.log(info);

      res.json({
        result: true,
        inform: "Dịch vụ thành công",
        length: length.length,
        data: data,
      });
    }
  } catch (error) {
    res.json({
      result: false,
      data: error,
    });
  }
});

router.post("/testSavingCardReview", async (req, res) => {
  console.log(req.body);
  try {
    //Lấy sổ tiết kiệm của khách hàng
    const rootBankSavingBook = await bankSavingBookController.FindBankSavingBookByID(
      req.body.bankSavingBookID
    );
    const pkey = rootBankSavingBook.savingAccountNumber; //key root
    const fkey = rootBankSavingBook.savingAccountNumber; //key child
    withdrawalDate = req.body.withdrawalDate;
    const length = { length: rootBankSavingBook.length };
    const data = {};
    const rootAccount = await savingsAccountController.FindSavingsAccountByCarNumber(
      pkey
    );
    data[0] = rootAccount.dataValues;

    await addLinkedListForSavingBookReview(withdrawalDate, fkey, length, data);

    res.json({
      result: true,
      inform: "Dịch vụ thành công",
      length: length.length,
      data: data,
    });
  } catch (error) {
    res.json({
      result: false,
      data: error,
    });
  }
});

//Tính tiền lãi cho khách hàng bằng link list
async function addLinkedListForSavingBookReview(
  withdrawalDate,
  key,
  length,
  datajs
) {
  //Lấy tài khoản gốc của khách hàng
  var rootSavingAccount = {};
  rootSavingAccount = datajs[length.length - 1];
  //Kiểm tra các biến ** withdrawalDate,isFinalSettlement,childOf
  //Nếu có biến withdrawalDate thì tiến hành tính tiền và chuyển isFinalSettlement thành true
  //Kích hoạt childOf để đẩy
  //Tăng length mỗi lần tạo thêm tk mới

  if (
    format.asString("MM-dd-yyyy", rootSavingAccount.depositDate) ==
    withdrawalDate
    // ||
    // (rootSavingAccount.childOf != null)
  )
    return datajs;
  else {
    const start = format.asString("MM-dd-yyyy", rootSavingAccount.depositDate);

    let end;
    try {
      end = format.asString("MM-dd-yyyy", withdrawalDate);
    } catch {
      end = format.asString(withdrawalDate);
    }

    const duration = datediff(parseDate(start), parseDate(end));
    var temp = await rateInterestController.getRateByDay(
      format.asString("MM-dd-yyyy", rootSavingAccount.depositDate),
      rootSavingAccount.term
    );
    if (duration < rootSavingAccount.term * 30) {
      //Lãi suất không kì hạn
      rootSavingAccount.balance =
        rootSavingAccount.balance +
        (rootSavingAccount.balance * duration * 0.001) / 365; //0.1%
      rootSavingAccount.withdrawalDate = new Date(Date.parse(end));
    } else {
      rootSavingAccount.balance =
        rootSavingAccount.balance * (1 + temp.rateInterest / 100);
      rootSavingAccount.withdrawalDate = new Date(
        Date.parse(dateAdd(start, rootSavingAccount.term * 30))
      );
    }
    //await rateInterestController.getRateByDay(rootSavingAccount.withdrawalDate, rootSavingAccount.term)

    numberhind = length.length;
    rootSavingAccount.childOf = numberhind;
    datajs[length.length - 1] = rootSavingAccount;
    datajs[length.length - 1].rateInterest = temp.rateInterest;
    key = numberhind;

    datajs[length.length] = {
      number: numberhind,
      hasTerm: rootSavingAccount.hasTerm,
      term: rootSavingAccount.term,
      prevBalance: rootSavingAccount.balance,
      balance: rootSavingAccount.balance,
      depositDate: rootSavingAccount.withdrawalDate,
      withdrawalDate: null,
      isFinalSettlement: rootSavingAccount.isFinalSettlement,
      itemChosen: rootSavingAccount.itemChosen,
      childOf: null,
      BankAccountId: rootSavingAccount.BankAccountId,
      rateInterest: 0,
    };

    length.length = length.length + 1;
    return await addLinkedListForSavingBookReview(
      withdrawalDate,
      key,
      length,
      datajs
    );
  }
}
//----------------------------------
router.post("/getChildOfSavingCard", async (req, res) => {
  const fkey = await findCardChildOf(req.body.BankCard);
  // const data={0: {fkey:fkey}};
  //data[1]={data: "testing"}
  res.json({
    //res:data
    data: fkey,
  });
});
//Get ChildCard
async function findCardChildOf(fkey) {
  const rSavingAccount = await savingsAccountController.FindSavingsAccountByCarNumber(
    fkey
  );
  if (rSavingAccount.childOf == null) return fkey;
  else return findCardChildOf(rSavingAccount.childOf);
}

router.post("/getAllInfo", async (req, res) => {
  var tlen = 0;
  var data = { rootCardNumber: req.body.BankCard };
  const datajs = await findAllInfo(req.body.BankCard, data, tlen);
  res.json(datajs);
});
//Get All Info ChildCard
async function findAllInfo(fkey, datajs, length) {
  const rSavingAccount = await savingsAccountController.FindSavingsAccountByCarNumber(
    fkey
  );
  if (rSavingAccount.childOf == null) {
    datajs[length] = rSavingAccount;
    return datajs;
  } else {
    datajs[length] = rSavingAccount;
    length++;
    return findAllInfo(rSavingAccount.childOf, datajs, length);
  }
}

//Tính tiền lãi cho khách hàng bằng link list
async function addLinkedListForSavingBook(withdrawalDate, key, length) {
  //Lấy tài khoản gốc của khách hàng
  const rootSavingAccount = await savingsAccountController.FindSavingsAccountByCarNumber(
    key
  );
  //Kiểm tra các biến ** withdrawalDate,isFinalSettlement,childOf
  //Nếu có biến withdrawalDate thì tiến hành tính tiền và chuyển isFinalSettlement thành true
  //Kích hoạt childOf để đẩy
  //Tăng length mỗi lần tạo thêm tk mới
  //console.log(format.asString("MM-dd-yyyy", rootSavingAccount.depositDate) == withdrawalDate)
  if (
    format.asString("MM-dd-yyyy", rootSavingAccount.depositDate) ==
      withdrawalDate ||
    rootSavingAccount.childOf != null
  )
    return rootSavingAccount;
  else {
    const start = format.asString("MM-dd-yyyy", rootSavingAccount.depositDate);
    let end;
    try {
      end = format.asString("MM-dd-yyyy", withdrawalDate);
    } catch {
      end = format.asString(withdrawalDate);
    }
    const duration = datediff(parseDate(start), parseDate(end));
    var temp = await rateInterestController.getRateByDay(
      format.asString("MM-dd-yyyy", rootSavingAccount.depositDate),
      rootSavingAccount.term
    );
    if (duration < rootSavingAccount.term * 30) {
      //Lãi suất không kì hạn
      rootSavingAccount.balance =
        rootSavingAccount.balance +
        (rootSavingAccount.balance * duration * 0.001) / 365; //0.1%
      rootSavingAccount.withdrawalDate = Date.parse(end + " GMT");
    } else {
      rootSavingAccount.balance =
        rootSavingAccount.balance * (1 + temp.rateInterest / 100);
      rootSavingAccount.withdrawalDate = Date.parse(
        dateAdd(start, rootSavingAccount.term * 30) + " GMT"
      );
    }
    numberhind = randomNumberCard();
    rootSavingAccount.childOf = numberhind;
    data = {
      balance: rootSavingAccount.balance,
      withdrawalDate: rootSavingAccount.withdrawalDate,
      childOf: rootSavingAccount.childOf,
      rateInterest: temp.rateInterest,
    };
    await savingsAccountController.updateSavingsAccount(
      rootSavingAccount,
      data
    );
    key = numberhind;
    const newSavingsAccount = {
      number: numberhind,
      hasTerm: rootSavingAccount.hasTerm,
      term: rootSavingAccount.term,
      prevBalance: rootSavingAccount.balance,
      balance: rootSavingAccount.balance,
      depositDate: rootSavingAccount.withdrawalDate,
      withdrawalDate: null,
      isFinalSettlement: true,
      itemChosen: rootSavingAccount.itemChosen,
      childOf: null,
      BankAccountId: rootSavingAccount.BankAccountId,
      rateInterest: 0,
    };
    await savingsAccountController.createSavingsAccount(newSavingsAccount);
    length.length = length.length + 1;
    return await addLinkedListForSavingBook(withdrawalDate, key, length);
  }
}
function parseDate(str) {
  var mdy = str.split("-" || "/");
  return new Date(mdy[2], mdy[0] - 1, mdy[1]);
}

function datediff(first, second) {
  // Take the difference between the dates and divide by milliseconds per day.
  // Round to nearest whole number to deal with DST.
  return Math.round((second - first) / (1000 * 60 * 60 * 24));
}
function dateAdd(first, duration) {
  // Take the difference between the dates and divide by milliseconds per day.
  // Round to nearest whole number to deal with DST.
  return new Date(new Date(first).getTime() + duration * 24 * 60 * 60 * 1000);
}
//Tạo sổ tiết kiệm cho khách hàng
//Kiểm tra xem tài khoản khách hàng có đủ để tạo số tiết kiệm hay không
async function testFinancialCapacity(req, res) {
  //Với banlance là số tiền khách hàng muốn gửi để tạo sổ tiết kiệm
  //bankCardNumber được lưu trong section, cookie hoặc localstorage
  try {
    const balance = req.body.balance;
    const bankCardNumber = req.body.bankCardNumber;
    const bankAccount = await bankAccountController.FindBankAccountByCardNumber(
      bankCardNumber
    );
    if (balance < 0 || bankAccount.balance - balance < 0) return false;
    bankAccount.balance -= balance;
    //Chay khong ra thi log data bankAccount
    req.body.BankAccountId = bankAccount.dataValues.id;
    await bankAccountController.updateBankAccount(bankAccount, {
      balance: bankAccount.balance,
    });

    //**Cần lưu vào transaction
    let result = createBankSavingBookForCustomner(req, res);
    //console.log(req.body.savingAccountNumber);
    return result;
  } catch (err) {
    return err;
  }
}
function randomNumberBankCard() {
  return (
    "17110" +
    makeid(5) +
    Math.floor(Math.random() * (99999999999 - 10000000000) + 10000000000)
  );
}
function randomEnum(value) {
  return (
    BankAccountEnum[value] +
    "-" +
    makenum(4) +
    "-" +
    makeid(3) +
    "-" +
    makenum(3)
  );
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

//Hàm tạo mã số thẻ ngẫu nhiên
function randomNumberCard() {
  return (
    makeid(5) +
    Math.floor(Math.random() * (9999999999999 - 1000000000000) + 1000000000000)
  );
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

//BankSavingBook
//Tạo một sổ tiết kiệm cho khách hàng
function createBankSavingBookForCustomner(req, res) {
  req.body.savingAccountNumber = randomNumberCard();
  //create first SavingAccount
  const bankCardNumber = req.body.bankCardNumber;
  savingAccountNumber = req.body.savingAccountNumber;
  const bankSavingBook = {
    bankCardNumber: bankCardNumber,
    savingAccountNumber: savingAccountNumber,
    term: req.body.term,
    length: 1,
    isActivity: true,
  };
  try {
    bankSavingBookController.createBankSavingBook(bankSavingBook);
  } catch {
    return false;
  }
  const savingAccount = {
    number: savingAccountNumber,
    hasTerm: req.body.hasTerm,
    term: req.body.term, //month
    prevBalance: req.body.balance,
    balance: req.body.balance,
    depositDate: req.body.depositDate,
    isFinalSettlement: false,
    childOf: null,
    rateInterest: req.body.rateInterest,
    itemChosen: req.body.itemChosen,
    BankAccountId: req.body.BankAccountId,
  };
  try {
    savingsAccountController.createSavingsAccount(savingAccount);
  } catch {
    return false;
  }
  //console.log(savingAccount);
  return true;
}

//belongs to rateInterest, bankAccount
router.post("/savingsAccounts", (req, res) => {
  try {
    createSavingsAccount(req, res);
  } catch (error) {
    res.json({
      result: "failed",
      data: {},
      message: `Cannot create a SavingsAccount. Error: ${error}`,
    });
  }
});

router.delete("/savingsAccounts/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await savingsAccountController.deleteSavingsAccountById(id);
    res.json({
      result: "ok",
      message: "Delete a SavingsAccount successfully",
      id: id,
    });
  } catch (error) {
    res.json({
      result: "failed",
      data: {},
      message: `Delete a SavingsAccount failed. Error: ${error}`,
    });
  }
});

router.put("/savingsAccounts/:id", async (req, res) => {
  const { id } = req.params;
  try {
    //Check bankAccount
    if (req.body.BankAccountId != null) {
      let bankAccount = await bankAccountController.FindBankAccountByID(
        req.body.BankAccountId
      );
      if (bankAccount == null)
        res.json({
          result: "failed",
          message:
            "BankAccount invaiable. Please choose another bankAccount ID",
        });
    }
    let savingsAccount = await savingsAccountController.FindSavingsAccountByID(
      id
    );
    if (savingsAccount) {
      await savingsAccountController.updateSavingsAccount(
        savingsAccount,
        req.body
      );
      res.json({
        result: "ok",
        data: savingsAccount,
        message: "Update a SavingsAccount successfully",
      });
    } else {
      res.json({
        result: "failed",
        data: {},
        message: "Cannot find SavingsAccount to update",
      });
    }
  } catch (error) {
    res.json({
      result: "failed",
      data: {},
      message: `Cannot update a SavingsAccount. Error: ${error}`,
    });
  }
});

router.get("/savingsAccounts", async (req, res) => {
  try {
    const savingsAccounts = await savingsAccountController.FindAll();
    res.json({
      result: "ok",
      SavingsAccount: savingsAccounts,
      length: savingsAccounts.length,
      message: "query list of SavingsAccounts successfully",
    });
  } catch (error) {
    res.json({
      result: "failed",
      savingsAccounts: [],
      length: 0,
      message: `query list of SavingsAccounts failed. Error: ${error}`,
    });
  }
});

router.get("/savingsAccountsByUserId/:BankAccountId", async (req, res) => {
  console.log(req.params);
  try {
    const savingsAccounts = await savingsAccountController.FindSavingsAccountByBankAccountId(
      req.params.BankAccountId
    );
    res.json({
      result: "ok",
      SavingsAccount: savingsAccounts,
      length: savingsAccounts.length,
      message: "query list of SavingsAccounts successfully",
    });
  } catch (error) {
    res.json({
      result: "failed",
      savingsAccounts: [],
      length: 0,
      message: `query list of SavingsAccounts failed. Error: ${error}`,
    });
  }
});

router.get("/savingBooksByBankCardNumber/:bankCardNumber", async (req, res) => {
  console.log(req.params);
  try {
    const savingBooks = await bankSavingBookController.FindSavingAccountsByBankCardNumber(
      req.params.bankCardNumber
    );
    res.json({
      result: "ok",
      savingBooks: savingBooks,
      length: savingBooks.length,
      message: "query list of SavingBooks successfully",
    });
  } catch (error) {
    res.json({
      result: "failed",
      savingBooks: [],
      length: 0,
      message: `query list of SavingBooks failed. Error: ${error}`,
    });
  }
});

router.get("/savingBooksById/:id", async (req, res) => {
  console.log(req.params);
  try {
    const savingBooks = await bankSavingBookController.FindBankSavingBookByID(
      req.params.id
    );
    res.json({
      result: "ok",
      savingBook: savingBooks,
      length: savingBooks.length,
      message: "query SavingBook successfully",
    });
  } catch (error) {
    res.json({
      result: "failed",
      savingBook: {},
      length: 0,
      message: `query SavingBook failed. Error: ${error}`,
    });
  }
});

router.get("/savingsAccounts/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const savingsAccount = await savingsAccountController.FindSavingsAccountByID(
      id
    );
    savingsAccount
      ? res.json({
          result: "ok",
          savingsAccount: savingsAccount,
          message: "query a savingsAccount successfully",
        })
      : res.json({
          result: "failed",
          savingsAccount: {},
          message: "savingsAccount unvaiable",
        });
  } catch (error) {
    res.json({
      result: "failed",
      savingsAccount: [],
      length: 0,
      message: `query a SavingsAccount failed. Error: ${error}`,
    });
  }
});
router.get("/rateInterests", async (req, res) => {
  try {
    const rateInterests = await rateInterestController.FindAll();
    res.json({
      result: "ok",
      rateInterest: rateInterests,
      length: rateInterests.length,
      message: "query list of RateInterests successfully",
    });
  } catch (error) {
    res.json({
      result: "failed",
      rateInterest: [],
      length: 0,
      message: `query list of RateInterests failed. Error: ${error}`,
    });
  }
});

module.exports = router;
