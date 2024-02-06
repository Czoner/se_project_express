const { getUsers, creatingUser, getUser } = require("../controllers/users");

const router = require("express").Router();

router.get("/", getUsers);
router.get("/:userid", getUser);
router.post("/", creatingUser);

module.exports = router;
