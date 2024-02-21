const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");

module.exports.middleware = (req, res, next) => {
  const { authorization } = req.headers;
  console.log(req.headers);
  if (!authorization || !authorization.startsWith("Bearer ")) {
    console.error("Authorization header is missing", authorization);
    return res.status(401).send({ message: "Unauthorized" });
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.error("JWT verification failed:", err);
    return res.status(401).send({ message: "Unauthorized" });
  }

  req.user = payload;
  next();
};
