require("dotenv").config({ path: __dirname + "/../.env" });
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const userRoute = require("./routes/user.routes");
const busRoute = require("./routes/busFee.routes");
const { default: mongoose } = require("mongoose");

const PORT = process.env.PORT || 5000;

const app = express();

const corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));

// Parse incoming requests with JSON payloads
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.status(200).send({ status: "healthy" });
});

app.use("/api", userRoute);
app.use("/api", busRoute);

app.listen(PORT, async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`Connected to DB:: `, process.env.DB_URL);
  } catch (error) {
    console.error(error);
  }
  console.log(`Server running on PORT: ${PORT}`);
});
