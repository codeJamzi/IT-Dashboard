// Central config for the IT Service Desk.
// Extend the workflow by editing these lists — every component reads from here.

export const TICKET_STATUSES = [
  { value: "new", label: "New", color: "#60a5fa", order: 0 },
  { value: "in_progress", label: "In Progress", color: "#a78bfa", order: 1 },
  { value: "on_hold", label: "On Hold", color: "#fbbf24", order: 2 },
  { value: "resolved", label: "Resolved", color: "#34d399", order: 3 },
  { value: "closed", label: "Closed", color: "#64748b", order: 4 },
];

export const TICKET_PRIORITIES = [
  { value: "low", label: "Low", color: "#64748b", weight: 1 },
  { value: "medium", label: "Medium", color: "#60a5fa", weight: 2 },
  { value: "high", label: "High", color: "#fbbf24", weight: 3 },
  { value: "critical", label: "Critical", color: "#f87171", weight: 4 },
];

export const TICKET_CATEGORIES = [
  { value: "hardware", label: "Hardware" },
  { value: "software", label: "Software" },
  { value: "network", label: "Network" },
  { value: "access", label: "Access & Identity" },
  { value: "email", label: "Email & Comms" },
  { value: "security", label: "Security" },
  { value: "infrastructure", label: "Infrastructure" },
  { value: "other", label: "Other" },
];

export const DEFAULT_SKILLS = [
  "Active Directory",
  "Azure",
  "AWS",
  "Networking",
  "VPN",
  "Microsoft 365",
  "PowerShell",
  "Linux",
  "Windows Server",
  "Virtualization",
  "Firewalls",
  "DNS/DHCP",
  "Backup & Recovery",
  "Endpoint Management",
  "Scripting",
  "Security",
];

export const CERT_STATUSES = [
  { value: "planned", label: "Planned", color: "#64748b" },
  { value: "in_progress", label: "In Progress", color: "#a78bfa" },
  { value: "earned", label: "Earned", color: "#34d399" },
  { value: "expired", label: "Expired", color: "#f87171" },
];

export const STATUS_MAP = Object.fromEntries(TICKET_STATUSES.map((s) => [s.value, s]));
export const PRIORITY_MAP = Object.fromEntries(TICKET_PRIORITIES.map((p) => [p.value, p]));
export const CATEGORY_MAP = Object.fromEntries(TICKET_CATEGORIES.map((c) => [c.value, c]));
export const CERT_STATUS_MAP = Object.fromEntries(CERT_STATUSES.map((c) => [c.value, c]));

// Tickets that count as "active" workload
export const ACTIVE_STATUSES = ["new", "in_progress", "on_hold"];
export const RESOLVED_STATUSES = ["resolved", "closed"];

export function slaStatus(ticket, now = new Date()) {
  if (!ticket.due_date) return { level: "none", label: "No SLA" };
  const due = new Date(ticket.due_date);
  if (RESOLVED_STATUSES.includes(ticket.status)) return { level: "met", label: "SLA Met" };
  const diff = due - now;
  if (diff < 0) return { level: "breached", label: "Overdue" };
  if (diff < 24 * 60 * 60 * 1000) return { level: "at_risk", label: "At Risk" };
  return { level: "on_track", label: "On Track" };
}