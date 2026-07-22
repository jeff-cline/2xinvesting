import { redirect } from "next/navigation";
import { Header, Footer } from "@/components/Chrome";
import { getSessionSponsor } from "@/lib/sponsor-auth";
import { db } from "@/lib/db";
import SponsorReset from "@/components/SponsorReset";
import SponsorLogout from "@/components/SponsorLogout";
import LeadNote from "@/components/LeadNote";
import IntegrationPanel from "@/components/IntegrationPanel";

export const dynamic = "force-dynamic";
const ROLE: Record<string, string> = { accredited: "Accredited Investor", fund_manager: "Fund Manager", jv: "Joint Venture", private: "Private Investor" };
const fmt = (d: Date) => new Date(d).toISOString().slice(0, 16).replace("T", " ");

export default async function PortalPage() {
  const s = await getSessionSponsor();
  if (!s) redirect("/sponsor/login");
  if (s.mustReset) return (<><Header /><main><div className="wrap" style={{ padding: "60px 0" }}><SponsorReset /></div></main><Footer /></>);

  const offers = await db.investOffer.findMany({ where: { sponsorId: s.id } });
  const offerIds = offers.map((o) => o.id);
  const leads = offerIds.length ? await db.investLead.findMany({ where: { offerId: { in: offerIds } }, orderBy: { createdAt: "desc" }, take: 500 }) : [];
  const impressions = offers.reduce((a, o) => a + o.impressions, 0);
  const clicks = offers.reduce((a, o) => a + o.clicks, 0);

  return (
    <>
      <Header />
      <main>
        <div className="wrap" style={{ padding: "44px 0 70px" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, marginBottom: 8 }}>
            <div><span className="eyebrow">Sponsor Portal</span><h1 style={{ fontSize: 32, marginTop: 10 }}>{s.business || s.name}</h1></div>
            <SponsorLogout />
          </div>

          <div className="crm-kpis" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
            <div className="crm-kpi"><div className="n">{impressions.toLocaleString()}</div><div className="l">Ad Impressions</div></div>
            <div className="crm-kpi"><div className="n">{clicks.toLocaleString()}</div><div className="l">Expressed Interest</div></div>
            <div className="crm-kpi"><div className="n">{leads.length.toLocaleString()}</div><div className="l">High-Intent Matches</div></div>
            <div className="crm-kpi"><div className="n">{offers.length}</div><div className="l">Your Offerings</div></div>
          </div>

          <section style={{ marginTop: 40 }}>
            <div className="crm-head"><span className="pill spo">Your Offerings</span><span className="crm-sub">Assigned to your account by 2X</span></div>
            <div className="crm-table-wrap">
              <table className="crm-table">
                <thead><tr><th>Offering</th><th>Category</th><th>Impressions</th><th>Expressed Interest</th></tr></thead>
                <tbody>
                  {offers.map((o) => (<tr key={o.id}><td><b>{o.title}</b></td><td className="dim">{o.category}</td><td>{o.impressions}</td><td><span className="tag-role">{o.clicks}</span></td></tr>))}
                  {offers.length === 0 && <tr><td colSpan={4} className="empty">No offering assigned yet — 2X will assign yours from your application.</td></tr>}
                </tbody>
              </table>
            </div>
          </section>

          <section style={{ marginTop: 40 }}>
            <div className="crm-head"><span className="pill inv">Your CRM · Leads</span><span className="crm-sub">Investors who expressed interest in your offering — with what they wanted</span></div>
            <div className="crm-table-wrap">
              <table className="crm-table">
                <thead><tr><th>When</th><th>Name</th><th>Type</th><th>Phone</th><th>Email</th><th>Interested in</th><th>Your notes</th></tr></thead>
                <tbody>
                  {leads.map((r) => (
                    <tr key={r.id}>
                      <td className="dim">{fmt(r.createdAt)}</td>
                      <td><b>{r.name}</b></td>
                      <td>{r.kind === "investor" ? <span className="tag-role">{ROLE[r.role] || r.role}</span> : <span className="tag-status">{r.kind}</span>}</td>
                      <td>{r.phone}</td>
                      <td>{r.email}</td>
                      <td className="dim">{(() => { try { return JSON.parse(r.interests)[0] || "—"; } catch { return "—"; } })()}</td>
                      <td style={{ minWidth: 180 }}><LeadNote leadId={r.id} initial={r.sponsorNote} /></td>
                    </tr>
                  ))}
                  {leads.length === 0 && <tr><td colSpan={7} className="empty">No leads yet. As investors express interest in your offering, they appear here.</td></tr>}
                </tbody>
              </table>
            </div>
          </section>

          <section style={{ marginTop: 40 }}>
            <div className="crm-head"><span className="pill spo" style={{ background: "rgba(20,184,166,.18)", color: "var(--teal-soft)", borderColor: "rgba(20,184,166,.4)" }}>Integrations</span><span className="crm-sub">Sync your leads to your own CRM</span></div>
            <IntegrationPanel crmType={s.crmType} crmEndpoint={s.crmEndpoint} connected={s.crmConnected} />
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
