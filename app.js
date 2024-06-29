require("dotenv").config();
const helmet = require("helmet");
const express = require("express");
const { default: mongoose } = require("mongoose");
const { errors } = require("celebrate");
const cors = require("cors");
const limiter = require("./utils/limiter");
const mainRouter = require("./routes/index");
const { errorHandler } = require("./middlewares/error-handler");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const app = express();

const { PORT = 3001 } = process.env;

app.use(limiter);
app.use(helmet());
app.use(express.json());
app.use(cors());
app.use(requestLogger);
app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});
app.use("/", mainRouter);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to the DB");
  })
  .catch(console.error);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
