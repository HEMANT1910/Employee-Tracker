const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "member"],
      default: "member",
    },
    title: {
      type: String,
      default: "Team Member",
      trim: true,
    },
    department: {
      type: String,
      default: "Operations",
      trim: true,
    },
    attendanceStatus: {
      type: String,
      enum: ["online", "offline"],
      default: "offline",
    },
    lastActiveAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);
