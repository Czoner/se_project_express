const router = require("express").Router();
const {
  createClothingItem,
  getAllClothingItems,
  deleteClothingItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

router.get("/", getAllClothingItems);
router.post("/", createClothingItem);
router.delete("/:itemsId", deleteClothingItem);
router.put("/:itemsId/likes", likeItem);
router.delete("/:itemsId/likes", dislikeItem);

module.exports = router;
