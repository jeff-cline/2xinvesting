"use client";
import { useState } from "react";
export default function SponsorLogin() {
  const [email, setEmail] = useState(""); const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false); const [err, setErr] = useState("");
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setErr("");
    const r = await fetch("/api/sponsor/login", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email, password: pw }) }).then((x) => x.json()).catch(() => null);
    setBusy(false);
    if (r?.ok) location.href = "/portal"; else setErr(r?.error || "Login failed.");
  }
  return (
    <form onSubmit={submit} className="form-wrap" style={{ maxWidth: 420 }}>
      <h1 style={{ fontSize: 30, marginBottom: 6 }}>Sponsor Portal</h1>
      <p className="form-note" style={{ marginBottom: 20 }}>Sign in to manage your offering, leads, and CRM.</p>
      <div className="field"><label>Email</label><input value={email} onChange={(e) => setEmail(e.target.value)} /></div>
      <div className="field"><label>Password</label><input type="password" value={pw} onChange={(e) => setPw(e.target.value)} /></div>
      {err && <p className="form-note" style={{ color: "#e08a8a" }}>{err}</p>}
      <button className="btn solid" disabled={busy} style={{ width: "100%", justifyContent: "center", padding: 14 }}>{busy ? "…" : "Sign In"}</button>
    </form>
  );
}
