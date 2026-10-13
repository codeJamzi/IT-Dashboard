const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useEffect, useState } from "react";

import TaskBoard from "@/components/TaskBoard";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const [t, tk] = await Promise.all([
      db.entities.Task.list("-created_date", 200),
      db.entities.Ticket.list("-created_date", 200),
    ]);
    setTasks(t);
    setTickets(tk);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Tasks</h1>
        <p className="text-sm text-slate-500">Standalone checklists, maintenance, and follow-ups — optionally linked to a ticket.</p>
      </div>
      {loading ? (
        <div className="text-sm text-slate-500">Loading…</div>
      ) : (
        <TaskBoard tasks={tasks} tickets={tickets} onChange={load} />
      )}
    </div>
  );
}