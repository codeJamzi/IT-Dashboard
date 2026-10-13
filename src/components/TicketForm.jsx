import React, { useState, useEffect } from "react";
import { TICKET_CATEGORIES, TICKET_PRIORITIES, DEFAULT_SKILLS } from "@/lib/config";
import { Input, TextArea, Select, SkillPicker } from "@/components/fields";

const empty = {
  title: "",
  description: "",
  category: "",
  priority: "medium",
  status: "new",
  assignee: "",
  due_date: "",
  skill_tags: [],
};

export default function TicketForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState(empty);

  useEffect(() => {
    setForm({ ...empty, ...(initial || {}) });
  }, [initial]);

  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSubmit(form);
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <Input label="Title" value={form.title} onChange={set("title")} placeholder="Short summary of the issue" />
      <TextArea label="Description" value={form.description} onChange={set("description")} placeholder="What's happening, what's expected…" rows={4} />
      <div className="grid grid-cols-2 gap-3">
        <Select
          label="Category"
          value={form.category}
          onChange={set("category")}
          placeholder="Select…"
          options={TICKET_CATEGORIES.map((c) => ({ value: c.value, label: c.label }))}
        />
        <Select
          label="Priority"
          value={form.priority}
          onChange={set("priority")}
          options={TICKET_PRIORITIES.map((p) => ({ value: p.value, label: p.label }))}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input label="Assignee" value={form.assignee} onChange={set("assignee")} placeholder="Who's on it" />
        <Input label="Due Date (SLA)" type="date" value={form.due_date} onChange={set("due_date")} />
      </div>
      <SkillPicker label="Skill Tags" values={form.skill_tags || []} onChange={set("skill_tags")} options={DEFAULT_SKILLS} />
      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <button type="button" onClick={onCancel} className="rounded-lg px-3 py-2 text-sm text-slate-400 hover:text-slate-200">
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-indigo-500/20 transition hover:from-indigo-400 hover:to-violet-500"
        >
          Save Ticket
        </button>
      </div>
    </form>
  );
}