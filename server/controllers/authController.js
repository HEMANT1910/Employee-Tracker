const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  title: user.title,
  department: user.department,
  attendanceStatus: user.attendanceStatus,
  lastActiveAt: user.lastActiveAt,
});

const signup = async (req, res) => {
  try {
    const { name, email, password, role, title, department } = req.body;

    const exists = await User.findOne({ email: email?.toLowerCase() });

    if (exists) {
      return res.status(400).json({
        msg: "User already exists",
      });
    }

    const hash = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email: email.toLowerCase(),
      password: hash,
      role: role || "member",
      title: title || "Team Member",
      department: department || "Operations",
      attendanceStatus: "offline",
    });

    res.json({
      msg: "Signup Success",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      msg: "Server Error",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email?.toLowerCase() });

    if (!user) {
      return res.status(400).json({
        msg: "User not found",
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({
        msg: "Wrong password",
      });
    }

    user.attendanceStatus = "online";
    user.lastActiveAt = new Date();
    await user.save();

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      msg: "Login Success",
      token,
      user: sanitizeUser(user),
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      msg: "Server Error",
    });
  }
};
module.exports = {
  signup,
  login,
};
