import { isAuthed, getGod } from "@/lib/auth";
import { db } from "@/lib/db";
import AdminLogin from "@/components/AdminLogin";
import AdminReset from "@/components/AdminReset";
import LogoutButton from "@/components/LogoutButton";

export const dynamic = "force-dynamic";

const ROLE: Record<string, string> = { accredited: "Accredited Investor", fund_manager: "Fund Manager", jv: "Joint Venture", private: "Private Investor" };
const fmt = (d: Date) => new Date(d).toISOString().slice(0, 16).replace("T", " ");

function Shell({ children }: { children: React.ReactNode }) {
  return <main><div className="wrap" style={{ padding: "60px 0" }}>{children}</div></main>;
}

export default async function AdminPage() {
  if (!(await isAuthed())) return <Shell><AdminLogin /></Shell>;
  const god = await getGod();
  if (god.mustReset) return <Shell><AdminReset /></Shell>;

  const [investors, sponsors, offers] = await Promise.all([
    db.investLead.findMany({ orderBy: { createdAt: "desc" }, take: 500 }),
    db.investSponsor.findMany({ orderBy: { createdAt: "desc" }, take: 500 }),
    db.investOffer.findMany({ select: { id: true, title: true } }),
  ]);
  const offerName = new Map(offers.map((o) => [o.id, o.title]));

  return (
    <main>
      <div className="wrap" style={{ padding: "48px 0 70px" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, marginBottom: 8 }}>
          <div>
            <span className="eyebrow">God Console</span>
            <h1 style={{ fontSize: 34, marginTop: 10 }}>Registrations CRM</h1>
          </div>
          <LogoutButton />
        </div>

        <div className="crm-kpis">
          <div className="crm-kpi"><div className="n">{investors.length}</div><div className="l">Investors</div></div>
          <div className="crm-kpi"><div className="n">{sponsors.length}</div><div className="l">Sponsors</div></div>
          <div className="crm-kpi"><div className="n">{offers.length}</div><div className="l">Opportunities</div></div>
        </div>

        <section style={{ marginTop: 40 }}>
          <div className="crm-head"><span className="pill inv">Investors</span><span className="crm-sub">People who registered to invest</span></div>
          <div className="crm-table-wrap">
            <table className="crm-table">
              <thead><tr><th>When</th><th>Name</th><th>Type</th><th>Phone</th><th>Email</th><th>Business</th><th>Interested in</th></tr></thead>
              <tbody>
                {investors.map((r) => (
                  <tr key={r.id}>
                    <td className="dim">{fmt(r.createdAt)}</td>
                    <td><b>{r.name || "—"}</b></td>
                    <td><span className="tag-role">{ROLE[r.role] || r.role || "—"}</span></td>
                    <td>{r.phone || "—"}</td>
                    <td>{r.email || "—"}</td>
                    <td className="dim">{r.business || "—"}</td>
                    <td>{r.offerId ? (offerName.get(r.offerId) || "—") : <span className="dim">browsing</span>}</td>
                  </tr>
                ))}
                {investors.length === 0 && <tr><td colSpan={7} className="empty">No investor registrations yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>

        <section style={{ marginTop: 44 }}>
          <div className="crm-head"><span className="pill spo">Sponsors</span><span className="crm-sub">People who applied to list an offering</span></div>
          <div className="crm-table-wrap">
            <table className="crm-table">
              <thead><tr><th>When</th><th>Name</th><th>Business</th><th>Phone</th><th>Email</th><th>Status</th><th>Offering</th></tr></thead>
              <tbody>
                {sponsors.map((r) => (
                  <tr key={r.id}>
                    <td className="dim">{fmt(r.createdAt)}</td>
                    <td><b>{r.name || "—"}</b></td>
                    <td>{r.business || "—"}</td>
                    <td>{r.phone || "—"}</td>
                    <td>{r.email || "—"}</td>
                    <td><span className="tag-status">{r.status}</span></td>
                    <td className="dim">{r.offerPitch ? r.offerPitch.slice(0, 60) + (r.offerPitch.length > 60 ? "…" : "") : "—"}</td>
                  </tr>
                ))}
                {sponsors.length === 0 && <tr><td colSpan={7} className="empty">No sponsor applications yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
