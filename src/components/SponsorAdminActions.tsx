"use client";
import { useState } from "react";
export default function SponsorAdminActions({ sponsorId, status, offers }: { sponsorId: string; status: string; offers: { slug: string; title: string }[] }) {
  const [msg, setMsg] = useState(""); const [busy, setBusy] = useState(false); const [slug, setSlug] = useState(offers[0]?.slug || "");
  async function act(action: string, offerSlug?: string) {
    setBusy(true); setMsg("");
    const r = await fetch("/api/admin/sponsor", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action, sponsorId, offerSlug }) }).then((x) => x.json()).catch(() => null);
    setBusy(false);
    if (r?.ok && r.redirect) { location.href = r.redirect; return; }
    setMsg(r?.ok ? (r.message || "Done.") : (r?.error || "Failed."));
  }
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
      {status !== "active" && <button className="btn-teal" disabled={busy} style={{ padding: "5px 10px", fontSize: 11 }} onClick={() => act("activate")}>Activate</button>}
      {status === "active" && <button className="btn ghost" disabled={busy} style={{ padding: "5px 10px", fontSize: 11 }} onClick={() => act("impersonate")}>Impersonate</button>}
      {offers.length > 0 && (<><select value={slug} onChange={(e) => setSlug(e.target.value)} style={{ fontSize: 11, padding: "4px 6px", background: "var(--ground-2)", border: "1px solid var(--line-soft)", borderRadius: 3, color: "var(--ivory)", maxWidth: 130 }}>{offers.map((o) => <option key={o.slug} value={o.slug}>{o.title}</option>)}</select><button className="btn ghost" disabled={busy} style={{ padding: "5px 10px", fontSize: 11 }} onClick={() => act("assign", slug)}>Assign</button></>)}
      {msg && <span className="crm-sub" style={{ fontSize: 11 }}>{msg}</span>}
    </div>
  );
}
