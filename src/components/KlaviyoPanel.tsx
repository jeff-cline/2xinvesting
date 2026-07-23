"use client";
import { useEffect, useState } from "react";
export default function KlaviyoPanel() {
  const [hasKey, setHasKey] = useState(false); const [listId, setListId] = useState(""); const [connected, setConnected] = useState(false);
  const [apiKey, setApiKey] = useState(""); const [msg, setMsg] = useState(""); const [busy, setBusy] = useState(false);
  useEffect(() => { fetch("/api/admin/klaviyo").then((x) => x.json()).then((r) => { if (r?.ok) { setHasKey(r.hasKey); setListId(r.listId || ""); setConnected(r.connected); } }).catch(() => {}); }, []);
  async function save() {
    setBusy(true); setMsg("Testing…");
    const r = await fetch("/api/admin/klaviyo", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ apiKey, listId }) }).then((x) => x.json()).catch(() => null);
    setBusy(false);
    if (r?.ok && r.connected) { setConnected(true); setHasKey(true); setApiKey(""); setMsg("Connected ✓"); }
    else setMsg(r?.error || "Could not connect.");
  }
  return (
    <div className="cc-box">
      <p style={{ color: "var(--muted)", fontSize: 13, margin: "0 0 14px" }}>
        Status: {connected ? <b style={{ color: "var(--teal-soft)" }}>Connected</b> : <b style={{ color: "#e0b070" }}>Not connected</b>}. When someone becomes a member, we push their profile + a <b>“2X Interest”</b> event to Klaviyo (the opt‑in trigger). Every offering/product they open or download fires another event so your flows send smart, interest‑based emails.
      </p>
      <div className="field"><label>Klaviyo Private API Key (pk_…)</label><input value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder={hasKey ? "•••••••• (leave blank to keep current)" : "pk_live_…"} /></div>
      <div className="field"><label>Marketing List ID (for opt‑in subscribe)</label><input value={listId} onChange={(e) => setListId(e.target.value)} placeholder="e.g. XyZaBc" /></div>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <button className="btn-teal" onClick={save} disabled={busy} style={{ padding: "10px 18px" }}>Save &amp; Test</button>
        {msg && <span className="crm-sub">{msg}</span>}
      </div>
    </div>
  );
}
