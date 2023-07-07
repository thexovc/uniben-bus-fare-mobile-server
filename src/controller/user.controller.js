const userModel = require("../model/user.model");
const bcrypt = require("bcrypt");

const register = async (req, res) => {
  try {
    const { email, password, username, userType } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new userModel({
      email,
      password: hashedPassword,
      username,
      userType,
    });

    const user = await newUser.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to create user" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const result = await bcrypt.compare(password, user.password);
    if (result) {
      return res.json({ message: "Authentication successful" });
    } else {
      return res.status(401).json({ error: "Invalid password" });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to authenticate user" });
  }
};

const getAllUser = async (req, res) => {
  try {
    const users = await userModel.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to get users" });
  }
};

module.exports = {
  register,
  login,
  getAllUser,
};
