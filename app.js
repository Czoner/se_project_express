const express = require("express");
const { default: mongoose } = require("mongoose");
const mainRouter = require("./routes/index");
const { middleware } = require("./middlewares/auth");

const app = express();

const { PORT = 3001 } = process.env;

app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: "65c170c4a9f1b61e339ecd5c",
  };
  next();
});
app.use("/", middleware, mainRouter);

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to the DB");
  })
  .catch(console.error);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
