const router = require("express").Router();
const { getUsers, creatingUser, getUser } = require("../controllers/users");

router.get("/", getUsers);
router.get("/:userid", getUser);
router.post("/", creatingUser);

module.exports = router;
