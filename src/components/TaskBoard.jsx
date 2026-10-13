const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState } from "react";

import { Input } from "@/components/fields";

export default function TaskBoard({ tasks, tickets, onChange }) {
  const [title, setTitle] = useState("");
  const [ticketId, setTicketId] = useState("");
  const [priority, setPriority] = useState("medium");

  const add = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    await db.entities.Task.create({ title, ticket_id: ticketId || undefined, priority });
    setTitle("");
    setTicketId("");
    onChange?.();
  };

  const toggle = async (t) => {
    await db.entities.Task.update(t.id, { done: !t.done });
    onChange?.();
  };

  const remove = async (t) => {
    await db.entities.Task.delete(t.id);
    onChange?.();
  };

  const ticketMap = Object.fromEntries(tickets.map((t) => [t.id, t]));
  const open = tasks.filter((t) => !t.done);
  const done = tasks.filter((t) => t.done);

  const Row = ({ t }) => (
    <div className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900/40 px-3 py-2.5">
      <button
        onClick={() => toggle(t)}
        className={
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition " +
          (t.done ? "border-emerald-500 bg-emerald-500/20 text-emerald-400" : "border-slate-600 hover:border-slate-400")
        }
      >
        {t.done && "✓"}
      </button>
      <div className="min-w-0 flex-1">
        <div className={"truncate text-sm " + (t.done ? "text-slate-500 line-through" : "text-slate-200")}>
          {t.title}
        </div>
        {t.ticket_id && ticketMap[t.ticket_id] && (
          <div className="truncate text-xs text-slate-500">↳ {ticketMap[t.ticket_id].title}</div>
        )}
      </div>
      <button onClick={() => remove(t)} className="text-xs text-slate-600 hover:text-rose-400">
        Remove
      </button>
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={add} className="flex flex-wrap items-end gap-2">
        <Input value={title} onChange={setTitle} placeholder="New task…" className="min-w-[180px] flex-1" />
        <select
          value={ticketId}
          onChange={(e) => setTicketId(e.target.value)}
          className="rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2 text-sm text-slate-100 outline-none"
        >
          <option value="">No linked ticket</option>
          {tickets.map((t) => (
            <option key={t.id} value={t.id}>
              {t.title}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 ring-1 ring-inset ring-slate-700 transition hover:bg-slate-700"
        >
          Add Task
        </button>
      </form>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <div className="text-xs font-medium uppercase tracking-wider text-slate-500">Open · {open.length}</div>
          {open.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-800 px-3 py-6 text-center text-xs text-slate-600">
              Nothing pending.
            </div>
          ) : (
            open.map((t) => <Row key={t.id} t={t} />)
          )}
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-xs font-medium uppercase tracking-wider text-slate-500">Done · {done.length}</div>
          {done.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-800 px-3 py-6 text-center text-xs text-slate-600">
              Nothing done yet.
            </div>
          ) : (
            done.map((t) => <Row key={t.id} t={t} />)
          )}
        </div>
      </div>
    </div>
  );
}