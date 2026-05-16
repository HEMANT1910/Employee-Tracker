import {
  Briefcase,
  ClipboardList,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  UserPlus,
  Users,
  X,
} from "lucide-react";

import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleNavigate = (path) => {
    navigate(path);
    setOpen(false);
  };

  const adminMenu = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: <LayoutDashboard size={18} />,
    },
    {
      name: "Projects",
      path: "/admin/projects",
      icon: <FolderKanban size={18} />,
    },
    {
      name: "Tasks",
      path: "/admin/assign",
      icon: <ClipboardList size={18} />,
    },
    {
      name: "Members",
      path: "/admin/members",
      icon: <Users size={18} />,
    },
    {
      name: "Add Member",
      path: "/admin/addmember",
      icon: <UserPlus size={18} />,
    },
    {
      name: "Settings",
      path: "/admin/settings",
      icon: <Settings size={18} />,
    },
  ];

  const memberMenu = [
    {
      name: "Dashboard",
      path: "/user",
      icon: <LayoutDashboard size={18} />,
    },
    {
      name: "My Tasks",
      path: "/user/tasks",
      icon: <ClipboardList size={18} />,
    },
    {
      name: "Settings",
      path: "/user/settings",
      icon: <Settings size={18} />,
    },
  ];

  const menu =
    user?.role === "admin"
      ? adminMenu
      : memberMenu;

  return (
    <>
      {/* Mobile Topbar */}

      <div className="lg:hidden sticky top-0 z-40 flex items-center justify-between border-b border-slate-800 bg-slate-950 p-4 text-white">
        <h1 className="font-bold text-lg">
          Team Manager
        </h1>

        <button
          onClick={() => setOpen(true)}
        >
          <Menu size={26} />
        </button>
      </div>

      {/* Overlay */}

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
        />
      )}

      {/* Sidebar */}

      <aside
        className={`
        fixed top-0 left-0 z-50
        flex min-h-screen w-72 flex-col
        border-r border-slate-800
        bg-slate-950 px-5 py-6 text-white
        transition-all duration-300

        ${
          open
            ? "translate-x-0"
            : "-translate-x-full"
        }

        lg:translate-x-0
        lg:static
        lg:flex
      `}
      >
        {/* Header */}

        <div className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-cyan-500/10 p-3 text-cyan-400">
              <Briefcase size={22} />
            </div>

            <div>
              <h2 className="font-bold">
                Team Manager
              </h2>

              <p className="text-xs text-slate-400">
                {user?.role === "admin"
                  ? "Administrator"
                  : "Member"}
              </p>
            </div>
          </div>

          <button
            onClick={() =>
              setOpen(false)
            }
            className="lg:hidden"
          >
            <X size={22} />
          </button>
        </div>

        {/* Profile */}

       <div className="mb-8 rounded-2xl bg-slate-900 p-4">
  <div className="flex items-center gap-3">

    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-400 font-semibold">
      {user?.name?.charAt(0)?.toUpperCase()}
    </div>

    <div className="min-w-0">
      <p className="font-semibold text-white">
        {user?.name}
      </p>

      <p className="truncate text-sm text-slate-400">
        {user?.email}
      </p>
    </div>

  </div>
</div>

        {/* Menu */}

        <nav className="flex-1 space-y-2">
          {menu.map((item) => {
            const active =
              location.pathname ===
              item.path;

            return (
              <button
                key={item.path}
                onClick={() =>
                  handleNavigate(
                    item.path
                  )
                }
                className={`
                flex w-full items-center gap-3
                rounded-xl px-4 py-3
                transition-all

                ${
                  active
                    ? "bg-cyan-500 text-black font-semibold"
                    : "text-slate-400 hover:bg-slate-900 hover:text-white"
                }
              `}
              >
                {item.icon}
                {item.name}
              </button>
            );
          })}
        </nav>

        {/* Logout */}

        <button
          onClick={logout}
          className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-red-500/10 py-3 text-red-400 hover:bg-red-500/20"
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>
    </>
  );
}