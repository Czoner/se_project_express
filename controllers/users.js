const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const errors = require("../utils/errors");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  ConflictError,
} = require("../middlewares/error-handler");

// POST the use

const creatingUser = async (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  if (!{ email }) {
    throw new BadRequestError("Email is missing or null");
  }
  if (!{ password }) {
    throw new BadRequestError("Password is missing or null");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  return User.create({ name, avatar, email, password: hashedPassword })
    .then((user) => {
      if (!user) {
        throw new NotFoundError("No user with matching ID found");
      }
      res
        .status(201)
        .send({ name: user.name, avatar: user.avatar, email: user.email });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid data"));
      } else if (err.name === "MongoServerError" || err.code === 11001) {
        next(new ConflictError(err.message));
      } else {
        next(err);
      }
    });
};

// GET the user aka one single user

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  return User.findById(userId)
    .orFail()
    .then((user) => {
      if (!user) {
        throw new NotFoundError("No user with matching ID found");
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("No user with matching ID found"));
      } else if (err.name === "CastError") {
        next(new BadRequestError("The name string is in an invalid format"));
      } else {
        next(err);
      }
    });
};

// SIGNIN for the user

const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!{ email }) {
    throw new BadRequestError("Email is missing or null");
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw new NotFoundError("No user with matching ID found");
      }
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      res.status(200).send({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "Incorrect email or password") {
        next(new UnauthorizedError("Incorrect email or password"));
      } else {
        next(err);
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
      if (!user) {
        throw new NotFoundError("No user with matching ID found");
      }
      res.status(200).send({ user });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        next(new BadRequestError("The name string is in an invalid format"));
      } else {
        next(err);
      }
    });
};

module.exports = {
  creatingUser,
  getCurrentUser,
  login,
  updateProfile,
};
