const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import { TICKET_STATUSES, CATEGORY_MAP, DEFAULT_SKILLS } from "@/lib/config";
import { StatusBadge, PriorityBadge, SlaBadge, SkillTag } from "@/components/badges";
import { TextArea, Select } from "@/components/fields";

export default function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [issue, setIssue] = useState("");
  const [solution, setSolution] = useState("");

  const load = async () => {
    const t = await db.entities.Ticket.get(id);
    setTicket(t);
    setStatus(t.status);
    setIssue(t.issue || "");
    setSolution(t.solution || "");
    const linked = await db.entities.Task.filter({ ticket_id: id });
    setTasks(linked);
    setLoading(false);
  };
  useEffect(() => { load(); }, [id]);

  if (loading) return <div className="text-sm text-slate-500">Loading…</div>;
  if (!ticket) return <div className="text-sm text-slate-500">Ticket not found.</div>;

  const update = async (data) => {
    const updated = await db.entities.Ticket.update(id, data);
    setTicket(updated);
  };

  const changeStatus = async (newStatus) => {
    const data = { status: newStatus };
    if (["resolved", "closed"].includes(newStatus) && !ticket.resolved_date) {
      data.resolved_date = new Date().toISOString();
    }
    await update(data);
    setStatus(newStatus);
  };

  const saveResolution = async () => {
    await update({ issue, solution });
    // auto-generate an achievement entry tied to this ticket's skills
    if (issue && solution) {
      await db.entities.Achievement.create({
        title: ticket.title,
        issue,
        solution,
        skills: ticket.skill_tags || [],
        ticket_id: id,
      });
    }
  };

  const toggleTask = async (t) => {
    await db.entities.Task.update(t.id, { done: !t.done });
    load();
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link to="/tickets" className="text-xs text-slate-500 hover:text-slate-300">← Back to queue</Link>
        <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
          <h1 className="text-2xl font-semibold text-white">{ticket.title}</h1>
          <div className="flex items-center gap-2">
            <StatusBadge status={ticket.status} />
            <PriorityBadge priority={ticket.priority} />
            <SlaBadge ticket={ticket} />
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
            <div className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">Description</div>
            <p className="whitespace-pre-wrap text-sm text-slate-300">{ticket.description || "No description provided."}</p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
            <div className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-500">Resolution & Achievement</div>
            <div className="flex flex-col gap-3">
              <TextArea label="Issue Summary" value={issue} onChange={setIssue} placeholder="What the actual issue was" rows={2} />
              <TextArea label="Solution / Technology Used" value={solution} onChange={setSolution} placeholder="What fixed it — tools, commands, workflow" rows={3} />
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-500">Saving creates/updates an achievement log entry for your career record.</p>
                <button
                  onClick={saveResolution}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
                >
                  Save Resolution
                </button>
              </div>
            </div>
          </div>

          {tasks.length > 0 && (
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
              <div className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-500">Linked Tasks · {tasks.length}</div>
              <div className="flex flex-col gap-2">
                {tasks.map((t) => (
                  <div key={t.id} className="flex items-center gap-3 text-sm">
                    <button
                      onClick={() => toggleTask(t)}
                      className={
                        "flex h-5 w-5 items-center justify-center rounded-md border " +
                        (t.done ? "border-emerald-500 bg-emerald-500/20 text-emerald-400" : "border-slate-600")
                      }
                    >
                      {t.done && "✓"}
                    </button>
                    <span className={t.done ? "text-slate-500 line-through" : "text-slate-200"}>{t.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
            <div className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-500">Properties</div>
            <div className="flex flex-col gap-3">
              <Select
                label="Status"
                value={status}
                onChange={changeStatus}
                options={TICKET_STATUSES.map((s) => ({ value: s.value, label: s.label }))}
              />
              <div>
                <div className="mb-1.5 text-xs font-medium text-slate-400">Category</div>
                <div className="text-sm text-slate-200">{CATEGORY_MAP[ticket.category]?.label || ticket.category || "—"}</div>
              </div>
              <div>
                <div className="mb-1.5 text-xs font-medium text-slate-400">Assignee</div>
                <div className="text-sm text-slate-200">{ticket.assignee || "Unassigned"}</div>
              </div>
              <div>
                <div className="mb-1.5 text-xs font-medium text-slate-400">Due Date</div>
                <div className="text-sm text-slate-200">{ticket.due_date ? new Date(ticket.due_date).toLocaleDateString() : "—"}</div>
              </div>
              <div>
                <div className="mb-1.5 text-xs font-medium text-slate-400">Created</div>
                <div className="text-sm text-slate-200">{new Date(ticket.created_date).toLocaleString()}</div>
              </div>
              {ticket.resolved_date && (
                <div>
                  <div className="mb-1.5 text-xs font-medium text-slate-400">Resolved</div>
                  <div className="text-sm text-slate-200">{new Date(ticket.resolved_date).toLocaleString()}</div>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
            <div className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">Skill Tags</div>
            <div className="flex flex-wrap gap-1.5">
              {(ticket.skill_tags || []).length === 0 ? (
                <span className="text-sm text-slate-500">None</span>
              ) : (
                ticket.skill_tags.map((s) => <SkillTag key={s} name={s} />)
              )}
            </div>
          </div>

          <button
            onClick={async () => { await db.entities.Ticket.delete(id); navigate("/tickets"); }}
            className="rounded-lg border border-slate-800 px-4 py-2 text-sm text-slate-500 transition hover:border-rose-500/40 hover:text-rose-400"
          >
            Delete Ticket
          </button>
        </div>
      </div>
    </div>
  );
}