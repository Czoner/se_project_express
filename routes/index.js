const router = require("express").Router();
const userRouter = require("./users");
const itemsRouter = require("./ClothingItems");
const errors = require("../utils/errors");
const { login, creatingUser } = require("../controllers/users");
const { middleware } = require("../middlewares/auth");
const {
  AuthenticationBody,
  UserInfoBodyValidation,
} = require("../middlewares/validation");

router.use("/users", middleware, userRouter);
router.use("/items", itemsRouter);
router.post("/signin", AuthenticationBody, login);
router.post("/signup", UserInfoBodyValidation, creatingUser);

router.use((req, res, next) => {
  next(new errors.Not_found("No Requested resource"));
});

module.exports = router;
