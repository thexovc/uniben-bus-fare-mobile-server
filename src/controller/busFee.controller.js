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
  try {
    const chargeData = {
      name: "product name",
      description: "desc",
      pricing_type: "fixed_price",
      local_price: {
        amount: 1000,
        currency: "USD",
      },
      metadata: {
        id: "user 1",
        userID: 1,
      },
    };

    const charge = await Charge.create(chargeData);

    res.send(charge);
  } catch (e) {
    res.status(500).send({ error: e });
  }
};

const coinVerifyRoute = async (req, res) => {
  try {
    const rawBody = JSON.stringify(req.body);
    const signature = String(req.headers["x-cc-webhook-signature"]);
    const webhookSecret = String(process.env.COINBASE_SECRET);
    const event = Webhook.verifyEventBody(rawBody, signature, webhookSecret);

    console.log("rawbody", rawBody);
    console.log({ event });

    if (event.type === "charge:pending") {
      // TODO
      // user paid, but transaction not confirm on blockchain
      console.log("pending");
    }

    if (event.type === "charge:confirmed") {
      // TODO
      // all good, charge confirmed
      console.log("confirmed");
    }

    if (event.type === "charge:failed") {
      // TODO
      // charge failed or expired
      console.log("failed");
    }
  } catch (e) {
    res.status(500).send("error");
  }

  res.send(`success`);
};

const mintAndTransferNFT = async (req, res) => {
  try {
    const privateKey =
      "a52094fb0102930bb9616069fb1f069e33c15aad41cf2ca52e396e1901bad503";
    const contractAddress = "0xfe64980ffc5991B18C12e2DE233f2E8da8787AE7";
    const toAddress = "0xeFbBCE6f581DC3A42aB1Fd3742A297ef93bdf6C7";

    const providerUrl =
      "https://neat-silent-shape.matic-testnet.discover.quiknode.pro/0f4fd8fd0aa2fc7b34bc33a93193b6dc689824b5/";

    const tokenId = await mintNFT(
      privateKey,
      contractAddress,
      toAddress,
      providerUrl
    );

    res.status(200).json({ tokenId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

module.exports = {
  payBusFee,
  coinInitRoute,
  driverTrx,
  studentTrx,
  coinVerifyRoute,
  mintAndTransferNFT,
};
