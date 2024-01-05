const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { MONGO_URI, PORT } = require("./config");
const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use("/auth", require("./apis/authentication"));
app.use("/todo-lists/", require("./apis/todoList"));

mongoose.connect(MONGO_URI).then(() => {
  console.log("Connected to mongo db");
  app.listen(PORT, () => console.log("Server running on port", PORT));
});
