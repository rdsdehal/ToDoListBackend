const jwt = require("jsonwebtoken");
const { JWT_KEY: secretKey } = require("../config");
const User = require("../models/User");

module.exports.createJWT = function (user) {
  return jwt.sign(
    {
      userId: user.id,
    },
    secretKey,
    {
      expiresIn: "1d",
    }
  );
};

module.exports.verifyJWT = async function (token) {
  try {
    const decoded = jwt.verify(token, secretKey);

    const userId = decoded.userId;

    const user = await User.findById(userId);

    if (!user) {
      return null;
    }

    return user;
  } catch (err) {
    return null;
  }
};

module.exports.authenticated = async function (req, res, next) {
  try {
    const authorization = req.header("Authorization");
    if (!authorization) {
      return res.status(401).json({ error: "Access denied" });
    }

    const [type, token] = authorization.split(" ");

    if (type != "Bearer" || !token) {
      return res.status(401).json({ error: "Access denied" });
    }

    const user = await module.exports.verifyJWT(token);

    if (!user) {
      return res.status(401).json({ error: "Access denied" });
    }

    req.user = user;

    next();
  } catch (err) {
    console.error(err);

    if (!token) return res.status(401).json({ error: "Access denied" });
  }
};
