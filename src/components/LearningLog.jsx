const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState } from "react";

import { DEFAULT_SKILLS } from "@/lib/config";
import { Input, Select } from "@/components/fields";

export default function LearningLog({ logs, onChange }) {
  const [activity, setActivity] = useState("");
  const [hours, setHours] = useState("");
  const [skill, setSkill] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const add = async (e) => {
    e.preventDefault();
    if (!activity.trim()) return;
    await db.entities.LearningLog.create({
      activity,
      hours: Number(hours) || 0,
      skill,
      date,
    });
    setActivity("");
    setHours("");
    onChange?.();
  };

  const remove = async (l) => {
    await db.entities.LearningLog.delete(l.id);
    onChange?.();
  };

  const totals = {};
  for (const l of logs) totals[l.skill] = (totals[l.skill] || 0) + (l.hours || 0);
  const totalHours = Object.values(totals).reduce((a, b) => a + b, 0);

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={add} className="flex flex-wrap items-end gap-2 rounded-xl border border-slate-800 bg-slate-900/40 p-3">
        <Input value={activity} onChange={setActivity} placeholder="Course, lab, study session…" className="min-w-[180px] flex-1" />
        <Input type="number" value={hours} onChange={setHours} placeholder="Hours" className="w-24" />
        <Select value={skill} onChange={setSkill} placeholder="Skill" options={DEFAULT_SKILLS.map((s) => ({ value: s, label: s }))} />
        <Input type="date" value={date} onChange={setDate} className="w-40" />
        <button type="submit" className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 ring-1 ring-inset ring-slate-700 hover:bg-slate-700">
          Log
        </button>
      </form>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
          <div className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-500">Hours by Skill · {totalHours}h total</div>
          {Object.keys(totals).length === 0 ? (
            <div className="py-6 text-center text-sm text-slate-500">No learning logged yet.</div>
          ) : (
            <div className="flex flex-col gap-2">
              {Object.entries(totals)
                .sort((a, b) => b[1] - a[1])
                .map(([k, v]) => (
                  <div key={k} className="flex items-center gap-3">
                    <div className="w-28 truncate text-xs text-slate-400">{k}</div>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                        style={{ width: `${totalHours ? (v / Math.max(...Object.values(totals))) * 100 : 0}%` }}
                      />
                    </div>
                    <div className="w-12 text-right text-xs text-slate-300">{v}h</div>
                  </div>
                ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
          <div className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-500">Recent Entries</div>
          {logs.length === 0 ? (
            <div className="py-6 text-center text-sm text-slate-500">Nothing logged.</div>
          ) : (
            <div className="flex flex-col gap-2">
              {logs.slice(0, 6).map((l) => (
                <div key={l.id} className="flex items-center justify-between gap-2 text-sm">
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-slate-200">{l.activity}</div>
                    <div className="text-xs text-slate-500">{l.skill || "—"} · {l.date ? new Date(l.date).toLocaleDateString() : ""}</div>
                  </div>
                  <div className="text-xs text-slate-400">{l.hours}h</div>
                  <button onClick={() => remove(l)} className="text-xs text-slate-600 hover:text-rose-400">✕</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}