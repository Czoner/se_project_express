const errors = require("../utils/errors");
const clothingItem = require("../models/clothingItem");

// POST the new Clothing item

const createClothingItem = (req, res) => {
  console.log(req);
  console.log(req.body);

  const { name, weather, imageURL, owner } = req.body;

  clothingItem
    .create({ name, weather, imageURL, owner })
    .then((item) => {
      res.send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        res
          .status(errors.bad_request)
          .send({ message: "Requested resource was invalid" });
      }
      return res
        .status(errors.internal_server_error)
        .send({ message: "An error has occurred on the server", err });
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
        .send({ message: "An error has occurred on the server", err });
    });
};

// DELETE the Clothing item

const deleteClothingItem = (req, res) => {
  console.log(req);
  console.log(req.body);

  clothingItem
    .findByIdAndRemove(req.params.itemsId)
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
      }
      return res
        .status(errors.internal_server_error)
        .send({ message: "An error has occurred on the server", err });
    });
};

// PUT Likes on item

const likeItem = (req, res) =>
  clothingItem
    .findByIdAndUpdate(
      req.params.itemId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
    .onFail()
    .then((addLike) => {
      res.send({ data: addLike });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        res.status(errors.not_found).send({ message: "No Requested resource" });
      } else if (err.name === "CastError") {
        res.status(errors.bad_request).send({ message: "Invalid data" });
      }
      return res
        .status(errors.internal_server_error)
        .send({ message: "An error has occurred on the server", err });
    });

// DELETE likes on item

const dislikeItem = (req, res) =>
  clothingItem
    .findByIdAndUpdate(
      req.params.itemId,
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
      }
      return res
        .status(errors.internal_server_error)
        .send({ message: "An error has occurred on the server", err });
    });

module.exports = {
  getAllClothingItems,
  deleteClothingItem,
  createClothingItem,
  likeItem,
  dislikeItem,
};
