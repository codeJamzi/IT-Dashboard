const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useEffect } from "react";

import UserForm from "@/components/UserForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const COLUMNS = [
  { key: "first_name", label: "First Name" },
  { key: "last_name", label: "Last Name" },
  { key: "email", label: "Email Address" },
  { key: "pin_code", label: "PIN Code" },
  { key: "access_card_1", label: "Access Card 1" },
  { key: "access_card_2", label: "Access Card 2" },
  { key: "user_group", label: "User Group" },
  { key: "access_start_date", label: "Access Start Date" },
  { key: "access_start_time", label: "Access Start Time (Arizona)" },
  { key: "access_end_date", label: "Access End Date" },
  { key: "access_end_time", label: "Access End Time (Arizona)" },
  { key: "mobile_credential", label: "Mobile Credential" },
  { key: "employee_id", label: "Employee ID" },
  { key: "job_title", label: "Job Title" },
  { key: "department", label: "Department" },
  { key: "location", label: "Location" },
];

function escapeCsv(v) {
  const s = v == null ? "" : String(v);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function exportCsv(users) {
  const header = [...COLUMNS.map((c) => c.label)].join(",");
  const rows = users.map((u) => COLUMNS.map((c) => escapeCsv(u[c.key])).join(","));
  const csv = [header, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "access_users.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    setLoading(true);
    const data = await db.entities.AccessUser.list("-created_date", 500);
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (u) => {
    setEditing(u);
    setDialogOpen(true);
  };

  const handleSubmit = async (form) => {
    if (editing) {
      await db.entities.AccessUser.update(editing.id, form);
    } else {
      await db.entities.AccessUser.create(form);
    }
    setDialogOpen(false);
    load();
  };

  const handleDelete = async (u) => {
    if (!confirm(`Delete ${u.first_name} ${u.last_name}?`)) return;
    await db.entities.AccessUser.delete(u.id);
    load();
  };

  return (
    <div className="flex flex-col gap-4 min-w-0">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-white">User Management</h1>
          <p className="text-sm text-slate-400">Access control roster · {users.length} users</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => exportCsv(users)}
            disabled={!users.length}
            className="rounded-lg border border-slate-700 bg-slate-800/60 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-700/60 disabled:opacity-40"
          >
            Export CSV
          </button>
          <button
            onClick={openCreate}
            className="rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-indigo-500/20 transition hover:from-indigo-400 hover:to-violet-500"
          >
            + New User
          </button>
        </div>
      </div>

      <div className="w-full max-w-full overflow-auto rounded-xl border border-slate-800 bg-slate-900/40" style={{ maxHeight: "65vh" }}>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/60 text-[11px] font-medium uppercase tracking-wider text-slate-500">
              {COLUMNS.map((c) => (
                <th key={c.key} className="whitespace-nowrap px-3 py-2.5 sticky top-0 bg-slate-900/95 backdrop-blur">{c.label}</th>
              ))}
              <th className="px-3 py-2.5 text-right sticky top-0 bg-slate-900/95 backdrop-blur">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={COLUMNS.length + 1} className="px-3 py-12 text-center text-slate-500">Loading…</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={COLUMNS.length + 1} className="px-3 py-12 text-center text-slate-500">No users yet. Click “+ New User” to add one.</td></tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className="border-b border-slate-800/60 transition last:border-0 hover:bg-slate-800/40">
                  {COLUMNS.map((c) => (
                    <td key={c.key} className="whitespace-nowrap px-3 py-2.5 text-slate-200">{u[c.key] || "—"}</td>
                  ))}
                  <td className="whitespace-nowrap px-3 py-2.5 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(u)} className="rounded-md bg-slate-700/50 px-2.5 py-1 text-xs text-slate-200 hover:bg-slate-600/60">Edit</button>
                      <button onClick={() => handleDelete(u)} className="rounded-md bg-red-500/20 px-2.5 py-1 text-xs text-red-300 hover:bg-red-500/30">Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl bg-slate-900 border-slate-700 text-slate-100">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit User" : "New User"}</DialogTitle>
          </DialogHeader>
          <UserForm initial={editing} onSubmit={handleSubmit} onCancel={() => setDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}