const router = require("express").Router();
const {
  getMembers,
  createMember,
  updateMember,
  deleteMember,
  updateProfile,
  updateAttendance,
} = require("../controllers/userController");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

router.get("/users", auth, role(["admin"]), getMembers);
router.post("/users", auth, role(["admin"]), createMember);
router.put("/users/:id", auth, role(["admin"]), updateMember);
router.delete("/users/:id", auth, role(["admin"]), deleteMember);
router.put("/profile", auth, updateProfile);
router.put("/attendance", auth, updateAttendance);

module.exports = router;
