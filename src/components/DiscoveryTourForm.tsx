"use client";
import { useState } from "react";

const ROLES = [
  { v: "accredited", label: "Accredited Investor" },
  { v: "fund_manager", label: "Fund Manager" },
  { v: "jv", label: "Joint Venture" },
  { v: "private", label: "Private Investor" },
];

export default function DiscoveryTourForm() {
  const [step, setStep] = useState(1);
  const [f, setF] = useState({ name: "", email: "", phone: "", business: "", role: "accredited", dates: "", notes: "" });
  const [busy, setBusy] = useState(false); const [done, setDone] = useState(false); const [err, setErr] = useState("");
  const set = (k: string, v: string) => setF({ ...f, [k]: v });

  function qualify(e: React.FormEvent) {
    e.preventDefault();
    if (!f.name || !f.email || !f.phone) return setErr("Please complete your name, email, and phone.");
    setErr(""); setStep(2);
  }
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setErr("");
    const r = await fetch("/api/discovery-tour", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(f) }).then((x) => x.json()).catch(() => null);
    setBusy(false);
    if (r?.ok) setDone(true); else setErr(r?.error || "Something went wrong. Please try again.");
  }

  if (done) return (
    <div className="ok fade d1">
      <b>Your tour request is in.</b>
      <p style={{ color: "var(--muted)", margin: 0 }}>Thank you, {f.name.split(" ")[0]}. We&rsquo;ve received your requested dates and will confirm availability shortly.</p>
    </div>
  );

  return step === 1 ? (
    <form onSubmit={qualify} className="fade d1">
      <div style={{ display: "flex", gap: 10, marginBottom: 18 }}><span className="member-badge" style={{ background: "var(--teal)" }}>Step 1 · Qualify</span></div>
      <div className="field"><label>Full name</label><input required value={f.name} onChange={(e) => set("name", e.target.value)} placeholder="Jane Investor" /></div>
      <div className="field"><label>Email</label><input required type="email" value={f.email} onChange={(e) => set("email", e.target.value)} /></div>
      <div className="field"><label>Phone</label><input required value={f.phone} onChange={(e) => set("phone", e.target.value)} /></div>
      <div className="field"><label>Business / entity (optional)</label><input value={f.business} onChange={(e) => set("business", e.target.value)} /></div>
      <div className="field"><label>I am a…</label><select value={f.role} onChange={(e) => set("role", e.target.value)}>{ROLES.map((r) => <option key={r.v} value={r.v}>{r.label}</option>)}</select></div>
      {err && <p className="form-note" style={{ color: "#e08a8a" }}>{err}</p>}
      <button className="btn-teal" style={{ width: "100%", justifyContent: "center", padding: 15 }}>Qualify &amp; Continue →</button>
    </form>
  ) : (
    <form onSubmit={submit} className="fade d1">
      <div style={{ display: "flex", gap: 10, marginBottom: 18 }}><span className="member-badge" style={{ background: "var(--teal)" }}>Step 2 · Request Dates</span></div>
      <div className="field"><label>Preferred dates &amp; availability</label><textarea rows={3} value={f.dates} onChange={(e) => set("dates", e.target.value)} placeholder="e.g. week of Aug 18, or any weekday afternoon in September" /></div>
      <div className="field"><label>Anything we should know? (optional)</label><textarea rows={3} value={f.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Interests, group size, travel plans…" /></div>
      {err && <p className="form-note" style={{ color: "#e08a8a" }}>{err}</p>}
      <button className="btn-teal" disabled={busy} style={{ width: "100%", justifyContent: "center", padding: 15 }}>{busy ? "Sending…" : "Request My Tour Dates"}</button>
      <button type="button" onClick={() => setStep(1)} className="form-note" style={{ background: "none", border: 0, color: "var(--muted)", cursor: "pointer", marginTop: 10, width: "100%" }}>← back</button>
    </form>
  );
}
