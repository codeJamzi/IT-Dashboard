import React from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Dashboard", icon: "LayoutDashboard" },
  { to: "/tickets", label: "Tickets", icon: "Ticket" },
  { to: "/tasks", label: "Tasks", icon: "ListChecks" },
  { to: "/career", label: "Career", icon: "GraduationCap" },
  { to: "/users", label: "User Management", icon: "Users" },
];

import { LayoutDashboard, Ticket, ListChecks, GraduationCap, Users } from "lucide-react";
const ICONS = { LayoutDashboard, Ticket, ListChecks, GraduationCap, Users };

export default function Layout() {
  const { pathname } = useLocation();
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* ambient glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute top-1/3 right-0 h-80 w-80 rounded-full bg-violet-600/10 blur-[120px]" />
      </div>

      <div className="relative flex">
        <aside className="sticky top-0 hidden h-screen w-56 shrink-0 flex-col border-r border-slate-800/80 bg-slate-900/40 backdrop-blur-sm md:flex">
          <div className="flex items-center gap-2 px-5 py-5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white shadow-lg shadow-indigo-500/20">
              IT
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold text-white">Service Desk</div>
              <div className="text-[10px] uppercase tracking-wider text-slate-500">Ops & Career</div>
            </div>
          </div>
          <nav className="flex flex-1 flex-col gap-1 px-3 py-2">
            {NAV.map((n) => {
              const Icon = ICONS[n.icon];
              const active = n.to === "/" ? pathname === "/" : pathname.startsWith(n.to);
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition",
                    active
                      ? "bg-slate-800/80 text-white ring-1 ring-inset ring-slate-700"
                      : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"
                  )}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  {n.label}
                </Link>
              );
            })}
          </nav>
          <div className="px-5 py-4 text-[10px] text-slate-600">v1.0 · modular build</div>
        </aside>

        {/* mobile top nav */}
        <div className="fixed inset-x-0 top-0 z-20 flex items-center justify-between border-b border-slate-800 bg-slate-900/80 px-4 py-3 backdrop-blur md:hidden">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-indigo-500 to-violet-600 text-xs font-bold text-white">
              IT
            </div>
            <span className="text-sm font-semibold">Service Desk</span>
          </div>
          <nav className="flex gap-1">
            {NAV.map((n) => {
              const Icon = ICONS[n.icon];
              const active = n.to === "/" ? pathname === "/" : pathname.startsWith(n.to);
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-md",
                    active ? "bg-slate-800 text-white" : "text-slate-400"
                  )}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                </Link>
              );
            })}
          </nav>
        </div>

        <main className="min-h-screen flex-1 px-4 pb-16 pt-16 md:px-8 md:pb-8 md:pt-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}