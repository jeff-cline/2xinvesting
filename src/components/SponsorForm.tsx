"use client";
import { useState } from "react";

export default function SponsorForm() {
  const [f, setF] = useState({ name: "", email: "", phone: "", business: "", offerPitch: "" });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");
  const set = (k: string, v: string) => setF({ ...f, [k]: v });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr("");
    const r = await fetch("/api/sponsors", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(f) }).then((x) => x.json()).catch(() => null);
    setBusy(false);
    if (r?.ok) setDone(true); else setErr(r?.error || "Something went wrong. Please try again.");
  }

  if (done) return (
    <div className="ok fade d1">
      <b>Application received.</b>
      <p style={{ color: "var(--muted)", margin: 0 }}>Thank you — we&rsquo;ll review your offering and set up your sponsor account, where you&rsquo;ll build your landing page, track impressions and interest, and sync your CRM.</p>
    </div>
  );

  return (
    <form onSubmit={submit} className="fade d1">
      <div className="field"><label>Your name</label><input required value={f.name} onChange={(e) => set("name", e.target.value)} placeholder="Full name" /></div>
      <div className="field"><label>Email</label><input required type="email" value={f.email} onChange={(e) => set("email", e.target.value)} placeholder="you@yourfund.com" /></div>
      <div className="field"><label>Phone</label><input required value={f.phone} onChange={(e) => set("phone", e.target.value)} placeholder="(000) 000-0000" /></div>
      <div className="field"><label>Business / fund name</label><input required value={f.business} onChange={(e) => set("business", e.target.value)} placeholder="Your entity" /></div>
      <div className="field"><label>Tell us about your offering</label><textarea rows={4} value={f.offerPitch} onChange={(e) => set("offerPitch", e.target.value)} placeholder="Asset class, structure, minimums, and what makes it distinctive." /></div>
      {err && <p className="form-note" style={{ color: "#e08a8a" }}>{err}</p>}
      <button className="btn solid" disabled={busy} style={{ width: "100%", justifyContent: "center", padding: 15, marginTop: 6 }}>{busy ? "Submitting…" : "Apply to Sponsor"}</button>
      <p className="form-note" style={{ textAlign: "center", marginTop: 12 }}>We review every sponsor. You&rsquo;ll get account access once approved.</p>
    </form>
  );
}
