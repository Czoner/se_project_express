const clothingItem = require("../models/clothingItem");
const errors = require("../utils/errors");

//POST the new Clothing item

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
          .send({ message: "Requested resource was invalid " });
      }
      return res
        .status(errors.internal_server_error)
        .send({ message: "An error has occurred on the server", err });
    });
};

//GET all Clothing items

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
      if (err.name === "ValidationError") {
        res
          .status(errors.bad_request)
          .send({ message: "Requested resource was invalid " });
      }
      return res
        .status(errors.internal_server_error)
        .send({ message: "An error has occurred on the server", err });
    });
};

//DELETE the Clothing item

const deleteClothingItem = (req, res) => {
  console.log(req);
  console.log(req.body);

  clothingItem
    .findByIdAndRemove(req.params._id)
    .orFail()
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        res
          .status(errors.bad_request)
          .send({ message: "Requested resource was invalid " });
      } else if (err.name === "CastError") {
        res.status(errors.not_found).send({ message: "No Requested resource" });
      }
      return res
        .status(errors.internal_server_error)
        .send({ message: "An error has occurred on the server", err });
    });
};

// PUT Likes on item

module.exports.likeItem = (req, res) =>
  clothingItem
    .findByIdAndUpdate(
      req.params.itemId,
      { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
      { new: true },
    )
    .then((addLike) => {
      res.send({ data: addLike });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        res
          .status(errors.bad_request)
          .send({ message: "Requested resource was invalid " });
      }
      return res
        .status(errors.internal_server_error)
        .send({ message: "An error has occurred on the server", err });
    });

module.exports.dislikeItem = (req, res) =>
  clothingItem
    .findByIdAndUpdate(
      req.params.itemId,
      { $pull: { likes: req.user._id } }, // remove _id from the array
      { new: true },
    )
    .then((removeLike) => {
      res.send({ data: removeLike });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        res
          .status(errors.bad_request)
          .send({ message: "Requested resource was invalid " });
      } else if (err.name === "CastError") {
        res.status(errors.not_found).send({ message: "No Requested resource" });
      }
      return res
        .status(errors.internal_server_error)
        .send({ message: "An error has occurred on the server", err });
    });

module.exports = {
  getAllClothingItems,
  deleteClothingItem,
  createClothingItem,
};
