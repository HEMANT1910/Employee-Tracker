import { useEffect, useState } from "react";
import { CheckCircle2, ClipboardList, FolderKanban, PlayCircle, Wifi } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import api from "../../services/api";

export default function UserDashboard() {
  const [data, setData] = useState(null);

  const loadData = () => api.get("/dashboard/member").then((res) => setData(res.data));

  useEffect(() => {
    loadData().catch(() => {});
  }, []);

  const setAttendance = async (attendanceStatus) => {
    const res = await api.put("/attendance", { attendanceStatus });
    localStorage.setItem("user", JSON.stringify(res.data));
    loadData();
  };

  const stats = [
    { label: "My Tasks", value: data?.stats?.totalTasks || 0, icon: <ClipboardList size={20} /> },
    { label: "In Progress", value: data?.stats?.activeTasks || 0, icon: <PlayCircle size={20} /> },
    { label: "Completed", value: data?.stats?.completedTasks || 0, icon: <CheckCircle2 size={20} /> },
    { label: "Projects", value: data?.stats?.joinedProjects || 0, icon: <FolderKanban size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-100 lg:flex">
      <Sidebar />

      <main className="flex-1 p-5 sm:p-8">
        <section className="rounded-[2rem] bg-[linear-gradient(135deg,#082f49_0%,#0f766e_55%,#67e8f9_100%)] p-8 text-white shadow-2xl shadow-cyan-900/20">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-cyan-100/90">Member dashboard</p>
              <h1 className="mt-3 text-4xl font-black">{data?.user?.name || "Team member"}</h1>
              <p className="mt-3 text-cyan-50/90">
                {data?.user?.title || "Team Member"} • {data?.user?.department || "Operations"}
              </p>
            </div>
            <div className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur">
              <div className="flex items-center gap-3">
                <Wifi size={18} />
                <div>
                  <p className="text-sm text-cyan-100/80">Attendance</p>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => setAttendance("online")}
                      className={`rounded-full px-4 py-2 text-sm font-semibold ${
                        data?.user?.attendanceStatus === "online" ? "bg-white text-slate-950" : "bg-white/10 text-white"
                      }`}
                    >
                      Online
                    </button>
                    <button
                      onClick={() => setAttendance("offline")}
                      className={`rounded-full px-4 py-2 text-sm font-semibold ${
                        data?.user?.attendanceStatus === "offline" ? "bg-white text-slate-950" : "bg-white/10 text-white"
                      }`}
                    >
                      Offline
                    </button>
                  </div>
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

        <section className="mt-8 grid gap-6 xl:grid-cols-[1fr_1fr]">
          <div className="rounded-[1.7rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-xl font-bold text-slate-950">Recent tasks</h2>
            <div className="mt-5 space-y-4">
              {data?.tasks?.map((task) => (
                <div key={task._id} className="rounded-2xl border border-slate-200 p-4">
                  <p className="font-semibold text-slate-950">{task.title}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {task.project?.name} • {task.status}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.7rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-xl font-bold text-slate-950">Joined projects</h2>
            <div className="mt-5 space-y-4">
              {data?.projects?.map((project) => (
                <div key={project._id} className="rounded-2xl border border-slate-200 p-4">
                  <p className="font-semibold text-slate-950">{project.name}</p>
                  <p className="mt-1 text-sm capitalize text-slate-500">
                    {project.status} • {project.deadline ? new Date(project.deadline).toLocaleDateString() : "No deadline"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
