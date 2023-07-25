var express = require("express");
const TransactionController = require("../controllers/TransactionController");
const OrderController = require("../controllers/OrderController");

var router = express.Router();

router.get('/getorders/:org_name/:org_address',OrderController.allOrders)
router.get('/gettransactions/:org_name/:org_address',TransactionController.allTransactions)
router.get('/getlasttransact/:org_name/:org_address',TransactionController.LastTransaction)
router.post("/transactionblood", TransactionController.addTransactionBlood);
router.post("/transactionmeds", TransactionController.addTransactionMeds);

module.exports = router;