require("dotenv").config();

module.exports = {
  JWT_KEY: process.env.JWT_KEY,
  MONGO_URI: process.env.MONGO_URI,
  PORT: process.env.PORT,
};
