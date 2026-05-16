const Task = require("../models/Task");

const getTasks = async (req, res) => {
  try {
    const filter = req.user.role === "admin" ? {} : { assignedTo: req.user.id };
    const tasks = await Task.find(filter)
      .populate("assignedTo", "name email title attendanceStatus")
      .populate("assignedBy", "name")
      .populate("project", "name status")
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Failed to load tasks" });
  }
};

const createTask = async (req, res) => {
  try {
    const task = await Task.create({
      title: req.body.title,
      description: req.body.description,
      status: req.body.status || "todo",
      priority: req.body.priority || "medium",
      dueDate: req.body.dueDate || null,
      assignedTo: req.body.assignedTo,
      assignedBy: req.user.id,
      project: req.body.project,
      completedAt: req.body.status === "completed" ? new Date() : null,
    });

    const populated = await Task.findById(task._id)
      .populate("assignedTo", "name email title attendanceStatus")
      .populate("assignedBy", "name")
      .populate("project", "name status");

    res.status(201).json(populated);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Failed to create task" });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    const canManageTask =
      req.user.role === "admin" || String(task.assignedTo) === String(req.user.id);

    if (!canManageTask) {
      return res.status(403).json({ msg: "Access denied" });
    }

    if (req.body.title !== undefined) task.title = req.body.title;
    if (req.body.description !== undefined) task.description = req.body.description;
    if (req.body.priority !== undefined) task.priority = req.body.priority;
    if (req.body.dueDate !== undefined) task.dueDate = req.body.dueDate || null;
    if (req.body.project !== undefined && req.user.role === "admin") task.project = req.body.project;
    if (req.body.assignedTo !== undefined && req.user.role === "admin") task.assignedTo = req.body.assignedTo;
    if (req.body.status !== undefined) {
      task.status = req.body.status;
      task.completedAt = req.body.status === "completed" ? new Date() : null;
    }

    await task.save();

    const populated = await Task.findById(task._id)
      .populate("assignedTo", "name email title attendanceStatus")
      .populate("assignedBy", "name")
      .populate("project", "name status");

    res.json(populated);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Failed to update task" });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    res.json({ msg: "Task deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Failed to delete task" });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};
