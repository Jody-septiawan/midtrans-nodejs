const express = require("express");

const router = express.Router();

const { getProducts, addProduct, getProduct, orderProduct } = require('../controllers/product');
const { getTransactions, addTransaction, deleteTransactions, updateTransaction, notification } = require('../controllers/transaction');

router.get("/products", getProducts);
router.post("/product", addProduct);
router.get("/product/:id", getProduct);

router.post("/order-product", orderProduct);
router.post("/notification", notification);

router.get("/transactions", getTransactions);
router.post("/transaction", addTransaction);
router.delete("/transaction", deleteTransactions);
router.patch("/transaction/:id", updateTransaction);

module.exports = router;