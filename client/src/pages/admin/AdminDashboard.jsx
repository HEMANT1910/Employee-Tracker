import { useEffect, useState } from "react";
import { Briefcase, CheckCircle2, ClipboardList, FolderKanban, Users, Wifi } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Sidebar from "../../components/Sidebar";
import api from "../../services/api";

export default function AdminDashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/dashboard/admin").then((res) => setData(res.data)).catch(() => {});
  }, []);

  const stats = [
    { label: "Projects", value: data?.stats?.totalProjects || 0, icon: <FolderKanban size={20} /> },
    { label: "Members", value: data?.stats?.totalMembers || 0, icon: <Users size={20} /> },
    { label: "Tasks", value: data?.stats?.totalTasks || 0, icon: <ClipboardList size={20} /> },
    { label: "Completed", value: data?.stats?.completedTasks || 0, icon: <CheckCircle2 size={20} /> },
  ];

  const chartData = data
    ? [
        { name: "Todo", count: data.taskStatusCount.todo },
        { name: "Doing", count: data.taskStatusCount["in-progress"] },
        { name: "Done", count: data.taskStatusCount.completed },
      ]
    : [];

  return (
    <div className="min-h-screen bg-slate-100 lg:flex">
      <Sidebar />

      <main className="flex-1 p-5 sm:p-8">
        <section className="overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,#0f172a_0%,#0f766e_48%,#22d3ee_100%)] p-8 text-white shadow-2xl shadow-cyan-900/20">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-cyan-100/90">Admin workspace</p>
              <h1 className="mt-3 text-4xl font-black">Welcome back, {user?.name}</h1>
              <p className="mt-3 max-w-2xl text-cyan-50/90">
                Track team activity, assign work faster, and keep projects moving with live member, task, and attendance data.
              </p>
            </div>
            <div className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur">
              <div className="flex items-center gap-3">
                <Wifi size={18} />
                <div>
                  <p className="text-sm text-cyan-100/80">Members online</p>
                  <p className="text-3xl font-bold">{data?.stats?.onlineMembers || 0}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => (
            <div key={item.label} className="rounded-[1.7rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">{item.label}</p>
                  <p className="mt-3 text-4xl font-black text-slate-950">{item.value}</p>
                </div>
                <div className="rounded-2xl bg-cyan-50 p-3 text-cyan-700">{item.icon}</div>
              </div>
            </div>
          ))}
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[1.7rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-slate-950 p-3 text-white">
                <Briefcase size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-950">Task status overview</h2>
                <p className="text-sm text-slate-500">See how work is distributed across the team.</p>
              </div>
            </div>
            <div className="mt-6 h-80">
              <ResponsiveContainer>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#0891b2" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-[1.7rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-xl font-bold text-slate-950">Recent assignments</h2>
            <div className="mt-5 space-y-4">
              {data?.recentTasks?.map((task) => (
                <div key={task._id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-950">{task.title}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        {task.project?.name} • {task.assignedTo?.name}
                      </p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-700">
                      {task.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
