import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { TICKET_STATUSES, TICKET_PRIORITIES, TICKET_CATEGORIES, DEFAULT_SKILLS, CATEGORY_MAP } from "@/lib/config";
import { StatusBadge, PriorityBadge, SlaBadge, SkillTag } from "@/components/badges";
import { Select } from "@/components/fields";
import { Input } from "@/components/fields";

export default function TicketList({ tickets, onNew }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [category, setCategory] = useState("");
  const [skill, setSkill] = useState("");

  const filtered = useMemo(() => {
    return tickets
      .filter((t) => (status ? t.status === status : true))
      .filter((t) => (priority ? t.priority === priority : true))
      .filter((t) => (category ? t.category === category : true))
      .filter((t) => (skill ? (t.skill_tags || []).includes(skill) : true))
      .filter((t) =>
        search ? (t.title + " " + (t.description || "")).toLowerCase().includes(search.toLowerCase()) : true
      )
      .sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
  }, [tickets, search, status, priority, category, skill]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <Input value={search} onChange={setSearch} placeholder="Search tickets…" className="min-w-[180px] flex-1" />
        <Select value={status} onChange={setStatus} placeholder="All Status" options={TICKET_STATUSES.map((s) => ({ value: s.value, label: s.label }))} />
        <Select value={priority} onChange={setPriority} placeholder="All Priority" options={TICKET_PRIORITIES.map((p) => ({ value: p.value, label: p.label }))} />
        <Select value={category} onChange={setCategory} placeholder="All Category" options={TICKET_CATEGORIES.map((c) => ({ value: c.value, label: c.label }))} />
        <Select value={skill} onChange={setSkill} placeholder="All Skill" options={DEFAULT_SKILLS.map((s) => ({ value: s, label: s }))} />
        <button
          onClick={onNew}
          className="rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-indigo-500/20 transition hover:from-indigo-400 hover:to-violet-500"
        >
          + New Ticket
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/40">
        <div className="grid grid-cols-12 gap-2 border-b border-slate-800 px-4 py-2.5 text-[11px] font-medium uppercase tracking-wider text-slate-500">
          <div className="col-span-5">Title</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Priority</div>
          <div className="col-span-2">SLA</div>
          <div className="col-span-1 text-right">Due</div>
        </div>
        {filtered.length === 0 ? (
          <div className="px-4 py-12 text-center text-sm text-slate-500">No tickets match these filters.</div>
        ) : (
          filtered.map((t) => (
            <Link
              key={t.id}
              to={`/tickets/${t.id}`}
              className="grid grid-cols-12 items-center gap-2 border-b border-slate-800/60 px-4 py-3 text-sm transition last:border-0 hover:bg-slate-800/40"
            >
              <div className="col-span-5 flex flex-col gap-1">
                <span className="font-medium text-slate-100">{t.title}</span>
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-xs text-slate-500">{CATEGORY_MAP[t.category]?.label || t.category}</span>
                  {(t.skill_tags || []).slice(0, 3).map((s) => (
                    <SkillTag key={s} name={s} />
                  ))}
                </div>
              </div>
              <div className="col-span-2"><StatusBadge status={t.status} /></div>
              <div className="col-span-2"><PriorityBadge priority={t.priority} /></div>
              <div className="col-span-2"><SlaBadge ticket={t} /></div>
              <div className="col-span-1 text-right text-xs text-slate-400">
                {t.due_date ? new Date(t.due_date).toLocaleDateString(undefined, { month: "short", day: "numeric" }) : "—"}
              </div>
            </Link>
          ))
        )}
      </div>
      <div className="text-xs text-slate-500">{filtered.length} of {tickets.length} tickets</div>
    </div>
  );
}