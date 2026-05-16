import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import api from "../../services/api";

export default function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const { data } = await api.post("/login", form);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate(
        data.user.role === "admin"
          ? "/admin"
          : "/user"
      );
    } catch (err) {
      alert(
        err?.response?.data?.msg ||
        "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">

        <div className="mb-8">
          <h2 className="text-3xl font-bold">
            Sign In
          </h2>

          <p className="text-sm text-slate-500 mt-2">
            Login to continue
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* Email */}

          <div>
            <label className="text-sm font-medium">
              Email
            </label>

            <div className="mt-2 flex items-center gap-3 rounded-2xl border px-4">
              <Mail
                size={18}
                className="text-slate-400"
              />

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@company.com"
                className="w-full py-4 outline-none"
                required
              />
            </div>
          </div>

          {/* Password */}

          <div>
            <label className="text-sm font-medium">
              Password
            </label>

            <div className="mt-2 flex items-center gap-3 rounded-2xl border px-4">
              <Lock
                size={18}
                className="text-slate-400"
              />

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter password"
                className="w-full py-4 outline-none"
                required
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-slate-950 py-4 text-white font-semibold hover:bg-cyan-500 hover:text-black"
          >
            {loading
              ? "Signing in..."
              : "Login"}

            {!loading &&
              <ArrowRight size={18} />
            }
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-slate-500">
          Need an account?

          <Link
            to="/signup"
            className="ml-2 text-cyan-700 font-semibold"
          >
            Sign up
          </Link>
        </p>

      </div>
    </div>
  );
}