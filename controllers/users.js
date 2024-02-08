const errors = require("../utils/errors");
const User = require("../models/user");

// GET all users

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.error(err);
      return res
        .status(errors.internal_server_error)
        .send({ message: "An error has occurred on the server" });
    });
};

// POST the user

const creatingUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => {
      res.status(201).send(user);
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

// GET the user aka one single user

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
        res.status(errors.not_found).send({ message: "No Requested resource" });
      } else if (err.name === "CastError") {
        res.status(errors.bad_request).send({ message: "Invalid data" });
      } else {
        res
          .status(errors.internal_server_error)
          .send({ message: "An error has occurred on the server" });
      }
    });
};

module.exports = { getUsers, creatingUser, getUser };
