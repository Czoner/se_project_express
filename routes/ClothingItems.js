const router = require("express").Router();
const {
  createClothingItem,
  getAllClothingItems,
  deleteClothingItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");
const { middleware } = require("../middlewares/auth");
const {
  validateId,
  ClothingValidation,
  validatePutClothingBody,
} = require("../middlewares/validation");

router.get("/", getAllClothingItems);
router.use(middleware);
router.post("/", ClothingValidation, createClothingItem);
router.delete("/:itemsId", validateId, deleteClothingItem);
router.put("/:itemsId/likes", validatePutClothingBody, likeItem);
router.delete("/:itemsId/likes", validateId, dislikeItem);

module.exports = router;
