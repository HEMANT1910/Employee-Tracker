const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Task = require("../models/Task");
const Project = require("../models/Project");

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  title: user.title,
  department: user.department,
  attendanceStatus: user.attendanceStatus,
  lastActiveAt: user.lastActiveAt,
  createdAt: user.createdAt,
});

const getMembers = async (req, res) => {
  try {
    const members = await User.find().sort({ createdAt: -1 });
    const payload = await Promise.all(
      members.map(async (member) => {
        const [taskCount, completedCount, projectCount] = await Promise.all([
          Task.countDocuments({ assignedTo: member._id }),
          Task.countDocuments({ assignedTo: member._id, status: "completed" }),
          Project.countDocuments({ members: member._id }),
        ]);

        return {
          ...sanitizeUser(member),
          taskCount,
          completedCount,
          projectCount,
        };
      })
    );

    res.json(payload);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Failed to load members" });
  }
};

const createMember = async (req, res) => {
  try {
    const { name, email, password, role, title, department } = req.body;

    const exists = await User.findOne({ email: email?.toLowerCase() });
    if (exists) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hash = await bcrypt.hash(password || "password123", 10);
    const user = await User.create({
      name,
      email,
      password: hash,
      role: role || "member",
      title: title || "Team Member",
      department: department || "Operations",
      attendanceStatus: "offline",
    });

    res.status(201).json(sanitizeUser(user));
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Failed to create member" });
  }
};

const updateMember = async (req, res) => {
  try {
    const updates = {
      name: req.body.name,
      email: req.body.email?.toLowerCase(),
      role: req.body.role,
      title: req.body.title,
      department: req.body.department,
      attendanceStatus: req.body.attendanceStatus,
    };

    Object.keys(updates).forEach((key) => {
      if (updates[key] === undefined || updates[key] === "") {
        delete updates[key];
      }
    });

    const member = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!member) {
      return res.status(404).json({ msg: "Member not found" });
    }

    res.json(sanitizeUser(member));
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Failed to update member" });
  }
};

const deleteMember = async (req, res) => {
  try {
    const member = await User.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ msg: "Member not found" });
    }

    await Promise.all([
      Task.deleteMany({ assignedTo: member._id }),
      Project.updateMany(
        { members: member._id },
        { $pull: { members: member._id } }
      ),
      User.findByIdAndDelete(member._id),
    ]);

    res.json({ msg: "Member deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Failed to delete member" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const { name, email, password, title, department, attendanceStatus } = req.body;

    if (name) user.name = name;
    if (email) user.email = email.toLowerCase();
    if (title) user.title = title;
    if (department) user.department = department;
    if (attendanceStatus) {
      user.attendanceStatus = attendanceStatus;
      user.lastActiveAt = new Date();
    }
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    res.json(sanitizeUser(user));
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Failed to update profile" });
  }
};

const updateAttendance = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        attendanceStatus: req.body.attendanceStatus,
        lastActiveAt: new Date(),
      },
      { new: true }
    );

    res.json(sanitizeUser(user));
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Failed to update attendance" });
  }
};

module.exports = {
  getMembers,
  createMember,
  updateMember,
  deleteMember,
  updateProfile,
  updateAttendance,
};
