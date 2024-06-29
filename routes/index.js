const router = require("express").Router();
const userRouter = require("./users");
const itemsRouter = require("./ClothingItems");
const { login, creatingUser } = require("../controllers/users");
const { middleware } = require("../middlewares/auth");
const {
  AuthenticationBody,
  UserInfoBodyValidation,
} = require("../middlewares/validation");
const { NotFoundError } = require("../utils/NotFoundError");

router.use("/users", middleware, userRouter);
router.use("/items", itemsRouter);
router.post("/signin", AuthenticationBody, login);
router.post("/signup", UserInfoBodyValidation, creatingUser);

router.use((req, res, next) => {
  next(new NotFoundError("No Requested resource"));
});

module.exports = router;
