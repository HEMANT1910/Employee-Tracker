import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import api from "../../services/api";

export default function MyTasks() {
  const [tasks, setTasks] = useState([]);

  const loadTasks = () => api.get("/tasks").then((res) => setTasks(res.data));

  useEffect(() => {
    loadTasks().catch(() => {});
  }, []);

  const updateStatus = async (taskId, status) => {
    await api.put(`/tasks/${taskId}`, { status });
    loadTasks();
  };

  return (
    <div className="min-h-screen bg-slate-100 lg:flex">
      <Sidebar />

      <main className="flex-1 p-5 sm:p-8">
        <section className="rounded-[1.8rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h1 className="text-3xl font-black text-slate-950">My tasks</h1>
          <p className="mt-2 text-slate-500">Update progress and mark work completed when you finish.</p>

          <div className="mt-6 grid gap-4">
            {tasks.map((task) => (
              <article key={task._id} className="rounded-[1.6rem] border border-slate-200 p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-950">{task.title}</h2>
                    <p className="mt-2 text-slate-500">{task.description || "No description added."}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-2 text-sm font-semibold capitalize text-slate-700">
                    {task.status}
                  </span>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-3">
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

                <div className="mt-6 flex flex-wrap gap-3">
                  {["todo", "in-progress", "completed"].map((status) => (
                    <button
                      key={status}
                      onClick={() => updateStatus(task._id, status)}
                      className={`rounded-2xl px-4 py-3 font-semibold capitalize ${
                        task.status === status ? "bg-slate-950 text-white" : "border border-slate-300 text-slate-700"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
