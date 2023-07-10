const express = require("express");
const {
  payBusFee,
  deposit,
  userTrx,
  trxCount,
} = require("../controller/busFee.controller");

const router = express.Router();

router.post("/payBusFee", payBusFee);
router.post("/deposit", deposit);
router.post("/userTrx", userTrx);
router.post("/trxCount", trxCount);

module.exports = router;
