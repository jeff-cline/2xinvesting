"use client";
import { useState } from "react";

const ROLES = [
  { v: "accredited", label: "Accredited Investor" }, { v: "fund_manager", label: "Fund Manager" },
  { v: "jv", label: "Joint Venture" }, { v: "private", label: "Private Investor" },
];

export default function MemberAuth({ next = "/member" }: { next?: string }) {
  const [mode, setMode] = useState<"login" | "register">("register");
  const [f, setF] = useState({ name: "", email: "", phone: "", password: "", role: "accredited" });
  const [busy, setBusy] = useState(false); const [err, setErr] = useState("");
  const set = (k: string, v: string) => setF({ ...f, [k]: v });

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setErr("");
    const url = mode === "login" ? "/api/member/login" : "/api/member/register";
    const body = mode === "login" ? { email: f.email, password: f.password } : f;
    const r = await fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) }).then((x) => x.json()).catch(() => null);
    if (r?.ok) { window.location.href = next; return; }
    setBusy(false); setErr(r?.error || "Something went wrong.");
  }

  return (
    <div className="form-wrap" style={{ maxWidth: 440 }}>
      <h1 style={{ fontSize: 30, marginBottom: 6 }}>Members Area</h1>
      <p className="form-note" style={{ marginBottom: 18 }}>Become a member to unlock every offering&rsquo;s private documents — decks, PPMs, and memoranda.</p>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <button onClick={() => setMode("register")} className={mode === "register" ? "btn-teal" : "btn ghost"} style={{ flex: 1, justifyContent: "center", padding: 10 }}>Create Account</button>
        <button onClick={() => setMode("login")} className={mode === "login" ? "btn-teal" : "btn ghost"} style={{ flex: 1, justifyContent: "center", padding: 10 }}>Sign In</button>
      </div>
      <form onSubmit={submit}>
        {mode === "register" && (<>
          <div className="field"><label>Full name</label><input required value={f.name} onChange={(e) => set("name", e.target.value)} /></div>
          <div className="field"><label>Phone</label><input required value={f.phone} onChange={(e) => set("phone", e.target.value)} /></div>
        </>)}
        <div className="field"><label>Email</label><input required type="email" value={f.email} onChange={(e) => set("email", e.target.value)} /></div>
        <div className="field"><label>Password</label><input required type="password" value={f.password} onChange={(e) => set("password", e.target.value)} placeholder={mode === "register" ? "At least 8 characters" : ""} /></div>
        {mode === "register" && (<div className="field"><label>I am a…</label><select value={f.role} onChange={(e) => set("role", e.target.value)}>{ROLES.map((r) => <option key={r.v} value={r.v}>{r.label}</option>)}</select></div>)}
        {err && <p className="form-note" style={{ color: "#e08a8a" }}>{err}</p>}
        <button className="btn-teal" disabled={busy} style={{ width: "100%", justifyContent: "center", padding: 14 }}>{busy ? "…" : mode === "login" ? "Sign In" : "Create My Account"}</button>
      </form>
    </div>
  );
}
