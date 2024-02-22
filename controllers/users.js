const errors = require("../utils/errors");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

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

const creatingUser = async (req, res) => {
  const { name, avatar, email, password } = req.body;
  console.log(req.body);
  if (!email) {
    return res.status(400).send({ message: "Email is missing or null" });
  }

  if (!password) {
    return res.status(400).send({ message: "Password is missing or null" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await User.create({ name, avatar, email, password: hashedPassword })
    .then((user) => {
      return res
        .status(201)
        .send({ name: user.name, avatar: user.avatar, email: user.email });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(errors.bad_request).send({ message: "Invalid data" });
      } else if (err.name === "MongoServerError" || err.code === 11001) {
        return res.status(errors.Conflict_error).send({ message: err.message });
      }
      return res
        .status(errors.internal_server_error)
        .send({ message: "An error has occurred on the server" });
    });
};

// GET the user aka one single user

const getCurrentUser = (req, res) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail()
    .then((user) => {
      return res.status(200).send(user);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(errors.not_found)
          .send({ message: "No Requested resource" });
      } else if (err.name === "CastError") {
        return res.status(errors.bad_request).send({ message: "Invalid data" });
      } else {
        return res
          .status(errors.internal_server_error)
          .send({ message: "An error has occurred on the server" });
      }
    });
};

// SIGNIN for the user

const login = (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).send({ message: "Email is missing or null" });
  }

  User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        return res.status(400).send({ message: "Invalid email or password" });
      }
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      res.status(200).send({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "Incorrect email or password") {
        return res.status(400).send({ message: err.message });
      } else if (err.name === "Unauthorized") {
        return res.status(401).send({ message: err.message });
      } else {
        return res.status(500).json({ message: "Internal Server Error" });
      }
    });
};

// PATCH update the current user

const updateProfile = (req, res) => {
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(
    { _id: req.user._id },
    { name: name, avatar: avatar },
    { new: true, runValidators: true, upsert: true },
  )
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "UnauthorizedError") {
        res.status(401).send({ message: "BOOM" });
      }
    });
};

module.exports = {
  getUsers,
  creatingUser,
  getCurrentUser,
  login,
  updateProfile,
};
