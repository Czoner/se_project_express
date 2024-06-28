const router = require("express").Router();
const { getCurrentUser, updateProfile } = require("../controllers/users");
const { UpdateProfValidation } = require("../middlewares/validation");

router.get("/me", getCurrentUser);
router.patch("/me", UpdateProfValidation, updateProfile);

module.exports = router;
