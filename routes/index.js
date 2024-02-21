const router = require("express").Router();
const userRouter = require("./users");
const itemsRouter = require("./ClothingItems");
const errors = require("../utils/errors");
const { login, creatingUser } = require("../controllers/users");
const { middleware } = require("../middlewares/auth");

router.use("/users", middleware, userRouter);
router.use("/items", itemsRouter);
router.post("/signin", login);
router.post("/signup", creatingUser);

router.use((req, res) => {
  res.status(errors.not_found).send({ message: "No Requested resource" });
});

module.exports = router;
