import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import api from "../../services/api";

export default function Settings() {
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");
  const [form, setForm] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    title: currentUser?.title || "",
    department: currentUser?.department || "",
    password: "",
    attendanceStatus: currentUser?.attendanceStatus || "online",
  });

  const saveProfile = async (event) => {
    event.preventDefault();
    const res = await api.put("/profile", form);
    localStorage.setItem("user", JSON.stringify(res.data));
    alert("Profile updated");
  };

  return (
    <div className="min-h-screen bg-slate-100 lg:flex">
      <Sidebar />

      <main className="flex-1 p-5 sm:p-8">
        <section className="mx-auto max-w-3xl rounded-[1.8rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h1 className="text-3xl font-black text-slate-950">Settings</h1>
          <p className="mt-2 text-slate-500">Update your account details and presence status.</p>

          <form onSubmit={saveProfile} className="mt-6 grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <input
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="Name"
                className="rounded-2xl border border-slate-200 px-4 py-4 outline-none"
              />
              <input
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                placeholder="Email"
                className="rounded-2xl border border-slate-200 px-4 py-4 outline-none"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <input
                value={form.title}
                onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                placeholder="Title"
                className="rounded-2xl border border-slate-200 px-4 py-4 outline-none"
              />
              <input
                value={form.department}
                onChange={(event) => setForm((prev) => ({ ...prev, department: event.target.value }))}
                placeholder="Department"
                className="rounded-2xl border border-slate-200 px-4 py-4 outline-none"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <input
                type="password"
                value={form.password}
                onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                placeholder="New password"
                className="rounded-2xl border border-slate-200 px-4 py-4 outline-none"
              />
              <select
                value={form.attendanceStatus}
                onChange={(event) => setForm((prev) => ({ ...prev, attendanceStatus: event.target.value }))}
                className="rounded-2xl border border-slate-200 px-4 py-4 outline-none"
              >
                <option value="online">Online</option>
                <option value="offline">Offline</option>
              </select>
            </div>
            <button className="rounded-2xl bg-slate-950 px-5 py-4 font-semibold text-white">Save Changes</button>
          </form>
        </section>
      </main>
    </div>
  );
}
