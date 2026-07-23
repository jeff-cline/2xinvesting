import { redirect } from "next/navigation";
import Link from "next/link";
import { Header, Footer } from "@/components/Chrome";
import { getSessionMember } from "@/lib/member-auth";
import { getHomeOffers, type Offer } from "@/lib/offers";
import MemberLogout from "@/components/MemberLogout";

export const dynamic = "force-dynamic";

function Card({ o }: { o: Offer }) {
  return (
    <Link className="card fade d1" href={`/offers/${o.slug}`}>
      <div className={`cov ${o.featuredImage ? "has-img" : o.coverClass}`} style={o.featuredImage ? { backgroundImage: `linear-gradient(155deg, rgba(10,15,12,.10), rgba(10,15,12,.40)), url(${o.featuredImage})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}>
        {!o.featuredImage && <span className="oglyph">{o.iconGlyph}</span>}
      </div>
      <div className="in"><span className="cat">{o.category}</span><h4>{o.title}</h4><p>{o.blurb}</p><div className="foot"><span>{o.pocket ? "Member Benefit" : "Offering"}</span><span className="view">Open →</span></div></div>
    </Link>
  );
}

export default async function MemberPortal() {
  const m = await getSessionMember();
  if (!m) redirect("/member/login?next=/member");
  const { all } = await getHomeOffers();
  const opportunities = all.filter((o) => !o.pocket);
  const pocket = all.filter((o) => o.pocket);

  return (
    <>
      <Header />
      <main>
        <div className="wrap member-shell">
          <aside className="ml-nav">
            <div className="ml-hi">Welcome,<br /><b>{(m.name || "Member").split(" ")[0]}</b></div>
            <nav>
              <a className="ml-nav-item active" href="#offerings">All Offerings</a>
              <a className="ml-nav-item" href="#pocket">Pocket Offerings</a>
              <Link className="ml-nav-item" href="/offtake-agreements">Off‑Take Agreements</Link>
              <Link className="ml-nav-item" href="/exit-optimization">Exit Optimization</Link>
              <Link className="ml-nav-item" href="/investor-discovery-tour">Free Discovery Tour</Link>
            </nav>
            <div className="ml-nav-foot"><span className="member-badge" style={{ background: "var(--teal)" }}>Member · Docs Unlocked</span><MemberLogout /></div>
          </aside>

          <div className="member-main">
            <span className="eyebrow">Members Area</span>
            <h1 style={{ fontSize: 34, margin: "10px 0 6px" }}>Every offering, unlocked</h1>
            <p style={{ color: "var(--muted)", maxWidth: "56ch", marginBottom: 26 }}>You&rsquo;re a member — open any opportunity to view its private documents (decks, PPMs, memoranda). Everything you open is shared with the sponsor as a warm lead.</p>

            <div id="offerings" className="crm-head"><span className="pill inv">Sponsor Opportunities</span><span className="crm-sub">{opportunities.length} live</span></div>
            <div className="grid six" style={{ marginBottom: 44 }}>{opportunities.map((o) => <Card key={o.slug} o={o} />)}</div>

            {pocket.length > 0 && (<>
              <div id="pocket" className="crm-head"><span className="pill spo" style={{ background: "rgba(20,184,166,.18)", color: "var(--teal-soft)", borderColor: "rgba(20,184,166,.4)" }}>Pocket Offerings</span><span className="crm-sub">Member benefits</span></div>
              <div className="grid six">{pocket.map((o) => <Card key={o.slug} o={o} />)}</div>
            </>)}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
