const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useEffect, useState } from "react";

import AchievementLog from "@/components/AchievementLog";
import LearningLog from "@/components/LearningLog";
import CertTracker from "@/components/CertTracker";

export default function Career() {
  const [achievements, setAchievements] = useState([]);
  const [logs, setLogs] = useState([]);
  const [certs, setCerts] = useState([]);
  const [tab, setTab] = useState("achievements");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const [a, l, c] = await Promise.all([
      db.entities.Achievement.list("-created_date", 200),
      db.entities.LearningLog.list("-created_date", 200),
      db.entities.Certification.list("-created_date", 200),
    ]);
    setAchievements(a);
    setLogs(l);
    setCerts(c);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const tabs = [
    { value: "achievements", label: "Achievements", count: achievements.length },
    { value: "learning", label: "Learning", count: logs.length },
    { value: "certs", label: "Certifications", count: certs.length },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Career</h1>
        <p className="text-sm text-slate-500">Every ticket is evidence — turn it into resume bullets, track learning, and manage certs.</p>
      </div>

      <div className="flex gap-1 border-b border-slate-800">
        {tabs.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={
              "border-b-2 px-4 py-2 text-sm transition " +
              (tab === t.value
                ? "border-indigo-500 text-white"
                : "border-transparent text-slate-400 hover:text-slate-200")
            }
          >
            {t.label} <span className="text-xs text-slate-600">{t.count}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-sm text-slate-500">Loading…</div>
      ) : tab === "achievements" ? (
        <AchievementLog achievements={achievements} onChange={load} />
      ) : tab === "learning" ? (
        <LearningLog logs={logs} onChange={load} />
      ) : (
        <CertTracker certs={certs} onChange={load} />
      )}
    </div>
  );
}