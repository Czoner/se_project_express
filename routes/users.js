const router = require("express").Router();
const { getUser } = require("../controllers/users");

router.get("/:userid", getUser);

module.exports = router;
