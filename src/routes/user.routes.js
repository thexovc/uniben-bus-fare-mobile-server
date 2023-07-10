const express = require("express");
const { login, register, getUser } = require("../controller/user.controller");
const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.get("/getUser", getUser);

module.exports = router;
