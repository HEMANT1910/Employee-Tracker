import { useEffect, useMemo, useState } from "react";
import Sidebar from "../../components/Sidebar";
import api from "../../services/api";

const emptyForm = {
  name: "",
  description: "",
  deadline: "",
  status: "planning",
  members: [],
};

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const memberOptions = useMemo(() => members.filter((member) => member.role === "member"), [members]);

  const loadData = async () => {
    const [projectRes, memberRes] = await Promise.all([api.get("/projects"), api.get("/users")]);
    setProjects(projectRes.data);
    setMembers(memberRes.data);
  };

  useEffect(() => {
    loadData().catch(() => {});
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (editingId) {
      await api.put(`/projects/${editingId}`, form);
    } else {
      await api.post("/projects", form);
    }
    setForm(emptyForm);
    setEditingId(null);
    loadData();
  };

  const handleEdit = (project) => {
    setEditingId(project._id);
    setForm({
      name: project.name,
      description: project.description,
      deadline: project.deadline ? project.deadline.slice(0, 10) : "",
      status: project.status,
      members: project.members.map((member) => member._id),
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 lg:flex">
      <Sidebar />

      <main className="flex-1 p-5 sm:p-8">
        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <section className="rounded-[1.8rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h1 className="text-3xl font-black text-slate-950">Project management</h1>
            <p className="mt-2 text-slate-500">Create, edit, and assign projects to your team members.</p>

            <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
              <input
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="Project name"
                className="rounded-2xl border border-slate-200 px-4 py-4 outline-none"
                required
              />
              <textarea
                value={form.description}
                onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
                placeholder="Description"
                rows={4}
                className="rounded-2xl border border-slate-200 px-4 py-4 outline-none"
              />
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  type="date"
                  value={form.deadline}
                  onChange={(event) => setForm((prev) => ({ ...prev, deadline: event.target.value }))}
                  className="rounded-2xl border border-slate-200 px-4 py-4 outline-none"
                />
                <select
                  value={form.status}
                  onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))}
                  className="rounded-2xl border border-slate-200 px-4 py-4 outline-none"
                >
                  <option value="planning">Planning</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="rounded-2xl border border-slate-200 p-4">
                <p className="font-semibold text-slate-900">Assign members</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {memberOptions.map((member) => (
                    <label key={member.id} className="flex items-center gap-3 rounded-2xl bg-slate-50 px-3 py-3">
                      <input
                        type="checkbox"
                        checked={form.members.includes(member.id)}
                        onChange={() =>
                          setForm((prev) => ({
                            ...prev,
                            members: prev.members.includes(member.id)
                              ? prev.members.filter((id) => id !== member.id)
                              : [...prev.members, member.id],
                          }))
                        }
                      />
                      <span>
                        {member.name}
                        <span className="ml-2 text-sm text-slate-500">{member.title}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button className="rounded-2xl bg-slate-950 px-5 py-3 font-semibold text-white">
                  {editingId ? "Update Project" : "Create Project"}
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

          <section className="grid gap-5">
            {projects.map((project) => (
              <article key={project._id} className="rounded-[1.8rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-950">{project.name}</h2>
                    <p className="mt-2 text-slate-500">{project.description || "No description added."}</p>
                  </div>
                  <span className="rounded-full bg-cyan-50 px-4 py-2 text-sm font-semibold capitalize text-cyan-700">
                    {project.status}
                  </span>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Deadline</p>
                    <p className="mt-2 font-semibold text-slate-950">
                      {project.deadline ? new Date(project.deadline).toLocaleDateString() : "Not set"}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Tasks completed</p>
                    <p className="mt-2 font-semibold text-slate-950">
                      {project.completedTasks}/{project.totalTasks}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Progress</p>
                    <p className="mt-2 font-semibold text-slate-950">{project.progress}%</p>
                  </div>
                </div>

                <div className="mt-5 h-3 rounded-full bg-slate-200">
                  <div className="h-3 rounded-full bg-cyan-500" style={{ width: `${project.progress}%` }} />
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {project.members.map((member) => (
                    <span key={member._id} className="rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-700">
                      {member.name}
                    </span>
                  ))}
                </div>

                <div className="mt-6 flex gap-3">
                  <button onClick={() => handleEdit(project)} className="rounded-2xl bg-slate-950 px-4 py-3 text-white">
                    Edit
                  </button>
                  <button
                    onClick={async () => {
                      await api.delete(`/projects/${project._id}`);
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
