const Project = require("../models/Project");
const Task = require("../models/Task");

const formatProject = async (projectDoc) => {
  const taskCounts = await Task.find({ project: projectDoc._id });
  const completedTasks = taskCounts.filter((task) => task.status === "completed").length;
  const totalTasks = taskCounts.length;
  const progress = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return {
    ...projectDoc.toObject(),
    progress,
    totalTasks,
    completedTasks,
  };
};

const createProject = async (req, res) => {
  try {
    const project = await Project.create({
      name: req.body.name,
      description: req.body.description,
      status: req.body.status || "planning",
      deadline: req.body.deadline || null,
      members: req.body.members || [],
      createdBy: req.user.id,
    });

    const populated = await Project.findById(project._id).populate("members", "name email title attendanceStatus");
    res.status(201).json(await formatProject(populated));
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Failed to create project" });
  }
};

const getProjects = async (req, res) => {
  try {
    const filter = req.user.role === "admin" ? {} : { members: req.user.id };
    const projects = await Project.find(filter)
      .populate("members", "name email title attendanceStatus")
      .sort({ createdAt: -1 });

    const payload = await Promise.all(projects.map(formatProject));
    res.json(payload);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Failed to load projects" });
  }
};

const updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        description: req.body.description,
        status: req.body.status,
        deadline: req.body.deadline || null,
        members: req.body.members || [],
      },
      { new: true, runValidators: true }
    ).populate("members", "name email title attendanceStatus");

    if (!project) {
      return res.status(404).json({ msg: "Project not found" });
    }

    res.json(await formatProject(project));
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Failed to update project" });
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ msg: "Project not found" });
    }

    await Promise.all([
      Task.deleteMany({ project: project._id }),
      Project.findByIdAndDelete(project._id),
    ]);

    res.json({ msg: "Deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Failed to delete project" });
  }
};

module.exports = {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
};
