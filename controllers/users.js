const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const errors = require("../utils/errors");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");

// POST the use

const creatingUser = async (req, res) => {
  const { name, avatar, email, password } = req.body;
  console.log("Name:", name);
  console.log("Avatar:", avatar);
  console.log("Email:", email);
  console.log("Password:", password);
  console.log(req.body);
  if (!email) {
    return res
      .status(errors.bad_request)
      .send({ message: "Email is missing or null" });
  }

  if (!password) {
    return res
      .status(errors.bad_request)
      .send({ message: "Password is missing or null" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  return User.create({ name, avatar, email, password: hashedPassword })
    .then((user) =>
      res
        .status(201)
        .send({ name: user.name, avatar: user.avatar, email: user.email }),
    )
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        res.status(errors.bad_request).send({ message: "Invalid data" });
      } else if (err.name === "MongoServerError" || err.code === 11001) {
        res.status(errors.Conflict_error).send({ message: err.message });
      } else {
        res
          .status(errors.internal_server_error)
          .send({ message: "An error has occurred on the server" });
      }
    });
};

// GET the user aka one single user

const getCurrentUser = (req, res) => {
  const userId = req.user._id;
  return User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
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
};

// SIGNIN for the user

const login = (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res
      .status(errors.bad_request)
      .send({ message: "Email is missing or null" });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      res.status(200).send({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "Incorrect email or password") {
        res.status(errors.Unauthorized).send({ message: err.message });
      } else {
        res
          .status(errors.internal_server_error)
          .json({ message: "Internal Server Error" });
      }
    });
};

// PATCH update the current user

const updateProfile = (req, res) => {
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(
    { _id: req.user._id },
    { name, avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        res.status(errors.bad_request).send({ message: err.message });
      } else {
        res
          .status(errors.internal_server_error)
          .json({ message: "Internal Server Error" });
      }
    });
};

module.exports = {
  creatingUser,
  getCurrentUser,
  login,
  updateProfile,
};
