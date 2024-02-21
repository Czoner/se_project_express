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

  const hashedpassword = await bcrypt.hash(password, 10);
  await User.create({ name, avatar, email, password })
    .then((user) => {
      if (!email) {
        return Promise.reject(
          new Error({ message: "a MongoDB duplicate error" }),
        );
      }
      res
        .status(201)
        .send({ name: user.name, avatar: user.avatar, email: user.email });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(errors.bad_request).send({ message: "Invalid data" });
      } else if (err.name === "MongoServerError") {
        return res.status(errors.Conflict_error).send({ message: err.message });
      }
      return res
        .status(errors.internal_server_error)
        .send({ message: "An error has occurred on the server" });
    });
};

// GET the user aka one single user

const getCurrentUser = (req, res) => {
  const { userid } = req.params;
  User.findById(userid)
    .orFail()
    .then((user) => {
      res.status(200).send(user._id);
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
};

// SIGNIN for the user

const login = (req, res) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      console.log("JWT_SECRET:", JWT_SECRET);
      const token = jwt.sign({ _id: user.id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      res.send({ token });
    })
    .catch((err) => {
      console.error(err.name);
      if (
        err.message === "Incorrect email or password" &&
        err.name === "Error"
      ) {
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
  console.log(req.user._id);
  User.findOneAndUpdate(
    { _id: req.user.id },
    { name, avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      res.status(200).send(user);
      console.log(res.statusCode);
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
