import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Building2, Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import api from "../../services/api";

export default function Signup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "member",
    title: "",
    department: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      await api.post("/signup", form);
      alert("Account created");
      navigate("/");
    } catch (err) {
      alert(err?.response?.data?.msg || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#0f172a_0%,#082f49_50%,#155e75_100%)] px-6 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[2rem] border border-white/10 bg-white shadow-2xl shadow-cyan-950/40 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="bg-slate-950 p-10 text-white">
            <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Create account</p>
            <h1 className="mt-4 text-4xl font-black">Build a better team workflow from day one.</h1>
            <p className="mt-4 text-slate-300">
              New members can join with a role, title, and department so they appear correctly in the admin panel and project assignments.
            </p>
          </div>

          <div className="p-8 sm:p-10">
            <h2 className="text-3xl font-bold text-slate-950">Register</h2>
            <p className="mt-2 text-sm text-slate-500">Create a new admin or member account.</p>

            <form onSubmit={handleSubmit} className="mt-8 grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium">Full Name</span>
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4">
                    <User size={18} className="text-slate-400" />
                    <input
                      value={form.name}
                      onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                      className="w-full py-4 outline-none"
                      placeholder="Enter full name"
                      required
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium">Email</span>
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4">
                    <Mail size={18} className="text-slate-400" />
                    <input
                      type="email"
                      value={form.email}
                      onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                      className="w-full py-4 outline-none"
                      placeholder="Enter email"
                      required
                    />
                  </div>
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium">Title</span>
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4">
                    <User size={18} className="text-slate-400" />
                    <input
                      value={form.title}
                      onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                      className="w-full py-4 outline-none"
                      placeholder="Frontend Developer"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium">Department</span>
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4">
                    <Building2 size={18} className="text-slate-400" />
                    <input
                      value={form.department}
                      onChange={(event) => setForm((prev) => ({ ...prev, department: event.target.value }))}
                      className="w-full py-4 outline-none"
                      placeholder="Engineering"
                    />
                  </div>
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium">Role</span>
                  <select
                    value={form.role}
                    onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value }))}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-4 outline-none"
                  >
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium">Password</span>
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4">
                    <Lock size={18} className="text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                      className="w-full py-4 outline-none"
                      placeholder="Create password"
                      required
                    />
                    <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="text-slate-500">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </label>
              </div>

              <button
                disabled={loading}
                className="mt-2 rounded-2xl bg-slate-950 px-4 py-4 font-semibold text-white transition hover:bg-cyan-600 disabled:opacity-70"
              >
                {loading ? "Creating..." : "Create Account"}
              </button>
            </form>

            <p className="mt-6 text-sm text-slate-500">
              Already have an account?
              <Link to="/" className="ml-2 font-semibold text-cyan-700">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
