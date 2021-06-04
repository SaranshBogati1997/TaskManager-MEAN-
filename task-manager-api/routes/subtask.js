const express = require("express");
const subTask = express.Router();
const SubTask = require("../models/subtask");
const Task = require("../models/task");
const User = require("../models/user");
//get lists
subTask.get("/", getUser, async (req, res) => {
  try {
    var userId = req.user._id;
    var tasks = await Task.find({ userId: userId });
    var taskIdArray = tasks.map((task) => `${task._id}`);

    var subTasks = await SubTask.find({});

    var subTaskArray = [];

    taskIdArray.forEach((taskId) => {
      var taskIdMatchingSubTasks = [
        ...subTasks.filter((s) => s._taskId === taskId),
      ];
      if (taskIdMatchingSubTasks.length > 0) {
        taskIdMatchingSubTasks.forEach(
          (t) => (subTaskArray = [...subTaskArray, t])
        );
      }
    });

    res.json({ status: 1, data: subTaskArray });
  } catch (e) {
    res.json({ status: 0, data: e.message });
  }
});

//add lists
subTask.post("", async (req, res) => {
  try {
    var title = req.body.title;
    var taskId = req.body._taskId;
    var subTask = new SubTask({
      title: title,
      _taskId: taskId,
    });
    var lists = await subTask.save(subTask);
    res.json({ status: 1, data: lists });
  } catch (e) {
    res.json({ status: 0, data: e.message });
  }
});

//delete lists
subTask.delete("/:id", async (req, res) => {
  try {
    var id = req.params.id;
    var subTask = await SubTask.findById(id);
    subTask.delete(subTask);
    res.json({ status: 1, data: "success" });
  } catch (e) {
    res.json({ status: 0, data: e.message });
  }
});

//update lists
subTask.patch("/:id", async (req, res) => {
  try {
    var subTask = await SubTask.findById(req.params.id);
    subTask.title = req.body.title;
    var updatedList = await subTask.save();
    res.json({ status: 1, data: updatedList });
  } catch (e) {
    res.json({ status: 0, data: e.message });
  }
});

function getUser(req,res,next){
  var bearerToken = req.headers["authorization"];
  var token = bearerToken.split(' ')[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if(err) res.sendStatus(401);
      else{
          req.user = user;
      }
      next();
  })
}

module.exports = subTask;
