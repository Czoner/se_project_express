const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");

module.exports.middleware = (req, res, next) => {
  const { Authorization } = req.headers;
  console.log(req.headers);
  if (!Authorization || !Authorization.startsWith("Bearer ")) {
    console.error("Authorization header is missing", Authorization);
    return res.status(401).send({ message: "Unauthorized" });
  }

  const token = Authorization.replace("Bearer ", "");
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
