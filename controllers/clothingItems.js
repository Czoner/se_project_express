const clothingItem = require("../models/clothingItem");

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
      res.status(500).send({ message: "Error from createItem", err });
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
      console.log(err.name);
      res.status(500).send({ message: "Error from getItem", err });
    });
};

//DELETE the Clothing item

const deleteClothingItem = (req, res) => {
  console.log(req);
  console.log(req.body);

  clothingItem
    .findByIdAndRemove(req.params._id)
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: "Error from deleteItem", err });
    });
};

module.exports = {
  getAllClothingItems,
  deleteClothingItem,
  createClothingItem,
};
