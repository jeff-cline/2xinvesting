"use client";
import { useState } from "react";

export default function OpportunityForm({ kind, buttonLabel = "Request Information", roleOptions, detailsLabel, detailsPlaceholder }: {
  kind: "offtake" | "exit-optimization";
  buttonLabel?: string;
  roleOptions: string[];
  detailsLabel: string;
  detailsPlaceholder: string;
}) {
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ name: "", email: "", phone: "", company: "", role: roleOptions[0] || "", details: "" });
  const [busy, setBusy] = useState(false); const [err, setErr] = useState("");
  const set = (k: string, v: string) => setF({ ...f, [k]: v });

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setErr("");
    const r = await fetch("/api/opportunity", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...f, kind }) }).then((x) => x.json()).catch(() => null);
    if (r?.ok) { window.location.href = r.redirect || "/"; return; }
    setBusy(false); setErr(r?.error || "Something went wrong. Please try again.");
  }

  return (
    <>
      <button className="btn solid" onClick={() => setOpen(true)} style={{ padding: "14px 24px" }}>{buttonLabel}</button>
      {open && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
          <div className="modal-card">
            <button className="modal-close" onClick={() => setOpen(false)} aria-label="Close">×</button>
            <span className="eyebrow">Request Information</span>
            <h3 style={{ fontSize: 26, margin: "10px 0 18px" }}>Tell us about you</h3>
            <form onSubmit={submit}>
              <div className="field"><label>Full name</label><input required value={f.name} onChange={(e) => set("name", e.target.value)} /></div>
              <div className="field"><label>Email</label><input required type="email" value={f.email} onChange={(e) => set("email", e.target.value)} /></div>
              <div className="field"><label>Phone</label><input required value={f.phone} onChange={(e) => set("phone", e.target.value)} /></div>
              <div className="field"><label>Company / entity</label><input value={f.company} onChange={(e) => set("company", e.target.value)} /></div>
              <div className="field"><label>Your role</label><select value={f.role} onChange={(e) => set("role", e.target.value)}>{roleOptions.map((r) => <option key={r} value={r}>{r}</option>)}</select></div>
              <div className="field"><label>{detailsLabel}</label><textarea rows={3} value={f.details} onChange={(e) => set("details", e.target.value)} placeholder={detailsPlaceholder} /></div>
              {err && <p className="form-note" style={{ color: "#e08a8a" }}>{err}</p>}
              <button className="btn solid" disabled={busy} style={{ width: "100%", justifyContent: "center", padding: 14 }}>{busy ? "Submitting…" : "Submit & Continue"}</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
