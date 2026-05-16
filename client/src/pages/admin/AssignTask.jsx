import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import api from "../../services/api";

const emptyForm = {
  title: "",
  description: "",
  priority: "medium",
  status: "todo",
  assignedTo: "",
  project: "",
  dueDate: "",
};

export default function AssignTask() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const loadData = async () => {
    const [taskRes, projectRes, memberRes] = await Promise.all([api.get("/tasks"), api.get("/projects"), api.get("/users")]);
    setTasks(taskRes.data);
    setProjects(projectRes.data);
    setMembers(memberRes.data.filter((member) => member.role === "member"));
  };

  useEffect(() => {
    loadData().catch(() => {});
  }, []);

  const submitTask = async (event) => {
    event.preventDefault();

    if (editingId) {
      await api.put(`/tasks/${editingId}`, form);
    } else {
      await api.post("/tasks", form);
    }

    setEditingId(null);
    setForm(emptyForm);
    loadData();
  };

  return (
    <div className="min-h-screen bg-slate-100 lg:flex">
      <Sidebar />

      <main className="flex-1 p-5 sm:p-8">
        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <section className="rounded-[1.8rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h1 className="text-3xl font-black text-slate-950">Task assignment</h1>
            <p className="mt-2 text-slate-500">Create tasks, assign members, and manage progress from one panel.</p>

            <form onSubmit={submitTask} className="mt-6 grid gap-4">
              <input
                value={form.title}
                onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                placeholder="Task title"
                className="rounded-2xl border border-slate-200 px-4 py-4 outline-none"
                required
              />
              <textarea
                value={form.description}
                onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
                placeholder="Task description"
                rows={4}
                className="rounded-2xl border border-slate-200 px-4 py-4 outline-none"
              />
              <div className="grid gap-4 md:grid-cols-2">
                <select
                  value={form.project}
                  onChange={(event) => setForm((prev) => ({ ...prev, project: event.target.value }))}
                  className="rounded-2xl border border-slate-200 px-4 py-4 outline-none"
                  required
                >
                  <option value="">Select project</option>
                  {projects.map((project) => (
                    <option key={project._id} value={project._id}>
                      {project.name}
                    </option>
                  ))}
                </select>
                <select
                  value={form.assignedTo}
                  onChange={(event) => setForm((prev) => ({ ...prev, assignedTo: event.target.value }))}
                  className="rounded-2xl border border-slate-200 px-4 py-4 outline-none"
                  required
                >
                  <option value="">Select member</option>
                  {members.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <select
                  value={form.priority}
                  onChange={(event) => setForm((prev) => ({ ...prev, priority: event.target.value }))}
                  className="rounded-2xl border border-slate-200 px-4 py-4 outline-none"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                <select
                  value={form.status}
                  onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))}
                  className="rounded-2xl border border-slate-200 px-4 py-4 outline-none"
                >
                  <option value="todo">Todo</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={(event) => setForm((prev) => ({ ...prev, dueDate: event.target.value }))}
                  className="rounded-2xl border border-slate-200 px-4 py-4 outline-none"
                />
              </div>
              <div className="flex gap-3">
                <button className="rounded-2xl bg-slate-950 px-5 py-3 font-semibold text-white">
                  {editingId ? "Update Task" : "Assign Task"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setForm(emptyForm);
                    }}
                    className="rounded-2xl border border-slate-300 px-5 py-3 font-semibold text-slate-700"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </section>

          <section className="space-y-4">
            {tasks.map((task) => (
              <article key={task._id} className="rounded-[1.8rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-950">{task.title}</h2>
                    <p className="mt-2 text-slate-500">{task.description || "No description added."}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-2 text-sm font-semibold capitalize text-slate-700">
                    {task.status}
                  </span>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-4">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Member</p>
                    <p className="mt-2 font-semibold text-slate-950">{task.assignedTo?.name}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Project</p>
                    <p className="mt-2 font-semibold text-slate-950">{task.project?.name}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Priority</p>
                    <p className="mt-2 font-semibold capitalize text-slate-950">{task.priority}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Due date</p>
                    <p className="mt-2 font-semibold text-slate-950">
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "Not set"}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => {
                      setEditingId(task._id);
                      setForm({
                        title: task.title,
                        description: task.description,
                        priority: task.priority,
                        status: task.status,
                        assignedTo: task.assignedTo?._id,
                        project: task.project?._id,
                        dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
                      });
                    }}
                    className="rounded-2xl bg-slate-950 px-4 py-3 text-white"
                  >
                    Edit
                  </button>
                  <button
                    onClick={async () => {
                      await api.delete(`/tasks/${task._id}`);
                      loadData();
                    }}
                    className="rounded-2xl bg-rose-600 px-4 py-3 text-white"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </section>
        </div>
      </main>
    </div>
  );
}
