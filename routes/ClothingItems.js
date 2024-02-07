const {
  createClothingItem,
  getAllClothingItems,
  deleteClothingItem,
} = require("../controllers/clothingItems");

const router = require("express").Router();

router.get("/", getAllClothingItems);
router.post("/", createClothingItem);
router.delete("/:itemsId", deleteClothingItem);

module.exports = router;
