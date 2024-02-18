const express = require("express");
const { default: mongoose } = require("mongoose");
const mainRouter = require("./routes/index");
const { middleware } = require("./middlewares/auth");

const app = express();

const { PORT = 3001 } = process.env;

app.use("/", middleware, mainRouter);

app.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to the DB");
  })
  .catch(console.error);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
