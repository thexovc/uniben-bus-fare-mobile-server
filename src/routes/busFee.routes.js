const express = require("express");
const { payBusFee } = require("../controller/busFee.controller");

const router = express.Router();

router.post("/payBusFee", payBusFee);
router.post("/payBusFee", payBusFee);

module.exports = router;
