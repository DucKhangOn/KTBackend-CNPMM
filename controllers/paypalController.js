var controller = {};

const { sequelize } = require("../models");

const models = require("../models");
const paypal = require("paypal-rest-sdk");
const KTBANK_dBank = {
  client_id:
    "AcF0kj5czGiFt428I_VxKAk7BwGD9hNQNumG4IfljYn7wqFBYMIg9czAqZwl3DcBLi1EH6SdCmysQjEi",
  client_secret:
    "EHCelxB0xISwq_3NrV6-Mr1xhcUSIF0WpCgBXXXyk69RLULkQgpsUArhdpXTs7E2Q9ZugVHPXK7Wyoht",
};

controller.createPaypalAccount = async (body) => {
  return await sequelize
    .transaction((t) => {
      return models.PaypalAccount.create({ ...body });
    })
    .then((result) => {
      return result;
    })
    .catch((err) => {
      return err;
    });
};

controller.deletePaypalAccountById = async (id) => {
  return await models.PaypalAccount.destroy({
    where: { id: id },
  });
};

controller.updatePaypalAccount = async (paypalAccount, body) => {
  return await paypalAccount.update({
    ...body,
  })
    .then((result) => {
      return result;
    })
    .catch((err) => {
      return err;
    });
};
controller.FindAll = async () => {
  return await models.PaypalAccount.findAll();
};
controller.FindPaypalAccountByID = async (id) => {
  return await models.PaypalAccount.findOne({
    where: { id: id },
  });
};

//Body include amount
controller.TrasactionToDesBank = async (/*sBank, dBank, body*/) => {
  //dBank tk huong tien 
  //sBank tk nguon
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
      return_url: "http://localhost:4200/page/success" + 5,//body.amount,
      cancel_url: "http://localhost:4200/page/cancel" + 5//body.amount,
    },
    transactions: [
      {
        item_list: {
          items: [
            {
              name: "item",
              sku: "item",
              price: 5,//body.amount,
              currency: "USD",
              quantity: 1,
            },
          ],
        },
        amount: {
          currency: "USD",
          total: body.amount,
        },
        description: "This is the payment description.",
      },
    ],
  };

    paypal.payment.create(create_payment_json, function (error, payment) {
      if (error) {
        throw error;
      } else {
        for (let i = 0; i < payment.links.length; i++) {
          if (payment.links[i].rel === "approval_url") {
            res.redirect(payment.links[i].href);
          }
        }
      }
    });
};

module.exports = controller;
