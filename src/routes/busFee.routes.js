const express = require("express");
const {
  payBusFee,
  driverTrx,
  studentTrx,
  coinInitRoute,
  coinVerifyRoute,
  mintAndTransferNFT,
} = require("../controller/busFee.controller");

const router = express.Router();

router.post("/payBusFee", payBusFee);
router.post("/driverTrx", driverTrx);
router.post("/studentTrx", studentTrx);
router.post("/coinbase", coinInitRoute);
router.post("/coinVerify", coinVerifyRoute);
router.post("/mint", mintAndTransferNFT);

module.exports = router;
