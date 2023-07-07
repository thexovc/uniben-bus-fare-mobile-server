const express = require("express");
const {
  login,
  register,
  getAllUser,
} = require("../controller/user.controller");
const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.get("/getAll", getAllUser);

module.exports = router;
