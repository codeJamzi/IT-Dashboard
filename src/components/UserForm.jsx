import React, { useState, useEffect } from "react";
import { Input, Select } from "@/components/fields";

const empty = {
  first_name: "",
  last_name: "",
  email: "",
  pin_code: "",
  access_card_1: "",
  access_card_2: "",
  user_group: "",
  access_start_date: "",
  access_start_time: "",
  access_end_date: "",
  access_end_time: "",
  mobile_credential: "No",
  employee_id: "",
  job_title: "",
  department: "",
  location: "",
};

export default function UserForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState(empty);

  useEffect(() => {
    setForm({ ...empty, ...(initial || {}) });
  }, [initial]);

  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e) => {
    e.preventDefault();
    if (!form.first_name.trim() || !form.last_name.trim() || !form.email.trim()) return;
    onSubmit(form);
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <Input label="First Name" value={form.first_name} onChange={set("first_name")} />
        <Input label="Last Name" value={form.last_name} onChange={set("last_name")} />
      </div>
      <Input label="Email Address" type="email" value={form.email} onChange={set("email")} />
      <div className="grid grid-cols-2 gap-3">
        <Input label="PIN Code" value={form.pin_code} onChange={set("pin_code")} />
        <Input label="Employee ID" value={form.employee_id} onChange={set("employee_id")} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input label="Access Card 1" value={form.access_card_1} onChange={set("access_card_1")} />
        <Input label="Access Card 2" value={form.access_card_2} onChange={set("access_card_2")} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input label="User Group" value={form.user_group} onChange={set("user_group")} />
        <Select
          label="Mobile Credential"
          value={form.mobile_credential}
          onChange={set("mobile_credential")}
          options={[{ value: "Yes", label: "Yes" }, { value: "No", label: "No" }]}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input label="Job Title" value={form.job_title} onChange={set("job_title")} />
        <Input label="Department" value={form.department} onChange={set("department")} />
      </div>
      <Input label="Location" value={form.location} onChange={set("location")} />
      <div className="grid grid-cols-2 gap-3">
        <Input label="Access Start Date" type="date" value={form.access_start_date} onChange={set("access_start_date")} />
        <Input label="Access Start Time (Arizona)" value={form.access_start_time} onChange={set("access_start_time")} placeholder="e.g. 08:00" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input label="Access End Date" type="date" value={form.access_end_date} onChange={set("access_end_date")} />
        <Input label="Access End Time (Arizona)" value={form.access_end_time} onChange={set("access_end_time")} placeholder="e.g. 17:00" />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onCancel} className="rounded-lg px-3 py-2 text-sm text-slate-400 hover:text-slate-200">
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-indigo-500/20 transition hover:from-indigo-400 hover:to-violet-500"
        >
          Save User
        </button>
      </div>
    </form>
  );
}