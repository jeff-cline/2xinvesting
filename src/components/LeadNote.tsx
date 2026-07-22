"use client";
import { useState } from "react";
export default function LeadNote({ leadId, initial }: { leadId: string; initial: string }) {
  const [note, setNote] = useState(initial); const [saved, setSaved] = useState(false); const [busy, setBusy] = useState(false);
  async function save() {
    setBusy(true); setSaved(false);
    const r = await fetch("/api/sponsor/note", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ leadId, note }) }).then((x) => x.json()).catch(() => null);
    setBusy(false); if (r?.ok) { setSaved(true); setTimeout(() => setSaved(false), 1800); }
  }
  return (
    <div style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
      <textarea rows={1} value={note} onChange={(e) => setNote(e.target.value)} onBlur={save} placeholder="Add a note…" style={{ background: "var(--ground-2)", border: "1px solid var(--line-soft)", borderRadius: 3, padding: "6px 9px", color: "var(--ivory)", fontSize: 12.5, width: "100%", resize: "vertical", minWidth: 160 }} />
      {busy ? <span className="crm-sub" style={{ fontSize: 11 }}>…</span> : saved ? <span style={{ color: "var(--teal-soft)", fontSize: 11 }}>✓</span> : null}
    </div>
  );
}
