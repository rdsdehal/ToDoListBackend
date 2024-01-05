const { authenticated } = require("../helpers/authentication");
const TodoList = require("../models/TodoList");
const express = require("express");
const router = express.Router();

router.use(authenticated);
router.post("/", async function (req, res) {
  const list = new TodoList({
    userId: req.user.id,
    title: req.body.title,
    tasks: [],
  });

  await list.save();

  return res.send(list);
});

router.post("/:id/tasks/", async function (req, res) {
  const list = await TodoList.findById(req.params.id);

  if (!list || String(list.userId) != String(req.user.id)) {
    return res.status(404).send("Not Found");
  }

  list.tasks.push({
    text: req.body.text,
    completed: false,
  });

  await list.save();

  res.send(list);
});

router.delete("/:id/tasks/:taskId/", async function (req, res) {
  const list = await TodoList.findById(req.params.id);

  if (!list || String(list.userId) != req.user.id) {
    return res.status(404).send("Not Found");
  }

  list.tasks.remove({
    _id: req.params.taskId,
  });

  await list.save();

  res.send(list);
});

router.put("/:id/tasks/:taskId/", async function (req, res) {
  const list = await TodoList.findById(req.params.id);

  if (!list || String(list.userId) != String(req.user.id)) {
    return res.status(404).send("Not Found");
  }
  console.log(list);
  console.log(req.params);
  const task = list.tasks.find((task) =>
    task.id == req.params.taskId
  );

  if (!task) {
    return res.status(404).send("Not found");
  }

  task.completed = !!req.body.completed;

  await list.save();

  res.send(list);
});

router.get("/", async function (req, res) {
  res.send(
    await TodoList.find({
      userId: req.user.id,
    })
  );
});

module.exports = router;
