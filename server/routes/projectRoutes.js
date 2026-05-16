const router = require("express").Router();
const {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

router.get("/projects", auth, getProjects);
router.post("/projects", auth, role(["admin"]), createProject);
router.put("/projects/:id", auth, role(["admin"]), updateProject);
router.delete("/projects/:id", auth, role(["admin"]), deleteProject);

module.exports = router;
