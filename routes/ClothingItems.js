const {
  createClothingItem,
  getAllClothingItems,
  deleteClothingItem,
} = require("../controllers/clothingItems");

const router = require("express").Router();

router.get("/items", getAllClothingItems);
router.post("/items", createClothingItem);
router.delete("/items/:itemsId", deleteClothingItem);

module.exports = router;
