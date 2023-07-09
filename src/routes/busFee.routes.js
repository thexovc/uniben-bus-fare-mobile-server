const express = require("express");
const {
  payBusFee,
  driverTrx,
  studentTrx,
  deposit,
} = require("../controller/busFee.controller");

const router = express.Router();

router.post("/payBusFee", payBusFee);
router.post("/deposit", deposit);
router.post("/driverTrx", driverTrx);
router.post("/studentTrx", studentTrx);

module.exports = router;
