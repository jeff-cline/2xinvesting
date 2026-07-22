"use client";
import { useState } from "react";
export default function GeekForm() {
  const [f, setF] = useState({ name: "", email: "", phone: "", business: "", message: "" });
  const [busy, setBusy] = useState(false); const [done, setDone] = useState(false); const [err, setErr] = useState("");
  const set = (k: string, v: string) => setF({ ...f, [k]: v });
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setErr("");
    const r = await fetch("/api/leads", { method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...f, role: "private", kind: "geek", sourcePage: "/geek" }) }).then((x) => x.json()).catch(() => null);
    setBusy(false);
    if (r?.ok) setDone(true); else setErr(r?.error || "Something went wrong. Please try again.");
  }
  if (done) return <div className="ok fade d1"><b>Got it.</b><p style={{ color: "var(--muted)", margin: 0 }}>Thanks — Jeff Cline will reach out about getting you in early.</p></div>;
  return (
    <form onSubmit={submit} className="fade d1">
      <div className="field"><label>Name</label><input required value={f.name} onChange={(e) => set("name", e.target.value)} /></div>
      <div className="field"><label>Email</label><input required type="email" value={f.email} onChange={(e) => set("email", e.target.value)} /></div>
      <div className="field"><label>Phone</label><input required value={f.phone} onChange={(e) => set("phone", e.target.value)} /></div>
      <div className="field"><label>Company (optional)</label><input value={f.business} onChange={(e) => set("business", e.target.value)} /></div>
      <div className="field"><label>What are you building / what do you need?</label><textarea rows={4} value={f.message} onChange={(e) => set("message", e.target.value)} /></div>
      {err && <p className="form-note" style={{ color: "#e08a8a" }}>{err}</p>}
      <button className="btn solid" disabled={busy} style={{ width: "100%", justifyContent: "center", padding: 15 }}>{busy ? "…" : "Contact Jeff Cline"}</button>
    </form>
  );
}
