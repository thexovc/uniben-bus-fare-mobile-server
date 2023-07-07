const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
  },
  userType: {
    type: String,
    enum: ["driver", "student"],
    required: true,
  },
  wallet: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("User", userSchema);
