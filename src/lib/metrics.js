// Dedicated metrics module — all computed from ticket data, never duplicated.
import { ACTIVE_STATUSES, RESOLVED_STATUSES, STATUS_MAP, TICKET_PRIORITIES, TICKET_STATUSES } from "./config";

export function computeMetrics(tickets, now = new Date()) {
  const total = tickets.length;
  const byStatus = {};
  for (const s of TICKET_STATUSES) byStatus[s.value] = 0;
  for (const t of tickets) if (byStatus[t.status] != null) byStatus[t.status]++;

  const active = tickets.filter((t) => ACTIVE_STATUSES.includes(t.status));
  const resolved = tickets.filter((t) => RESOLVED_STATUSES.includes(t.status));

  // average resolution time in hours
  let avgResolutionHours = 0;
  if (resolved.length) {
    const hours = resolved
      .filter((t) => t.resolved_date && t.created_date)
      .map((t) => (new Date(t.resolved_date) - new Date(t.created_date)) / (1000 * 60 * 60));
    avgResolutionHours = hours.length ? hours.reduce((a, b) => a + b, 0) / hours.length : 0;
  }

  // by category
  const byCategory = {};
  for (const t of tickets) byCategory[t.category] = (byCategory[t.category] || 0) + 1;

  // by priority
  const byPriority = {};
  for (const p of TICKET_PRIORITIES) byPriority[p.value] = 0;
  for (const t of tickets) if (byPriority[t.priority] != null) byPriority[t.priority]++;

  // by skill (workload distribution)
  const bySkill = {};
  for (const t of tickets) {
    for (const sk of t.skill_tags || []) bySkill[sk] = (bySkill[sk] || 0) + 1;
  }

  // volume over last 14 days (created)
  const days = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    days.push({ date: d, created: 0, resolved: 0 });
  }
  for (const t of tickets) {
    if (!t.created_date) continue;
    const cd = new Date(t.created_date);
    cd.setHours(0, 0, 0, 0);
    const slot = days.find((d) => d.date.getTime() === cd.getTime());
    if (slot) slot.created++;
    if (t.resolved_date) {
      const rd = new Date(t.resolved_date);
      rd.setHours(0, 0, 0, 0);
      const rslot = days.find((d) => d.date.getTime() === rd.getTime());
      if (rslot) rslot.resolved++;
    }
  }

  return {
    total,
    active: active.length,
    resolved: resolved.length,
    byStatus,
    byCategory,
    byPriority,
    bySkill,
    avgResolutionHours,
    volumeSeries: days.map((d) => ({
      date: d.date.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      Created: d.created,
      Resolved: d.resolved,
    })),
  };
}

export function statusBreakdown(tickets) {
  const map = {};
  for (const s of TICKET_STATUSES) map[s.value] = { label: s.label, color: s.color, count: 0 };
  for (const t of tickets) if (map[t.status]) map[t.status].count++;
  return Object.values(map);
}