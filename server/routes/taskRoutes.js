const router = require("express").Router();
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

router.get("/tasks", auth, getTasks);
router.post("/tasks", auth, role(["admin"]), createTask);
router.put("/tasks/:id", auth, updateTask);
router.delete("/tasks/:id", auth, role(["admin"]), deleteTask);

module.exports = router;
