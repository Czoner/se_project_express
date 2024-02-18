const router = require("express").Router();
const {
  createClothingItem,
  getAllClothingItems,
  deleteClothingItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");
const { middleware } = require("../middlewares/auth");

router.get("/", getAllClothingItems);
router.post("/", middleware, createClothingItem);
router.delete("/:itemsId", middleware, deleteClothingItem);
router.put("/:itemsId/likes", middleware, likeItem);
router.delete("/:itemsId/likes", middleware, dislikeItem);

module.exports = router;
