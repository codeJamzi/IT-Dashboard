const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState } from "react";

import { CERT_STATUSES, DEFAULT_SKILLS } from "@/lib/config";
import { CertBadge } from "@/components/badges";
import { Input, Select } from "@/components/fields";

const empty = { name: "", provider: "", status: "planned", skill: "", target_date: "", earned_date: "", expiry_date: "" };

export default function CertTracker({ certs, onChange }) {
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  const openCreate = () => {
    setEditing(null);
    setForm(empty);
    setShowForm(true);
  };

  const openEdit = (c) => {
    setEditing(c);
    setForm({ ...empty, ...c });
    setShowForm(true);
  };

  const cancel = () => {
    setEditing(null);
    setForm(empty);
    setShowForm(false);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    if (editing) {
      await db.entities.Certification.update(editing.id, form);
    } else {
      await db.entities.Certification.create(form);
    }
    cancel();
    onChange?.();
  };

  const remove = async (c) => {
    await db.entities.Certification.delete(c.id);
    onChange?.();
  };

  const expiringSoon = (c) => {
    if (!c.expiry_date) return false;
    const days = (new Date(c.expiry_date) - new Date()) / (1000 * 60 * 60 * 24);
    return days < 90 && days >= 0;
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <button
          onClick={openCreate}
          className="rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-indigo-500/20"
        >
          + Add Certification
        </button>
      </div>

      {showForm && (
        <form onSubmit={submit} className="grid grid-cols-2 gap-3 rounded-xl border border-indigo-500/30 bg-slate-900/60 p-4">
          <div className="col-span-2 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-200">{editing ? "Edit Certification" : "New Certification"}</span>
            <button type="button" onClick={cancel} className="text-xs text-slate-500 hover:text-slate-300">Cancel</button>
          </div>
          <Input label="Name" value={form.name} onChange={set("name")} placeholder="e.g. CCNA" className="col-span-2" />
          <Input label="Provider" value={form.provider} onChange={set("provider")} placeholder="Cisco, CompTIA…" />
          <Select label="Status" value={form.status} onChange={set("status")} options={CERT_STATUSES.map((s) => ({ value: s.value, label: s.label }))} />
          <Select label="Skill" value={form.skill} onChange={set("skill")} placeholder="None" options={DEFAULT_SKILLS.map((s) => ({ value: s, label: s }))} />
          <Input label="Target Date" type="date" value={form.target_date} onChange={set("target_date")} />
          <Input label="Earned Date" type="date" value={form.earned_date} onChange={set("earned_date")} />
          <Input label="Expiry Date" type="date" value={form.expiry_date} onChange={set("expiry_date")} className="col-span-2" />
          <div className="col-span-2 flex justify-end gap-2">
            <button type="button" onClick={cancel} className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800">Cancel</button>
            <button type="submit" className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-400">Save</button>
          </div>
        </form>
      )}

      {certs.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-800 px-4 py-12 text-center text-sm text-slate-500">
          No certifications tracked yet.
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {certs.map((c) => (
            <div key={c.id} className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-medium text-slate-100">{c.name}</div>
                  {c.provider && <div className="text-xs text-slate-500">{c.provider}</div>}
                </div>
                <CertBadge status={c.status} />
              </div>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
                {c.skill && <span>Skill: {c.skill}</span>}
                {c.target_date && <span>Target: {new Date(c.target_date).toLocaleDateString()}</span>}
                {c.earned_date && <span>Earned: {new Date(c.earned_date).toLocaleDateString()}</span>}
                {c.expiry_date && (
                  <span className={expiringSoon(c) ? "text-amber-400" : ""}>
                    Expires: {new Date(c.expiry_date).toLocaleDateString()}{expiringSoon(c) ? " · soon" : ""}
                  </span>
                )}
              </div>
              <div className="mt-3 flex justify-end gap-3">
                <button onClick={() => openEdit(c)} className="text-xs text-slate-400 hover:text-indigo-300">Edit</button>
                <button onClick={() => remove(c)} className="text-xs text-slate-600 hover:text-rose-400">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}