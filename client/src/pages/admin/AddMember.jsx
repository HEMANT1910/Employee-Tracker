import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import api from "../../services/api";

export default function AddMember() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "member",
    title: "",
    department: "",
  });

  const submitMember = async (event) => {
    event.preventDefault();
    await api.post("/users", form);
    setForm({ name: "", email: "", password: "", role: "member", title: "", department: "" });
    alert("Member created");
  };

  return (
    <div className="min-h-screen bg-slate-100 lg:flex">
      <Sidebar />

      <main className="flex-1 p-5 sm:p-8">
        <section className="mx-auto max-w-3xl rounded-[1.8rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h1 className="text-3xl font-black text-slate-950">Add member</h1>
          <p className="mt-2 text-slate-500">Create a new team member or admin profile for the workspace.</p>

          <form onSubmit={submitMember} className="mt-6 grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <input
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="Full name"
                className="rounded-2xl border border-slate-200 px-4 py-4 outline-none"
                required
              />
              <input
                type="email"
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                placeholder="Email"
                className="rounded-2xl border border-slate-200 px-4 py-4 outline-none"
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <input
                value={form.title}
                onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                placeholder="Job title"
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
                placeholder="Temporary password"
                className="rounded-2xl border border-slate-200 px-4 py-4 outline-none"
                required
              />
              <select
                value={form.role}
                onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value }))}
                className="rounded-2xl border border-slate-200 px-4 py-4 outline-none"
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button className="rounded-2xl bg-slate-950 px-5 py-4 font-semibold text-white">Create Member</button>
          </form>
        </section>
      </main>
    </div>
  );
}
