const router = require("express").Router();
const {
  getAdminDashboard,
  getMemberDashboard,
} = require("../controllers/dashboardController");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

router.get("/dashboard/admin", auth, role(["admin"]), getAdminDashboard);
router.get("/dashboard/member", auth, role(["member"]), getMemberDashboard);

module.exports = router;
