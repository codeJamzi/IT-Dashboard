const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useEffect, useState } from "react";

import TicketList from "@/components/TicketList";
import TicketForm from "@/components/TicketForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    const t = await db.entities.Ticket.list("-created_date", 200);
    setTickets(t);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const create = async (data) => {
    await db.entities.Ticket.create(data);
    setShowForm(false);
    load();
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Tickets</h1>
        <p className="text-sm text-slate-500">The full queue — filter to find what to work on next.</p>
      </div>

      {loading ? (
        <div className="text-sm text-slate-500">Loading…</div>
      ) : (
        <TicketList tickets={tickets} onNew={() => setShowForm(true)} />
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="border-slate-800 bg-slate-900 text-slate-100 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white">New Ticket</DialogTitle>
          </DialogHeader>
          <TicketForm onSubmit={create} onCancel={() => setShowForm(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}