const User = require("../models/user");

//GET all users

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      console.error(err);
      return res.status(500).send({ message: err.message });
    });
};

//POST the user

const creatingUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(400)
          .send({ message: "Requested resource not found" });
      }
      return res.status(500).send({ message: err.message });
    });
};

//GET the user aka one single user

const getUser = (req, res) => {
  const { userid } = req.params;
  User.findById(userid)
    .orFail()
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      console.error(err);
      console.log(err.name);
      if (err.name === "DocumentNotFoundError") {
        res.status(404).send({ message: err.message });
      } else if (err.name === "CastError") {
        res.status(400).send({ message: err.message });
      }
      return res
        .status(500)
        .send({ message: "error not working for geting ids" });
    });
};

module.exports = { getUsers, creatingUser, getUser };
