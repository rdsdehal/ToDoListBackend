const { createJWT } = require("../helpers/authentication");
const User = require("../models/User");
const TodoList = require("../models/TodoList");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();

router.post("/login", async function (req, res) {
  const user = await User.findOne({
    username: req.body.username,
  });

  if (!user) {
    return res.status(400).send({ error: "User not found" });
  }

  if (!(await bcrypt.compare(req.body.password, user.password))) {
    return res.status(400).send({ error: "Incorrect credentials" });
  }

  const lists = await TodoList.find({
    userId: user.id,
  });

  return res.send({ token: createJWT(user), lists });
});

router.post("/signup", async function (req, res) {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();

    return res.send({
      token: createJWT(user),
    });
  } catch (err) {
    res.status(500).json({ error: "Registration failed" });
  }
});

module.exports = router;
