const { default: mongoose } = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    sender: {
      type: String,
      required: true,
    },
    receiver: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "success"],
      default: "pending",
    },
    hash: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
