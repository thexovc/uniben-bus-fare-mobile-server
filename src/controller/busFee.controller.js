import { Client, resources } from "coinbase-commerce-node";
import userModel from "../model/user.model";
import transactionModel from "../model/transaction.model";
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

    res.json({ message: "Transaction successful", transaction });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const studentTrx = async (req, res) => {
  try {
    const { email } = req.body;

    const transactions = await transactionModel.find({ sender: email });

    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const driverTrx = async (req, res) => {
  try {
    const { email } = req.body;

    const transactions = await transactionModel.find({ receiver: email });

    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const coinInitRoute = async (req, res) => {
  const { id } = req.body;

  const product = products.find((product) => product.id === id);

  try {
    const chargeData = {
      name: product.name,
      description: product.description,
      pricing_type: "fixed_price",
      local_price: {
        amount: product.price,
        currency: product.currency,
      },
      metadata: {
        id: product.id,
        userID: 1,
      },
    };

    const charge = await Charge.create(chargeData);

    res.send(charge);
  } catch (e) {
    res.status(500).send({ error: e });
  }
};

module.exports = {
  payBusFee,
  coinInitRoute,
  driverTrx,
  studentTrx,
};
