const router = require("express").Router();
const { getCurrentUser, updateProfile } = require("../controllers/users");
const { middleware } = require("../middlewares/auth");

router.get("/:userid", middleware, getCurrentUser);
router.patch("/me", updateProfile);

module.exports = router;
