import { isAuthed, getGod } from "@/lib/auth";
import { db } from "@/lib/db";
import AdminLogin from "@/components/AdminLogin";
import AdminReset from "@/components/AdminReset";
import LogoutButton from "@/components/LogoutButton";
import CcManager from "@/components/CcManager";
import SponsorAdminActions from "@/components/SponsorAdminActions";

export const dynamic = "force-dynamic";

const ROLE: Record<string, string> = { accredited: "Accredited Investor", fund_manager: "Fund Manager", jv: "Joint Venture", private: "Private Investor" };
const KIND: Record<string, string> = { investor: "Investor", pocket: "Pocket", geek: "Need a Geek" };
const fmt = (d: Date) => new Date(d).toISOString().slice(0, 16).replace("T", " ");

function Shell({ children }: { children: React.ReactNode }) {
  return <main><div className="wrap" style={{ padding: "60px 0" }}>{children}</div></main>;
}

export default async function AdminPage() {
  if (!(await isAuthed())) return <Shell><AdminLogin /></Shell>;
  const god = await getGod();
  if (god.mustReset) return <Shell><AdminReset /></Shell>;

  const [leads, sponsors, offers, pageviews, visitorGroups, topPages] = await Promise.all([
    db.investLead.findMany({ orderBy: { createdAt: "desc" }, take: 500 }),
    db.investSponsor.findMany({ orderBy: { createdAt: "desc" }, take: 500 }),
    db.investOffer.findMany({ orderBy: { clicks: "desc" } }),
    db.investEvent.count({ where: { type: "pageview" } }),
    db.investEvent.groupBy({ by: ["visitorId"] }).catch(() => [] as { visitorId: string }[]),
    db.investEvent.groupBy({ by: ["page"], where: { type: "pageview" }, _count: { page: true }, orderBy: { _count: { page: "desc" } }, take: 8 }).catch(() => [] as { page: string; _count: { page: number } }[]),
  ]);
  const uniqueVisitors = visitorGroups.length;
  const offerName = new Map(offers.map((o) => [o.id, o.title]));
  const impressions = offers.reduce((a, o) => a + o.impressions, 0);
  const clicks = offers.reduce((a, o) => a + o.clicks, 0); // high-intent engagements
  const ctas = leads.length; // people who took a CTA action
  const convRate = clicks > 0 ? (ctas / clicks) * 100 : 0;
  const topOffers = offers.filter((o) => o.impressions + o.clicks > 0).slice(0, 6);

  return (
    <main>
      <div className="wrap" style={{ padding: "48px 0 70px" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, marginBottom: 8 }}>
          <div><span className="eyebrow">God Console</span><h1 style={{ fontSize: 34, marginTop: 10 }}>Engagement & CRM</h1></div>
          <LogoutButton />
        </div>

        {/* High-intent engagement dashboard */}
        <div className="crm-kpis" style={{ gridTemplateColumns: "repeat(5,1fr)" }}>
          <div className="crm-kpi"><div className="n">{impressions.toLocaleString()}</div><div className="l">Impressions</div></div>
          <div className="crm-kpi"><div className="n">{clicks.toLocaleString()}</div><div className="l">High-Intent Clicks</div></div>
          <div className="crm-kpi"><div className="n">{ctas.toLocaleString()}</div><div className="l">CTA Actions</div></div>
          <div className="crm-kpi"><div className="n">{convRate.toFixed(1)}%</div><div className="l">Click → Action</div></div>
          <div className="crm-kpi"><div className="n">{sponsors.length}</div><div className="l">Sponsors</div></div>
        </div>

        {topOffers.length > 0 && (
          <section style={{ marginTop: 34 }}>
            <div className="crm-head"><span className="pill inv">High-Intent Engagements</span><span className="crm-sub">Which opportunities investors click around</span></div>
            <div className="crm-table-wrap">
              <table className="crm-table">
                <thead><tr><th>Opportunity</th><th>Category</th><th>Impressions</th><th>Clicks (intent)</th><th>Where</th></tr></thead>
                <tbody>
                  {topOffers.map((o) => (
                    <tr key={o.id}>
                      <td><b>{o.title}</b></td>
                      <td className="dim">{o.category}</td>
                      <td>{o.impressions}</td>
                      <td><span className="tag-role">{o.clicks}</span></td>
                      <td className="dim">{o.pocket ? "Pocket" : o.trending ? "Trending" : "Portfolio"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Visitor click-path activity */}
        <section style={{ marginTop: 40 }}>
          <div className="crm-head"><span className="pill inv">Visitor Activity</span><span className="crm-sub">How people click around the site</span></div>
          <div className="crm-kpis" style={{ gridTemplateColumns: "repeat(2,1fr)", marginTop: 0, marginBottom: 16 }}>
            <div className="crm-kpi"><div className="n">{uniqueVisitors.toLocaleString()}</div><div className="l">Unique Visitors</div></div>
            <div className="crm-kpi"><div className="n">{pageviews.toLocaleString()}</div><div className="l">Pageviews</div></div>
          </div>
          <div className="crm-table-wrap">
            <table className="crm-table">
              <thead><tr><th>Page</th><th>Views</th></tr></thead>
              <tbody>
                {topPages.map((p) => (<tr key={p.page}><td><b>{p.page || "/"}</b></td><td><span className="tag-role">{p._count.page}</span></td></tr>))}
                {topPages.length === 0 && <tr><td colSpan={2} className="empty">No visits tracked yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>

        {/* Discovery Tour CC list */}
        <section style={{ marginTop: 40 }}>
          <div className="crm-head"><span className="pill spo" style={{ background: "rgba(20,184,166,.18)", color: "var(--teal-soft)", borderColor: "rgba(20,184,166,.4)" }}>Discovery Tour CC</span><span className="crm-sub">Who gets copied on tour requests</span></div>
          <CcManager />
        </section>

        <section style={{ marginTop: 40 }}>
          <div className="crm-head"><span className="pill inv">Investor & Interest Leads</span><span className="crm-sub">Everyone who registered or requested — and where</span></div>
          <div className="crm-table-wrap">
            <table className="crm-table">
              <thead><tr><th>When</th><th>Name</th><th>Kind</th><th>Type</th><th>Phone</th><th>Email</th><th>Interested in</th><th>Signed up on</th></tr></thead>
              <tbody>
                {leads.map((r) => (
                  <tr key={r.id}>
                    <td className="dim">{fmt(r.createdAt)}</td>
                    <td><b>{r.name || "—"}</b></td>
                    <td><span className="tag-status">{KIND[r.kind] || r.kind}</span></td>
                    <td>{r.kind === "investor" ? <span className="tag-role">{ROLE[r.role] || r.role}</span> : <span className="dim">—</span>}</td>
                    <td>{r.phone || "—"}</td>
                    <td>{r.email || "—"}</td>
                    <td>{r.offerId ? (offerName.get(r.offerId) || "—") : <span className="dim">{(() => { try { return JSON.parse(r.interests)[0] || "browsing"; } catch { return "browsing"; } })()}</span>}</td>
                    <td className="dim">{r.sourcePage || "—"}</td>
                  </tr>
                ))}
                {leads.length === 0 && <tr><td colSpan={8} className="empty">No leads yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>

        <section style={{ marginTop: 44 }}>
          <div className="crm-head"><span className="pill spo">Sponsors</span><span className="crm-sub">Applied to list an offering</span></div>
          <div className="crm-table-wrap">
            <table className="crm-table">
              <thead><tr><th>When</th><th>Name</th><th>Business</th><th>Email</th><th>Status</th><th>Manage</th></tr></thead>
              <tbody>
                {sponsors.map((r) => (
                  <tr key={r.id}>
                    <td className="dim">{fmt(r.createdAt)}</td>
                    <td><b>{r.name || "—"}</b></td>
                    <td>{r.business || "—"}</td>
                    <td>{r.email || "—"}</td>
                    <td><span className="tag-status">{r.status}</span></td>
                    <td><SponsorAdminActions sponsorId={r.id} status={r.status} offers={offers.map((o) => ({ slug: o.slug, title: o.title }))} /></td>
                  </tr>
                ))}
                {sponsors.length === 0 && <tr><td colSpan={6} className="empty">No sponsor applications yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
