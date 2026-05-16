const Project = require("../models/Project");
const Task = require("../models/Task");
const User = require("../models/User");

const getAdminDashboard = async (req, res) => {
  try {
    const [projects, members, tasks, completedTasks, recentTasks] = await Promise.all([
      Project.find().populate("members", "name").sort({ createdAt: -1 }),
      User.find({ role: "member" }).sort({ createdAt: -1 }),
      Task.find()
        .populate("assignedTo", "name")
        .populate("project", "name")
        .sort({ createdAt: -1 }),
      Task.countDocuments({ status: "completed" }),
      Task.find()
        .populate("assignedTo", "name")
        .populate("project", "name")
        .sort({ updatedAt: -1 })
        .limit(6),
    ]);

    const taskStatusCount = tasks.reduce(
      (acc, task) => {
        acc[task.status] += 1;
        return acc;
      },
      { todo: 0, "in-progress": 0, completed: 0 }
    );

    res.json({
      stats: {
        totalProjects: projects.length,
        totalMembers: members.length,
        totalTasks: tasks.length,
        completedTasks,
        onlineMembers: members.filter((member) => member.attendanceStatus === "online").length,
      },
      taskStatusCount,
      projects: projects.slice(0, 4),
      recentTasks,
      members: members.slice(0, 5),
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Failed to load admin dashboard" });
  }
};

const getMemberDashboard = async (req, res) => {
  try {
    const [user, tasks, projects] = await Promise.all([
      User.findById(req.user.id),
      Task.find({ assignedTo: req.user.id })
        .populate("project", "name status deadline")
        .sort({ dueDate: 1, createdAt: -1 }),
      Project.find({ members: req.user.id }).sort({ deadline: 1, createdAt: -1 }),
    ]);

    const completedTasks = tasks.filter((task) => task.status === "completed").length;

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        title: user.title,
        department: user.department,
        attendanceStatus: user.attendanceStatus,
        lastActiveAt: user.lastActiveAt,
      },
      stats: {
        totalTasks: tasks.length,
        completedTasks,
        activeTasks: tasks.filter((task) => task.status === "in-progress").length,
        joinedProjects: projects.length,
      },
      tasks: tasks.slice(0, 6),
      projects,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Failed to load member dashboard" });
  }
};

module.exports = {
  getAdminDashboard,
  getMemberDashboard,
};
