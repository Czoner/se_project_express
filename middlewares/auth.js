const jwt = require("jsonwebtoken");
const errors = require("../utils/errors");

const { JWT_SECRET } = require("../utils/config");

module.exports.middleware = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    console.error("Authorization header is missing", authorization);
    return next(new errors.Unauthorized("Unauthorized"));
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.error("JWT verification failed:", err);
    return next(new errors.Unauthorized("Unauthorized"));
  }

  req.user = payload;
  return next();
};
