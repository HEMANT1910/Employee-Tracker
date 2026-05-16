import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import api from "../../services/api";

export default function TeamMembers() {
  const [members, setMembers] = useState([]);
  const [editing, setEditing] = useState(null);

  const loadMembers = () => api.get("/users").then((res) => setMembers(res.data));

  useEffect(() => {
    loadMembers().catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 lg:flex">
      <Sidebar />

      <main className="flex-1 p-5 sm:p-8">
        <div className="rounded-[1.8rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h1 className="text-3xl font-black text-slate-950">Team members</h1>
          <p className="mt-2 text-slate-500">Manage roles, titles, departments, and attendance status.</p>

          <div className="mt-6 grid gap-4">
            {members.map((member) => {
              const row = editing?.id === member.id ? editing : member;
              return (
                <article key={member.id} className="rounded-[1.6rem] border border-slate-200 p-5">
                  <div className="grid gap-4 xl:grid-cols-[1.1fr_1fr_auto] xl:items-center">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <input
                        value={row.name}
                        onChange={(event) => setEditing((prev) => ({ ...prev, name: event.target.value }))}
                        disabled={editing?.id !== member.id}
                        className="rounded-2xl border border-slate-200 px-4 py-3 outline-none disabled:bg-slate-50"
                      />
                      <input
                        value={row.email}
                        onChange={(event) => setEditing((prev) => ({ ...prev, email: event.target.value }))}
                        disabled={editing?.id !== member.id}
                        className="rounded-2xl border border-slate-200 px-4 py-3 outline-none disabled:bg-slate-50"
                      />
                      <input
                        value={row.title || ""}
                        onChange={(event) => setEditing((prev) => ({ ...prev, title: event.target.value }))}
                        disabled={editing?.id !== member.id}
                        className="rounded-2xl border border-slate-200 px-4 py-3 outline-none disabled:bg-slate-50"
                      />
                      <input
                        value={row.department || ""}
                        onChange={(event) => setEditing((prev) => ({ ...prev, department: event.target.value }))}
                        disabled={editing?.id !== member.id}
                        className="rounded-2xl border border-slate-200 px-4 py-3 outline-none disabled:bg-slate-50"
                      />
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                      <select
                        value={row.role}
                        onChange={(event) => setEditing((prev) => ({ ...prev, role: event.target.value }))}
                        disabled={editing?.id !== member.id}
                        className="rounded-2xl border border-slate-200 px-4 py-3 outline-none disabled:bg-slate-50"
                      >
                        <option value="member">Member</option>
                        <option value="admin">Admin</option>
                      </select>
                      <select
                        value={row.attendanceStatus}
                        onChange={(event) => setEditing((prev) => ({ ...prev, attendanceStatus: event.target.value }))}
                        disabled={editing?.id !== member.id}
                        className="rounded-2xl border border-slate-200 px-4 py-3 outline-none disabled:bg-slate-50"
                      >
                        <option value="online">Online</option>
                        <option value="offline">Offline</option>
                      </select>
                      <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                        {member.completedCount}/{member.taskCount} tasks done
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 xl:justify-end">
                      {editing?.id === member.id ? (
                        <>
                          <button
                            onClick={async () => {
                              await api.put(`/users/${member.id}`, editing);
                              setEditing(null);
                              loadMembers();
                            }}
                            className="rounded-2xl bg-slate-950 px-4 py-3 text-white"
                          >
                            Save
                          </button>
                          <button onClick={() => setEditing(null)} className="rounded-2xl border border-slate-300 px-4 py-3">
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button onClick={() => setEditing({ ...member })} className="rounded-2xl bg-slate-950 px-4 py-3 text-white">
                          Edit
                        </button>
                      )}
                      <button
                        onClick={async () => {
                          await api.delete(`/users/${member.id}`);
                          loadMembers();
                        }}
                        className="rounded-2xl bg-rose-600 px-4 py-3 text-white"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
