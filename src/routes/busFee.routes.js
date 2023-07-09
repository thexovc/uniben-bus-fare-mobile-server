const express = require("express");
const {
  payBusFee,
  driverTrx,
  studentTrx,
} = require("../controller/busFee.controller");

const router = express.Router();

router.post("/payBusFee", payBusFee);
router.post("/driverTrx", driverTrx);
router.post("/studentTrx", studentTrx);

module.exports = router;
