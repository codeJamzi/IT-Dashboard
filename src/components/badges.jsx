import React from "react";
import { STATUS_MAP, PRIORITY_MAP, CERT_STATUS_MAP, slaStatus } from "@/lib/config";
import { cn } from "@/lib/utils";

export function StatusBadge({ status, className }) {
  const s = STATUS_MAP[status];
  if (!s) return null;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        className
      )}
      style={{ backgroundColor: `${s.color}1a`, color: s.color }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: s.color }} />
      {s.label}
    </span>
  );
}

export function PriorityBadge({ priority, className }) {
  const p = PRIORITY_MAP[priority];
  if (!p) return null;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
        className
      )}
      style={{ backgroundColor: `${p.color}1a`, color: p.color }}
    >
      {p.label}
    </span>
  );
}

export function SlaBadge({ ticket, now }) {
  const sla = slaStatus(ticket, now);
  const colors = {
    none: "#475569",
    met: "#34d399",
    breached: "#f87171",
    at_risk: "#fbbf24",
    on_track: "#60a5fa",
  };
  const c = colors[sla.level];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium"
      style={{ backgroundColor: `${c}1a`, color: c }}
    >
      {sla.label}
    </span>
  );
}

export function CertBadge({ status, className }) {
  const s = CERT_STATUS_MAP[status];
  if (!s) return null;
  return (
    <span
      className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", className)}
      style={{ backgroundColor: `${s.color}1a`, color: s.color }}
    >
      {s.label}
    </span>
  );
}

export function SkillTag({ name }) {
  return (
    <span className="inline-flex items-center rounded-md bg-slate-700/40 px-2 py-0.5 text-xs text-slate-300 ring-1 ring-inset ring-slate-600/40">
      {name}
    </span>
  );
}