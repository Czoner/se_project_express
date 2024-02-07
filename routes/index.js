const router = require("express").Router();
const userRouter = require("./users");
const itemsRouter = require("./ClothingItems");
const errors = require("../utils/errors");

router.use("/users", userRouter);
router.use("/items", itemsRouter);

router.use((req, res) => {
  res.status(errors.not_found).send({ message: "No Requested resource" });
});

module.exports = router;
