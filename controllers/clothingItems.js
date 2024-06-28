const clothingItem = require("../models/clothingItem");
const { BadRequestError } = require("../utils/BadRequestError");
const { NotFoundError } = require("../utils/NotFoundError");
const { ForbiddenError } = require("../utils/ForbiddenError");

// POST the new Clothing item

const createClothingItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;

  clothingItem
    .create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      res.send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid data"));
      }
      return next(err);
    });
};

// GET all Clothing items

const getAllClothingItems = (req, res, next) => {
  console.log(req);
  console.log(req.body);

  clothingItem
    .find({})
    .then((item) => {
      res.send(item);
    })
    .catch((err) => {
      console.error(err);
      return next(err);
    });
};

// DELETE the Clothing item

const deleteClothingItem = (req, res, next) => {
  console.log(req.params);
  clothingItem
    .findById(req.params.itemsId)
    .orFail()
    .then((item) => {
      if (!item.owner.equals(req.user._id)) {
        throw new ForbiddenError("Forbidden Error");
      }
      return clothingItem
        .findByIdAndRemove(req.params.itemsId)
        .then((deletedItem) => {
          res.send({ data: deletedItem });
        });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid data"));
      } else if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("No Requested resource"));
      } else {
        next(err);
      }
    });
};

// PUT Likes on item

const likeItem = (req, res, next) =>
  clothingItem
    .findByIdAndUpdate(
      req.params.itemsId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
    .orFail()
    .then((addLike) => {
      res.send({ data: addLike });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("No Requested resource"));
      } else if (err.name === "CastError") {
        next(new BadRequestError("Invalid data"));
      } else {
        next(err);
      }
    });

// DELETE likes on item

const dislikeItem = (req, res, next) =>
  clothingItem
    .findByIdAndUpdate(
      req.params.itemsId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
    .orFail()
    .then((removeLike) => {
      res.send({ data: removeLike });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("No Requested resource"));
      } else if (err.name === "CastError") {
        next(new BadRequestError("Invalid data"));
      } else {
        next(err);
      }
    });

module.exports = {
  getAllClothingItems,
  deleteClothingItem,
  createClothingItem,
  likeItem,
  dislikeItem,
};
