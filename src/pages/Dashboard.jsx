const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { computeMetrics, statusBreakdown } from "@/lib/metrics";
import { slaStatus } from "@/lib/config";
import { VolumeChart, StatusPie, CategoryBar, SkillBar } from "@/components/MetricsCharts";
import { StatusBadge, PriorityBadge } from "@/components/badges";

function StatCard({ label, value, sub, accent }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
      <div className="text-xs font-medium uppercase tracking-wider text-slate-500">{label}</div>
      <div className={"mt-1 text-2xl font-semibold " + (accent || "text-slate-100")}>{value}</div>
      {sub && <div className="mt-0.5 text-xs text-slate-500">{sub}</div>}
    </div>
  );
}

export default function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const t = await db.entities.Ticket.list("-created_date", 200);
    setTickets(t);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  if (loading) return <div className="text-sm text-slate-500">Loading dashboard…</div>;

  const m = computeMetrics(tickets);
  const now = new Date();
  const overdue = tickets.filter((t) => slaStatus(t, now).level === "breached");
  const atRisk = tickets.filter((t) => slaStatus(t, now).level === "at_risk");
  const breakdown = statusBreakdown(tickets);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
        <p className="text-sm text-slate-500">SLA health, throughput, and skill workload at a glance.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Active Tickets" value={m.active} sub={`${m.total} total`} accent="text-indigo-300" />
        <StatCard label="Resolved" value={m.resolved} sub="all time" accent="text-emerald-300" />
        <StatCard label="Avg Resolution" value={`${m.avgResolutionHours.toFixed(1)}h`} sub="per resolved ticket" />
        <StatCard label="Overdue" value={overdue.length} sub={`${atRisk.length} at risk`} accent={overdue.length ? "text-rose-300" : ""} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 lg:col-span-2">
          <div className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-500">Ticket Volume · last 14 days</div>
          <VolumeChart data={m.volumeSeries} />
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
          <div className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-500">Status Breakdown</div>
          <StatusPie data={breakdown} />
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            {breakdown.map((b) => (
              <span key={b.label} className="flex items-center gap-1.5 text-xs text-slate-400">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: b.color }} />
                {b.label} {b.count}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
          <div className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-500">Tickets by Category</div>
          <CategoryBar data={m.byCategory} />
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
          <div className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-500">Workload by Skill</div>
          <SkillBar data={m.bySkill} />
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-xs font-medium uppercase tracking-wider text-slate-500">SLA Watch · {overdue.length + atRisk.length} flagged</div>
          <Link to="/tickets" className="text-xs text-indigo-400 hover:text-indigo-300">View all tickets →</Link>
        </div>
        {overdue.length === 0 && atRisk.length === 0 ? (
          <div className="py-6 text-center text-sm text-slate-500">All tickets on track. 🎯</div>
        ) : (
          <div className="flex flex-col gap-2">
            {[...overdue, ...atRisk].slice(0, 8).map((t) => {
              const sla = slaStatus(t, now);
              return (
                <Link key={t.id} to={`/tickets/${t.id}`} className="flex items-center justify-between gap-3 rounded-lg border border-slate-800 bg-slate-900/40 px-3 py-2.5 transition hover:bg-slate-800/40">
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm text-slate-200">{t.title}</div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <StatusBadge status={t.status} /> <PriorityBadge priority={t.priority} />
                      <span>due {t.due_date ? new Date(t.due_date).toLocaleDateString() : "—"}</span>
                    </div>
                  </div>
                  <span className={sla.level === "breached" ? "text-xs text-rose-400" : "text-xs text-amber-400"}>{sla.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}