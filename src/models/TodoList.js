const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  text: String,
  completed: Boolean,
});

const todoListSchema = new mongoose.Schema({
  title: String,
  userId: {
    type: mongoose.ObjectId,
    ref: "User",
    required: true,
  },
  tasks: [taskSchema],
});

const TodoList = mongoose.model("TodoList", todoListSchema);

module.exports = TodoList;
