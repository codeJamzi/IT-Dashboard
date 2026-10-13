import React, { useState } from "react";
import { cn } from "@/lib/utils";

// Reusable select built from native element styled for dark theme.
export function Select({ label, value, onChange, options, placeholder, className }) {
  return (
    <label className={cn("flex flex-col gap-1.5", className)}>
      {label && <span className="text-xs font-medium text-slate-400">{label}</span>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function Input({ label, value, onChange, type = "text", placeholder, className }) {
  return (
    <label className={cn("flex flex-col gap-1.5", className)}>
      {label && <span className="text-xs font-medium text-slate-400">{label}</span>}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
      />
    </label>
  );
}

export function TextArea({ label, value, onChange, placeholder, rows = 4, className }) {
  return (
    <label className={cn("flex flex-col gap-1.5", className)}>
      {label && <span className="text-xs font-medium text-slate-400">{label}</span>}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
      />
    </label>
  );
}

// Multi-select chip input for skill tags
export function SkillPicker({ label, values, onChange, options }) {
  const [query, setQuery] = useState("");
  const filtered = options.filter(
    (o) => !values.includes(o) && o.toLowerCase().includes(query.toLowerCase())
  );
  const toggle = (v) => {
    if (values.includes(v)) onChange(values.filter((x) => x !== v));
    else onChange([...values, v]);
  };
  return (
    <div className="flex flex-col gap-1.5">
      {label && <span className="text-xs font-medium text-slate-400">{label}</span>}
      <div className="flex flex-wrap gap-1.5 rounded-lg border border-slate-700 bg-slate-800/60 p-2">
        {values.map((v) => (
          <span
            key={v}
            className="inline-flex items-center gap-1 rounded-md bg-indigo-500/20 px-2 py-0.5 text-xs text-indigo-200 ring-1 ring-inset ring-indigo-500/30"
          >
            {v}
            <button type="button" onClick={() => toggle(v)} className="text-indigo-300 hover:text-white">
              ×
            </button>
          </span>
        ))}
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Add skill…"
          className="min-w-[100px] flex-1 bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
        />
      </div>
      {filtered.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {filtered.slice(0, 8).map((o) => (
            <button
              key={o}
              type="button"
              onClick={() => {
                toggle(o);
                setQuery("");
              }}
              className="rounded-md bg-slate-700/50 px-2 py-0.5 text-xs text-slate-300 hover:bg-slate-600/60"
            >
              + {o}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}