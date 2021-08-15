const express = require("express");
const router = express.Router();
const middleware = require("../../middleware");
const models = require("../../models");
const values = require("../../values");
const _ = require("lodash");
const moment = require("jalali-moment");
const soap = require("soap");

const url = "https://bpm.shaparak.ir/pgwchannel/services/pgw?wsdl";

router.get("/", middleware.userAuthentication, async (req, res) => {
  const conf = await models.Config.findById("5efdc82cdfb37e5fb82e9ef9");
  const userId = req.userId;
  const user = await models.User.findById(userId).populate("cart.product");
  if (user.cart === null)
    return res.status(404).json({ Error: values.statusCodes.ER_CART_EMPTY });
  let Amount;
  if (typeof user.cart.product.newPrice === "number") {
    Amount = _.sumBy(user.cart, (cart) => cart.product.newPrice * cart.count);
  } else {
    Amount = _.sumBy(user.cart, (cart) => cart.product.realPrice * cart.count);
  }
  let products = [];
  user.cart.map((c) => {
    products.push({ product: c.product._id, count: c.count });
  });

  const transaction = {
    user: userId,
    products,
    authority: conf.refId,
    totalPrice: Amount,
  };
  const resSaveTransaction = await models.Transaction(transaction).save();
  await models.User.findByIdAndUpdate(userId, {
    $push: { transactions: resSaveTransaction._id },
  });

  const xml = {
    terminalId: values.configs.PAYMENT_GATEWAY_TERMINAL_ID,
    userName: values.configs.PAYMENT_GATEWAY_USERNAME,
    userPassword: values.configs.PAYMENT_GATEWAY_PASSWORD,
    orderId: conf.refId,
    amount: Amount * 10,
    localDate: moment().locale("fa").format("YYYYMD"),
    localTime: moment().locale("fa").format("HHmm"),
    additionalData: `خرید از پرنی`,
    callBackUrl: "https://pernymarket.ir/api/v1/payment/verify",
    payerId: 0,
  };

  soap.createClient(url, (err, client) => {
    client.bpPayRequest(xml, (err, result) => {
      if (result.return.split(",")[0] == 0) {
        const ref = result.return.split(",")[1];
        res.json(
          `https://bpm.shaparak.ir/pgwchannel/payment.mellat?RefId=${ref}`
        );
      } else {
        res
          .status(500)
          .json({ Error: values.statusCodes.ER_PAYMENT_NOT_COMPLETE });
      }
    });
  });
  const increaseRef = await models.Config.findOneAndUpdate(
    { _id: "5efdc82cdfb37e5fb82e9ef9" },
    { $inc: { refId: 1 } }
  );
});

router.post("/verify", async (req, res) => {
  if (req.body.ResCode == 0) {
    const conf = await models.Config.findById("5efdc82cdfb37e5fb82e9ef9");

    const xml = {
      terminalId: values.configs.PAYMENT_GATEWAY_TERMINAL_ID,
      userName: values.configs.PAYMENT_GATEWAY_USERNAME,
      userPassword: values.configs.PAYMENT_GATEWAY_PASSWORD,
      orderId: conf.refId,
      saleOrderId: req.body.SaleOrderId,
      saleReferenceId: req.body.SaleReferenceId,
    };
    const RefId = req.body.SaleOrderId;

    soap.createClient(url, async (err, client) => {
      client.bpVerifyRequest(xml, async (err, result) => {
        if (result.return == 0) {
          client.bpSettleRequest(xml, async (err, result) => {
            if (result.return == 0) {
              const foundedTransaction = await models.Transaction.findOne({
                authority: RefId,
              }).populate("products.product");
              if (!foundedTransaction)
                return res
                  .status(500)
                  .json({ Error: values.statusCodes.ER_SMT_WRONG });

              const resUpdateTransaction = await models.Transaction.findOneAndUpdate(
                { authority: RefId },
                {
                  paymentStatus: true,
                  date: moment().locale("fa").format("YYYY/M/D HH:MM:SS"),
                }
              );

              const delivery = {
                transaction: resUpdateTransaction,
                status: 0,
              };

              const productDelivery = await models.Delivery(delivery).save();
              const resUpdateMember = await models.Member.findOneAndUpdate(
                { _id: foundedTransaction.user },
                { $push: { boughtProducts: productDelivery }, cart: [] }
              );
              res.status(200).json({
                Code: values.statusCodes.SC_PAYMENT_COMPLETED_SUCCESSFULLY,
              });
            } else {
              client.bpReversalRequest(xml, (err, result) => {
                res.status(200).json({
                  Error:
                    values.statusCodes
                      .ER_PAYMENT_SETTLEMENT_FAILED_THUS_REVERSING,
                });
              });
            }
          });
        } else {
          client.bpReversalRequest(xml, (err, result) => {
            res.status(200).json({
              Error:
                values.statusCodes
                  .ER_PAYMENT_VERIFICATION_FAILED_THUS_REVERSING,
            });
          });
        }
      });
    });
  } else {
    res.status(502).json({ Error: values.statusCodes.ER_PAYMENT_NOT_COMPLETE });
  }

  const increaseRef = await models.Config.findOneAndUpdate(
    { _id: "5efdc82cdfb37e5fb82e9ef9" },
    { $inc: { refId: 1 } }
  );
});

module.exports = router;
