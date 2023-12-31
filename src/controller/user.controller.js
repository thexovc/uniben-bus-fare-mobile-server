const userModel = require("../model/user.model");
const bcrypt = require("bcrypt");

const register = async (req, res) => {
  try {
    const { email, password, username, userType } = req.body;

    console.log(req.body);

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new userModel({
      email,
      password: hashedPassword,
      username,
      userType,
    });

    const user = await newUser.save();
    console.log({ user });

    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to create user" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const result = await bcrypt.compare(password, user.password);
    console.log({ result });
    if (result) {
      return res.json({ message: "Authentication successful", user });
    } else {
      return res.status(401).json({ error: "Invalid password" });
    }
  } catch (err) {
    console.log(err);

    res.status(500).json({ error: "Failed to authenticate user" });
  }
};

const getUser = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });
    console.log(user);

    res.json({ user });
  } catch (err) {
    console.log(err);

    res.status(500).json({ error: "Failed to get users" });
  }
};

module.exports = {
  register,
  login,
  getUser,
};
