"use client";
import { useState } from "react";
export default function AdminReset() {
  const [pw, setPw] = useState(""); const [pw2, setPw2] = useState("");
  const [busy, setBusy] = useState(false); const [err, setErr] = useState("");
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setErr("");
    if (pw.length < 8) return setErr("Password must be at least 8 characters.");
    if (pw !== pw2) return setErr("Passwords don't match.");
    setBusy(true);
    const r = await fetch("/api/admin/password", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ password: pw }) }).then((x) => x.json()).catch(() => null);
    setBusy(false);
    if (r?.ok) location.reload(); else setErr(r?.error || "Could not update password.");
  }
  return (
    <form onSubmit={submit} className="form-wrap" style={{ maxWidth: 420 }}>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>Set your password</h1>
      <p className="form-note" style={{ marginBottom: 20 }}>You&rsquo;re signed in with the temporary password. Choose a permanent one to continue.</p>
      <div className="field"><label>New password</label><input type="password" value={pw} onChange={(e) => setPw(e.target.value)} /></div>
      <div className="field"><label>Confirm password</label><input type="password" value={pw2} onChange={(e) => setPw2(e.target.value)} /></div>
      {err && <p className="form-note" style={{ color: "#e08a8a" }}>{err}</p>}
      <button className="btn solid" disabled={busy} style={{ width: "100%", justifyContent: "center", padding: 14 }}>{busy ? "…" : "Save & Continue"}</button>
    </form>
  );
}
