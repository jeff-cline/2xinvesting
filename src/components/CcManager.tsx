"use client";
import { useEffect, useState } from "react";
export default function CcManager() {
  const [emails, setEmails] = useState<string[]>([]);
  const [input, setInput] = useState(""); const [saved, setSaved] = useState(false);
  useEffect(() => { fetch("/api/admin/cc").then((x) => x.json()).then((r) => r?.ok && setEmails(r.emails || [])).catch(() => {}); }, []);
  async function save(next: string[]) {
    setEmails(next); setSaved(false);
    const r = await fetch("/api/admin/cc", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ emails: next }) }).then((x) => x.json()).catch(() => null);
    if (r?.ok) { setEmails(r.emails); setSaved(true); setTimeout(() => setSaved(false), 2000); }
  }
  function add(e: React.FormEvent) { e.preventDefault(); const v = input.trim().toLowerCase(); if (/.+@.+\..+/.test(v) && !emails.includes(v)) { save([...emails, v]); setInput(""); } }
  return (
    <div className="cc-box">
      <p style={{ color: "var(--muted)", fontSize: 13, margin: "0 0 14px" }}>You&rsquo;re always CC&rsquo;d. Add anyone else who should be copied on every Investor Discovery Tour request.{saved && <span style={{ color: "var(--teal-soft)", marginLeft: 8 }}>Saved ✓</span>}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
        <span className="tag-role">jeff.cline@me.com (you)</span>
        {emails.map((e) => (
          <span key={e} className="cc-chip">{e}<button onClick={() => save(emails.filter((x) => x !== e))} aria-label="remove">×</button></span>
        ))}
      </div>
      <form onSubmit={add} style={{ display: "flex", gap: 8, maxWidth: 420 }}>
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="name@company.com" style={{ background: "var(--ground-2)", border: "1px solid var(--line-soft)", borderRadius: 3, padding: "10px 12px", color: "var(--ivory)", flex: 1 }} />
        <button className="btn-teal" style={{ padding: "10px 16px" }}>Add</button>
      </form>
    </div>
  );
}
