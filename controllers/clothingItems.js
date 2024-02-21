const errors = require("../utils/errors");
const clothingItem = require("../models/clothingItem");

// POST the new Clothing item

const createClothingItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  clothingItem
    .create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      res.send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(errors.bad_request).send({ message: "Invalid data" });
      }
      return res
        .status(errors.internal_server_error)
        .send({ message: "An error has occurred on the server" });
    });
};

// GET all Clothing items

const getAllClothingItems = (req, res) => {
  console.log(req);
  console.log(req.body);

  clothingItem
    .find({})
    .then((item) => {
      res.send(item);
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(errors.internal_server_error)
        .send({ message: "An error has occurred on the server" });
    });
};

// DELETE the Clothing item

const deleteClothingItem = (req, res) => {
  clothingItem
    .findById(req.params.itemsId)
    .then((item) => {
      if (!item.owner.equals(req.user.id)) {
        return res
          .status(errors.Forbidden_error)
          .send({ message: "Forbidden Error" });
      }
      return clothingItem.findByIdAndRemove(req.params.itemsId);
    })
    .orFail()
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        res.status(errors.bad_request).send({ message: "Invalid data" });
      } else if (err.name === "DocumentNotFoundError") {
        res.status(errors.not_found).send({ message: "No Requested resource" });
      } else {
        res
          .status(errors.internal_server_error)
          .send({ message: "An error has occurred on the server" });
      }
    });
};

// PUT Likes on item

const likeItem = (req, res) =>
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
        res.status(errors.not_found).send({ message: "No Requested resource" });
      } else if (err.name === "CastError") {
        res.status(errors.bad_request).send({ message: "Invalid data" });
      } else {
        res
          .status(errors.internal_server_error)
          .send({ message: "An error has occurred on the server" });
      }
    });

// DELETE likes on item

const dislikeItem = (req, res) =>
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
        res.status(errors.not_found).send({ message: "No Requested resource" });
      } else if (err.name === "CastError") {
        res.status(errors.bad_request).send({ message: "Invalid data" });
      } else {
        res
          .status(errors.internal_server_error)
          .send({ message: "An error has occurred on the server" });
      }
    });

module.exports = {
  getAllClothingItems,
  deleteClothingItem,
  createClothingItem,
  likeItem,
  dislikeItem,
};
