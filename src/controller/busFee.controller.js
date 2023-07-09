const { Client, resources } = require("coinbase-commerce-node");
const { ethers } = require("ethers");

const userModel = require("../model/user.model");
const transactionModel = require("../model/transaction.model");
const { mintNFT } = require("../../utils/helper");
Client.init(String(process.env.COINBASE_API));
const { Charge } = resources;

const payBusFee = async (req, res) => {
  try {
    const { senderEmail, receiverEmail, amount } = req.body;

    const sender = await userModel.findOne({ email: senderEmail });
    if (!sender) {
      throw new Error("Sender not found");
    }

    if (sender.wallet < amount) {
      throw new Error("Insufficient funds");
    }

    // Deduct from the sender's wallet
    sender.wallet -= amount;
    await sender.save();

    const receiver = await userModel.findOne({ email: receiverEmail });
    if (!receiver) {
      throw new Error("Receiver not found");
    }

    // Add to the receiver's wallet
    receiver.wallet += amount;
    await receiver.save();

    // Generate a simplified hash for the transaction
    const hash = `trx-${Math.random()
      .toString(36)
      .substr(2, 10)
      .toUpperCase()}`;

    // Create a new transaction
    const newTransaction = new transactionModel({
      sender: senderEmail,
      receiver: receiverEmail,
      amount,
      status: "success",
      hash,
    });

    const transaction = await newTransaction.save();

    console.log(transaction);

    res.json({ message: "Transaction successful", transaction });
  } catch (err) {
    console.log(err);

    res.status(500).json({ error: err.message });
  }
};

const studentTrx = async (req, res) => {
  try {
    const { email } = req.body;

    const transactions = await transactionModel.find({ sender: email });

    console.log(transactions);

    res.json(transactions);
  } catch (err) {
    console.log(err);

    res.status(500).json({ error: err.message });
  }
};

const driverTrx = async (req, res) => {
  try {
    const { email } = req.body;

    const transactions = await transactionModel.find({ receiver: email });
    console.log(transactions);
    res.json(transactions);
  } catch (err) {
    console.log(err);

    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  payBusFee,

  driverTrx,
  studentTrx,
};
