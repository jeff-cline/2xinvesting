"use client";
import { useState } from "react";
const CRMS = [{ v: "gohighlevel", label: "GoHighLevel" }, { v: "zoho", label: "Zoho" }, { v: "salesforce", label: "Salesforce" }];
export default function IntegrationPanel({ crmType, crmEndpoint, connected }: { crmType: string; crmEndpoint: string; connected: boolean }) {
  const [type, setType] = useState(crmType || "gohighlevel");
  const [endpoint, setEndpoint] = useState(crmEndpoint || "");
  const [apiKey, setApiKey] = useState("");
  const [msg, setMsg] = useState(connected ? "Connected." : "");
  const [busy, setBusy] = useState(false);
  async function saveCfg() {
    setBusy(true); setMsg("");
    const r = await fetch("/api/sponsor/integration", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ crmType: type, crmApiKey: apiKey, crmEndpoint: endpoint }) }).then((x) => x.json()).catch(() => null);
    setBusy(false); setMsg(r?.ok ? "Saved & connected." : "Could not save.");
  }
  async function sync() {
    setBusy(true); setMsg("Syncing…");
    const r = await fetch("/api/sponsor/sync", { method: "POST" }).then((x) => x.json()).catch(() => null);
    setBusy(false); setMsg(r?.ok ? `Pushed ${r.pushed}/${r.total} leads to your CRM.` : (r?.error || "Sync failed."));
  }
  return (
    <div className="cc-box">
      <p style={{ color: "var(--muted)", fontSize: 13, margin: "0 0 16px" }}>Sync your 2X leads into your own CRM. GoHighLevel and generic webhooks work today via an inbound webhook URL; Zoho &amp; Salesforce OAuth are coming.</p>
      <div className="field"><label>CRM</label><select value={type} onChange={(e) => setType(e.target.value)}>{CRMS.map((c) => <option key={c.v} value={c.v}>{c.label}</option>)}</select></div>
      <div className="field"><label>Inbound webhook / endpoint URL</label><input value={endpoint} onChange={(e) => setEndpoint(e.target.value)} placeholder="https://services.leadconnectorhq.com/hooks/..." /></div>
      <div className="field"><label>API key (optional, sent as Bearer)</label><input value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="Leave blank if the webhook is unauthenticated" /></div>
      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <button className="btn solid" onClick={saveCfg} disabled={busy} style={{ padding: "10px 18px" }}>Save &amp; Connect</button>
        <button className="btn-teal" onClick={sync} disabled={busy} style={{ padding: "10px 18px" }}>Sync Leads Now</button>
        {msg && <span className="crm-sub">{msg}</span>}
      </div>
    </div>
  );
}
