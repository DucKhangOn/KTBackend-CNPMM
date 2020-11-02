const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const userController = require("../controllers/userController");
const bankController = require("../controllers/bankController");
const bankAccountController = require("../controllers/bankAccountController");
const transactionFeeController = require("../controllers/transactionFeeController");
const serviceController = require("../controllers/serviceController");
const exchangeRateController = require("../controllers/exchangeRateController");
const rateInterestController = require("../controllers/rateInterestController");
const transactionController = require("../controllers/transactionController");
const savingsAccountController = require("../controllers/savingsAccount");
const cardController = require("../controllers/cardController");
const paypalController = require("../controllers/paypalController");
const bcrypt = require("bcrypt");

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
  try {
    await bcrypt.hash(req.body.password, 10, async (err, hash) => {
      req.body.password = hash;
      let newUser = await userController.createUser(req.body);
      newUser.errors
        ? res.json({ result: "failed", user: newUser })
        : res.json({ result: "ok", user: newUser });
    });
  } catch (error) {
    res.json({
      result: "failed",
      user: {},
      message: `Insert a new User failed. Error: ${error}`,
    });
  }
});

//Create a User
router.post("/users", async (req, res) => {
  try {
    let newUser = await userController.createUser(req.body);
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
  const { id } = req.params;
  try {
    let user = await userController.findUserById(id);
    if (user) {
      await bcrypt.hash(req.body.password, 10, async (err, hash) => {
        req.body.password = hash;
        await userController.updateUser(user, req.body);
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
    const users = await userController.FindAllUser();
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

//----------------------------BankController
//Methor Post
router.post("/banks", async (req, res) => {
  try {
    let newBank = await bankController.createBank(req.body);
    newBank.errors
      ? res.json({ result: "failed", bank: newBank })
      : res.json({ result: "ok", bank: newBank });
  } catch (error) {
    res.json({
      result: "failed",
      bank: {},
      message: `Create a new bank failed. Error ${error}`,
    });
  }
});

router.delete("/banks/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await bankController.deleteBankById(id);
    res.json({
      result: "ok",
      message: "Delete a Bank successfully",
      id: id,
    });
  } catch (error) {
    res.json({
      result: "failed",
      data: {},
      message: `Delete a Bank failed. Error: ${error}`,
    });
  }
});

router.put("/banks/:id", async (req, res) => {
  const { id } = req.params;
  try {
    let bank = await bankController.FindBankByID(id);
    if (bank) {
      await bankController.updateBank(bank, req.body);
      res.json({
        result: "ok",
        data: bank,
        message: "Update a Bank successfully",
      });
    } else {
      res.json({
        result: "failed",
        data: {},
        message: "Cannot find Bank to update",
      });
    }
  } catch (error) {
    res.json({
      result: "failed",
      data: {},
      message: `Cannot update a Bank. Error: ${error}`,
    });
  }
});

router.get("/banks", async (req, res) => {
  try {
    const banks = await bankController.FindAll();
    res.json({
      result: "ok",
      bank: banks,
      length: banks.length,
      message: "query list of Banks successfully",
    });
  } catch (error) {
    res.json({
      result: "failed",
      bank: [],
      length: 0,
      message: `query list of Banks failed. Error: ${error}`,
    });
  }
});

router.get("/banks/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const bank = await bankController.FindBankByID(id);
    bank
      ? res.json({
          result: "ok",
          bank: bank,
          message: "query a Bank successfully",
        })
      : res.json({
          result: "failed",
          bank: {},
          message: "Bank unvaiable",
        });
  } catch (error) {
    res.json({
      result: "failed",
      bank: [],
      length: 0,
      message: `query a Bank failed. Error: ${error}`,
    });
  }
});

//----------------------------TransactionFeeController
//Methor Post
router.post("/transactionFees", async (req, res) => {
  try {
    let newTransactionFee = await transactionFeeController.createTransactionFee(
      req.body
    );
    newTransactionFee.errors
      ? res.json({ result: "failed", transactionFee: newTransactionFee })
      : res.json({ result: "ok", transactionFee: newTransactionFee });
  } catch (error) {
    res.json({
      result: "failed",
      transactionFee: {},
      message: `Create a new transactionFee failed. Error ${error}`,
    });
  }
});

router.delete("/transactionFees/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await transactionFeeController.deleteTransactionFeeById(id);
    res.json({
      result: "ok",
      message: "Delete a TransactionFee successfully",
      id: id,
    });
  } catch (error) {
    res.json({
      result: "failed",
      data: {},
      message: `Delete a TransactionFee failed. Error: ${error}`,
    });
  }
});

router.put("/transactionFees/:id", async (req, res) => {
  const { id } = req.params;
  try {
    let transactionFee = await transactionFeeController.FindTransactionFeeByID(
      id
    );
    if (transactionFee) {
      await transactionFeeController.updateTransactionFee(
        transactionFee,
        req.body
      );
      res.json({
        result: "ok",
        data: transactionFee,
        message: "Update a TransactionFee successfully",
      });
    } else {
      res.json({
        result: "failed",
        data: {},
        message: "Cannot find TransactionFee to update",
      });
    }
  } catch (error) {
    res.json({
      result: "failed",
      data: {},
      message: `Cannot update a TransactionFee. Error: ${error}`,
    });
  }
});

router.get("/transactionFees", async (req, res) => {
  try {
    const transactionFees = await transactionFeeController.FindAll();
    res.json({
      result: "ok",
      transactionFee: transactionFees,
      length: transactionFees.length,
      message: "query list of TransactionFees successfully",
    });
  } catch (error) {
    res.json({
      result: "failed",
      transactionFee: [],
      length: 0,
      message: `query list of TransactionFees failed. Error: ${error}`,
    });
  }
});

router.get("/transactionFees/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const transactionFee = await transactionFeeController.FindTransactionFeeByID(
      id
    );
    transactionFee
      ? res.json({
          result: "ok",
          transactionFee: transactionFee,
          message: "query a TransactionFee successfully",
        })
      : res.json({
          result: "failed",
          transactionFee: {},
          message: "TransactionFee unvaiable",
        });
  } catch (error) {
    res.json({
      result: "failed",
      transactionFee: [],
      length: 0,
      message: `query a TransactionFee failed. Error: ${error}`,
    });
  }
});

//----------------------------ServiceController
//Methor Post
router.post("/services", async (req, res) => {
  try {
    let newService = await serviceController.createService(req.body);
    newService.errors
      ? res.json({ result: "failed", service: newService })
      : res.json({ result: "ok", service: newService });
  } catch (error) {
    res.json({
      result: "failed",
      service: {},
      message: `Create a new service failed. Error ${error}`,
    });
  }
});

router.delete("/services/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await serviceController.deleteServiceById(id);
    res.json({
      result: "ok",
      message: "Delete a Service successfully",
      id: id,
    });
  } catch (error) {
    res.json({
      result: "failed",
      data: {},
      message: `Delete a Service failed. Error: ${error}`,
    });
  }
});

router.put("/services/:id", async (req, res) => {
  const { id } = req.params;
  try {
    let service = await serviceController.FindServiceByID(id);
    if (service) {
      await serviceController.updateService(service, req.body);
      res.json({
        result: "ok",
        data: service,
        message: "Update a Service successfully",
      });
    } else {
      res.json({
        result: "failed",
        data: {},
        message: "Cannot find Service to update",
      });
    }
  } catch (error) {
    res.json({
      result: "failed",
      data: {},
      message: `Cannot update a Service. Error: ${error}`,
    });
  }
});

router.get("/services", async (req, res) => {
  try {
    const services = await serviceController.FindAll();
    res.json({
      result: "ok",
      service: services,
      length: services.length,
      message: "query list of Services successfully",
    });
  } catch (error) {
    res.json({
      result: "failed",
      service: [],
      length: 0,
      message: `query list of Services failed. Error: ${error}`,
    });
  }
});

router.get("/services/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const service = await serviceController.FindServiceByID(id);
    service
      ? res.json({
          result: "ok",
          service: service,
          message: "query a Service successfully",
        })
      : res.json({
          result: "failed",
          service: {},
          message: "Service unvaiable",
        });
  } catch (error) {
    res.json({
      result: "failed",
      service: [],
      length: 0,
      message: `query a Service failed. Error: ${error}`,
    });
  }
});

//----------------------------ExchangeRateController
//Methor Post
router.post("/exchangeRates", async (req, res) => {
  try {
    let newExchangeRate = await exchangeRateController.createExchangeRate(
      req.body
    );
    newExchangeRate.errors
      ? res.json({ result: "failed", exchangeRate: newExchangeRate })
      : res.json({ result: "ok", exchangeRate: newExchangeRate });
  } catch (error) {
    res.json({
      result: "failed",
      exchangeRate: {},
      message: `Create a new exchangeRate failed. Error ${error}`,
    });
  }
});

router.delete("/exchangeRates/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await exchangeRateController.deleteExchangeRateById(id);
    res.json({
      result: "ok",
      message: "Delete a ExchangeRate successfully",
      id: id,
    });
  } catch (error) {
    res.json({
      result: "failed",
      data: {},
      message: `Delete a ExchangeRate failed. Error: ${error}`,
    });
  }
});

router.put("/exchangeRates/:id", async (req, res) => {
  const { id } = req.params;
  try {
    let exchangeRate = await exchangeRateController.FindExchangeRateByID(id);
    if (exchangeRate) {
      await exchangeRateController.updateExchangeRate(exchangeRate, req.body);
      res.json({
        result: "ok",
        data: exchangeRate,
        message: "Update a ExchangeRate successfully",
      });
    } else {
      res.json({
        result: "failed",
        data: {},
        message: "Cannot find ExchangeRate to update",
      });
    }
  } catch (error) {
    res.json({
      result: "failed",
      data: {},
      message: `Cannot update a ExchangeRate. Error: ${error}`,
    });
  }
});

router.get("/exchangeRates", async (req, res) => {
  try {
    const exchangeRates = await exchangeRateController.FindAll();
    res.json({
      result: "ok",
      exchangeRate: exchangeRates,
      length: exchangeRates.length,
      message: "query list of ExchangeRates successfully",
    });
  } catch (error) {
    res.json({
      result: "failed",
      exchangeRate: [],
      length: 0,
      message: `query list of ExchangeRates failed. Error: ${error}`,
    });
  }
});

router.get("/exchangeRates/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const exchangeRate = await exchangeRateController.FindExchangeRateByID(id);
    exchangeRate
      ? res.json({
          result: "ok",
          exchangeRate: exchangeRate,
          message: "query a exchangeRate successfully",
        })
      : res.json({
          result: "failed",
          exchangeRate: {},
          message: "exchangeRate unvaiable",
        });
  } catch (error) {
    res.json({
      result: "failed",
      exchangeRate: [],
      length: 0,
      message: `query a ExchangeRate failed. Error: ${error}`,
    });
  }
});

//----------------------------RateInterestController
//Methor Post
router.post("/rateInterests", async (req, res) => {
  try {
    let newRateInterest = await rateInterestController.createRateInterest(
      req.body
    );
    newRateInterest.errors
      ? res.json({ result: "failed", rateInterest: newRateInterest })
      : res.json({ result: "ok", rateInterest: newRateInterest });
  } catch (error) {
    res.json({
      result: "failed",
      rateInterest: {},
      message: `Create a new rateInterest failed. Error ${error}`,
    });
  }
});

router.delete("/rateInterests/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await rateInterestController.deleteRateInterestById(id);
    res.json({
      result: "ok",
      message: "Delete a RateInterest successfully",
      id: id,
    });
  } catch (error) {
    res.json({
      result: "failed",
      data: {},
      message: `Delete a RateInterest failed. Error: ${error}`,
    });
  }
});

router.put("/rateInterests/:id", async (req, res) => {
  const { id } = req.params;
  try {
    let rateInterest = await rateInterestController.FindRateInterestByID(id);
    if (rateInterest) {
      await rateInterestController.updateRateInterest(rateInterest, req.body);
      res.json({
        result: "ok",
        data: rateInterest,
        message: "Update a RateInterest successfully",
      });
    } else {
      res.json({
        result: "failed",
        data: {},
        message: "Cannot find RateInterest to update",
      });
    }
  } catch (error) {
    res.json({
      result: "failed",
      data: {},
      message: `Cannot update a RateInterest. Error: ${error}`,
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

router.get("/rateInterests/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const rateInterest = await rateInterestController.FindRateInterestByID(id);
    rateInterest
      ? res.json({
          result: "ok",
          rateInterest: rateInterest,
          message: "query a rateInterest successfully",
        })
      : res.json({
          result: "failed",
          rateInterest: {},
          message: "rateInterest unvaiable",
        });
  } catch (error) {
    res.json({
      result: "failed",
      rateInterest: [],
      length: 0,
      message: `query a RateInterest failed. Error: ${error}`,
    });
  }
});
//---------------------------BankAccountController
//belongs to User
router.post("/bankAccounts", async (req, res) => {
  try {
    let user = await userController.findUserById(req.body.UserId);
    if (user != null) {
      let newbankAccount = await bankAccountController.createBankAccount(
        req.body
      );
      newbankAccount.errors
        ? res.json({ result: "failed", bankAccount: newbankAccount })
        : res.json({ result: "ok", bankAccount: newbankAccount });
    } else {
      res.json({
        result: "failed",
        data: {},
        message: `User invaiable. Please choose another user`,
      });
    }
  } catch (error) {
    res.json({
      result: "failed",
      data: {},
      message: `Cannot create a BankAccount. Error: ${error}`,
    });
  }
});

router.delete("/bankAccounts/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await bankAccountController.deleteBankAccountById(id);
    res.json({
      result: "ok",
      message: "Delete a BankAccount successfully",
      id: id,
    });
  } catch (error) {
    res.json({
      result: "failed",
      data: {},
      message: `Delete a BankAccount failed. Error: ${error}`,
    });
  }
});

router.put("/bankAccounts/:id", async (req, res) => {
  const { id } = req.params;
  try {
    if (req.body.UserId != null) {
      let newUser = await userController.findUserById(req.body.UserId);
      if (newUser == null)
        res.json({
          result: "failed",
          message: "User invaiable. Please choose another User ID",
        });
    }
    let bankAccount = await bankAccountController.FindBankAccountByID(id);
    if (bankAccount) {
      await bankAccountController.updateBankAccount(bankAccount, req.body);
      res.json({
        result: "ok",
        data: bankAccount,
        message: "Update a BankAccount successfully",
      });
    } else {
      res.json({
        result: "failed",
        data: {},
        message: "Cannot find BankAccount to update",
      });
    }
  } catch (error) {
    res.json({
      result: "failed",
      data: {},
      message: `Cannot update a BankAccount. Error: ${error}`,
    });
  }
});

router.get("/bankAccounts", async (req, res) => {
  try {
    const bankAccounts = await bankAccountController.FindAll();
    res.json({
      result: "ok",
      BankAccount: bankAccounts,
      length: bankAccounts.length,
      message: "query list of BankAccounts successfully",
    });
  } catch (error) {
    res.json({
      result: "failed",
      bankAccounts: [],
      length: 0,
      message: `query list of BankAccounts failed. Error: ${error}`,
    });
  }
});

router.get("/bankAccounts/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const bankAccount = await bankAccountController.FindBankAccountByID(id);
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

//---------------------------TransactionController
//belongs to transactionFree, service, bankAccount
router.post("/transactions", async (req, res) => {
  try {
    //Check transactionFree
    let transactionFee = await transactionFeeController.FindTransactionFeeByID(
      req.body.TransactionFeeId
    );
    if (transactionFee != null) {
      //Check Service
      let service = await serviceController.FindServiceByID(req.body.ServiceId);
      if (service != null) {
        //Check bankAccount
        let bankAccount = await bankAccountController.FindBankAccountByID(
          req.body.BankAccountId
        );
        if (bankAccount != null) {
          let newtransaction = await transactionController.createTransaction(
            req.body
          );
          newtransaction.errors
            ? res.json({ result: "failed", transaction: newtransaction })
            : res.json({ result: "ok", transaction: newtransaction });
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
          message: `Service invaiable. Please choose another service`,
        });
      }
    } else {
      res.json({
        result: "failed",
        data: {},
        message: `TransactionFee invaiable. Please choose another transactionFee`,
      });
    }
  } catch (error) {
    res.json({
      result: "failed",
      data: {},
      message: `Cannot create a Transaction. Error: ${error}`,
    });
  }
});

router.delete("/transactions/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await transactionController.deleteTransactionById(id);
    res.json({
      result: "ok",
      message: "Delete a Transaction successfully",
      id: id,
    });
  } catch (error) {
    res.json({
      result: "failed",
      data: {},
      message: `Delete a Transaction failed. Error: ${error}`,
    });
  }
});

router.put("/transactions/:id", async (req, res) => {
  const { id } = req.params;
  try {
    //Check transactinFree
    if (req.body.TransactionFeeId != null) {
      let transactionFee = await transactionFeeController.FindTransactionFeeByID(
        req.body.TransactionFeeId
      );
      if (transactionFee == null)
        res.json({
          result: "failed",
          message:
            "TransactionFree invaiable. Please choose another transactionFree ID",
        });
    }
    //Check service
    if (req.body.ServiceId != null) {
      let service = await serviceController.FindServiceByID(req.body.ServiceId);
      if (service == null)
        res.json({
          result: "failed",
          message: "Service invaiable. Please choose another service ID",
        });
    }
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
    let transaction = await transactionController.FindTransactionByID(id);
    if (transaction) {
      await transactionController.updateTransaction(transaction, req.body);
      res.json({
        result: "ok",
        data: transaction,
        message: "Update a Transaction successfully",
      });
    } else {
      res.json({
        result: "failed",
        data: {},
        message: "Cannot find Transaction to update",
      });
    }
  } catch (error) {
    res.json({
      result: "failed",
      data: {},
      message: `Cannot update a Transaction. Error: ${error}`,
    });
  }
});

router.get("/transactions", async (req, res) => {
  try {
    const transactions = await transactionController.FindAll();
    res.json({
      result: "ok",
      Transaction: transactions,
      length: transactions.length,
      message: "query list of Transactions successfully",
    });
  } catch (error) {
    res.json({
      result: "failed",
      transactions: [],
      length: 0,
      message: `query list of Transactions failed. Error: ${error}`,
    });
  }
});

router.get("/transactions/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const transaction = await transactionController.FindTransactionByID(id);
    transaction
      ? res.json({
          result: "ok",
          transaction: transaction,
          message: "query a transaction successfully",
        })
      : res.json({
          result: "failed",
          transaction: {},
          message: "transaction unvaiable",
        });
  } catch (error) {
    res.json({
      result: "failed",
      transaction: [],
      length: 0,
      message: `query a Transaction failed. Error: ${error}`,
    });
  }
});

//---------------------------SavingsAccountController
//belongs to rateInterest, bankAccount
router.post("/savingsAccounts", async (req, res) => {
  try {
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
    //Check rateInterest
    if (req.body.RateInterestId != null) {
      let rateInterest = await rateInterestController.FindRateInterestByID(
        req.body.RateInterestId
      );
      if (rateInterest == null)
        res.json({
          result: "failed",
          message:
            "RateInterest invaiable. Please choose another rateInterest ID",
        });
    }
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

//---------------------------CardController
//belongs to bankAccount
router.post("/cards", async (req, res) => {
  try {
    //Check bankAccount
    let bankAccount = await bankAccountController.FindBankAccountByID(
      req.body.BankAccountId
    );
    if (bankAccount != null) {
      let newcard = await cardController.createCard(req.body);
      newcard.errors
        ? res.json({ result: "failed", card: newcard })
        : res.json({ result: "ok", card: newcard });
    } else {
      res.json({
        result: "failed",
        data: {},
        message: `BankAccount invaiable. Please choose another bankAccount`,
      });
    }
  } catch (error) {
    res.json({
      result: "failed",
      data: {},
      message: `Cannot create a Card. Error: ${error}`,
    });
  }
});

router.delete("/cards/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await cardController.deleteCardById(id);
    res.json({
      result: "ok",
      message: "Delete a Card successfully",
      id: id,
    });
  } catch (error) {
    res.json({
      result: "failed",
      data: {},
      message: `Delete a Card failed. Error: ${error}`,
    });
  }
});

router.put("/cards/:id", async (req, res) => {
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
    let card = await cardController.FindCardByID(id);
    if (card) {
      await cardController.updateCard(card, req.body);
      res.json({
        result: "ok",
        data: card,
        message: "Update a Card successfully",
      });
    } else {
      res.json({
        result: "failed",
        data: {},
        message: "Cannot find Card to update",
      });
    }
  } catch (error) {
    res.json({
      result: "failed",
      data: {},
      message: `Cannot update a Card. Error: ${error}`,
    });
  }
});

router.get("/cards", async (req, res) => {
  try {
    const cards = await cardController.FindAll();
    res.json({
      result: "ok",
      Card: cards,
      length: cards.length,
      message: "query list of Cards successfully",
    });
  } catch (error) {
    res.json({
      result: "failed",
      cards: [],
      length: 0,
      message: `query list of Cards failed. Error: ${error}`,
    });
  }
});

router.get("/cards/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const card = await cardController.FindCardByID(id);
    card
      ? res.json({
          result: "ok",
          card: card,
          message: "query a card successfully",
        })
      : res.json({
          result: "failed",
          card: {},
          message: "card unvaiable",
        });
  } catch (error) {
    res.json({
      result: "failed",
      card: [],
      length: 0,
      message: `query a Card failed. Error: ${error}`,
    });
  }
});

//---------------------------PaypalController
//belongs to PaypalAccount
router.get("/paypal", async (req, res) => {
  try {
    await paypalController.TrasactionToDesBank();
  } catch (error) {
    res.json({
      result: "failed",
      card: [],
      length: 0,
      message: `query a Card failed. Error: ${error}`,
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

module.exports = router;
