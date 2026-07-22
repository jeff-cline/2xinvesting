"use client";
import { useState } from "react";

const ROLES = [
  { v: "accredited", label: "Accredited Investor" },
  { v: "fund_manager", label: "Fund Manager" },
  { v: "jv", label: "Joint Venture" },
  { v: "private", label: "Private Investor" },
];

export default function IntakeForm({ offer, kind }: { offer?: string; kind?: string }) {
  const [f, setF] = useState({ name: "", phone: "", email: "", business: "", role: "accredited" });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");
  const set = (k: string, v: string) => setF({ ...f, [k]: v });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr("");
    const sourcePage = (typeof document !== "undefined" && document.referrer ? new URL(document.referrer).pathname : "/invest") + (offer ? ` (${offer})` : "");
    const r = await fetch("/api/leads", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...f, offer, kind: kind === "pocket" ? "pocket" : "investor", sourcePage }) }).then((x) => x.json()).catch(() => null);
    setBusy(false);
    if (r?.ok) setDone(true); else setErr(r?.error || "Something went wrong. Please try again.");
  }

  if (done) return (
    <div className="ok fade d1">
      <b>You&rsquo;re in.</b>
      <p style={{ color: "var(--muted)", margin: 0 }}>Thank you — we&rsquo;ve received your interest and will be in touch with the matching offerings. You can revisit anytime to refine what you&rsquo;re drawn to.</p>
    </div>
  );

  return (
    <form onSubmit={submit} className="fade d1">
      {offer && <p className="form-note" style={{ marginBottom: 18 }}>Registering interest in <b style={{ color: "var(--gold-soft)" }}>{offer.replace(/-/g, " ")}</b>.</p>}
      <div className="field"><label>Full name</label><input required value={f.name} onChange={(e) => set("name", e.target.value)} placeholder="Jane Investor" /></div>
      <div className="field"><label>Phone</label><input required value={f.phone} onChange={(e) => set("phone", e.target.value)} placeholder="(972) 555-0132" /></div>
      <div className="field"><label>Email</label><input required type="email" value={f.email} onChange={(e) => set("email", e.target.value)} placeholder="jane@family-office.com" /></div>
      <div className="field"><label>Business / entity name</label><input value={f.business} onChange={(e) => set("business", e.target.value)} placeholder="Optional" /></div>
      <div className="field"><label>I am a…</label>
        <select value={f.role} onChange={(e) => set("role", e.target.value)}>
          {ROLES.map((r) => <option key={r.v} value={r.v}>{r.label}</option>)}
        </select>
      </div>
      {err && <p className="form-note" style={{ color: "#e08a8a" }}>{err}</p>}
      <button className="btn solid" disabled={busy} style={{ width: "100%", justifyContent: "center", padding: 15, marginTop: 6 }}>{busy ? "Submitting…" : "Request Access"}</button>
      <p className="form-note" style={{ textAlign: "center", marginTop: 12 }}>Private placements for qualified investors. No obligation.</p>
    </form>
  );
}
