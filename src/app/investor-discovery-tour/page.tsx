import { Header, Footer } from "@/components/Chrome";
import DiscoveryTourForm from "@/components/DiscoveryTourForm";

export const dynamic = "force-dynamic";

const INCLUDED = [
  { t: "Housing", d: "Stay in a private house on the island — not a hotel room.", img: "/media/dt-resort.jpg" },
  { t: "Private Chef", d: "Meals prepared for you, in-house, throughout your stay.", img: "/media/dt-chef.jpg" },
  { t: "Entertainment", d: "Curated evenings, on-water experiences, and the island's best.", img: "/media/dt-marina.jpg" },
  { t: "Guided Tours", d: "Walk the actual opportunities with the principals behind them.", img: "/media/sovereign-cay.jpg" },
];

const OPPORTUNITIES = [
  "Private Island", "Port", "Boutique Hotel", "Casino", "Infrastructure", "Technology",
  "Entertainment", "Sports", "Hospital", "Condos", "Houses", "Manufacturing",
];

export default function DiscoveryTourPage() {
  return (
    <>
      <Header />
      <main>
        <section className="dt-hero" style={{ backgroundImage: `linear-gradient(115deg, rgba(10,15,12,.86), rgba(10,15,12,.48)), url(/media/caribbean-bungalows.jpg)` }}>
          <div className="wrap">
            <span className="eyebrow" style={{ color: "var(--teal-soft)" }}>★ By Invitation · Complimentary</span>
            <h1 style={{ fontSize: "clamp(40px,5.6vw,68px)", lineHeight: 1.04, marginTop: 16, maxWidth: "15ch" }}>The Free Investor Discovery Tour</h1>
            <p className="lede" style={{ color: "var(--ivory)", opacity: .92, maxWidth: "52ch", marginTop: 18, fontSize: 19 }}>Don&rsquo;t read the offerings — <b>live them</b>. Your tour is entirely on us. <b>You only pay for your flight.</b></p>
            <a className="btn-teal" href="#request" style={{ marginTop: 28, padding: "16px 28px", fontSize: 15 }}>★ Start Your Free Discovery Tour</a>
          </div>
        </section>

        {/* What's included */}
        <section className="band">
          <div className="wrap">
            <div className="sec-head"><div><span className="eyebrow">On the House</span><h2>What your tour includes</h2></div><span className="crm-sub" style={{ maxWidth: "26ch", textAlign: "right" }}>You only pay for your flight.</span></div>
            <div className="dt-incl">
              {INCLUDED.map((i) => (
                <div className="dt-card" key={i.t}>
                  <div className="dt-card-img" style={{ backgroundImage: `linear-gradient(180deg, rgba(10,15,12,.15), rgba(10,15,12,.72)), url(${i.img})` }}>
                    <h4>{i.t}</h4>
                  </div>
                  <p>{i.d}</p>
                </div>
              ))}
            </div>
            <div className="dt-highlight fade d1">
              <span className="member-badge" style={{ background: "var(--teal)" }}>Qualified Investors</span>
              <h3 style={{ fontSize: "clamp(22px,2.6vw,30px)", marginTop: 12 }}>Bring up to three additional couples — and take over an entire private house.</h3>
              <p style={{ color: "var(--muted)", margin: "10px 0 0", maxWidth: "58ch" }}>Qualify, and your discovery tour becomes a private-house experience for you and up to three other interested couples. The whole house is yours.</p>
            </div>
          </div>
        </section>

        {/* Caribbean Island opportunities */}
        <section className="band dt-opps" style={{ backgroundImage: `linear-gradient(180deg, rgba(10,15,12,.90), rgba(10,15,12,.94)), url(/media/sovereign-cay.jpg)` }}>
          <div className="wrap">
            <div className="sec-head"><div><span className="eyebrow" style={{ color: "var(--teal-soft)" }}>The Upside</span><h2>Caribbean Island opportunities include</h2></div></div>
            <p style={{ color: "var(--muted)", maxWidth: "60ch", margin: "-12px 0 26px", fontSize: 15.5 }}>A private island is not one deal — it&rsquo;s a whole economy. On your tour you&rsquo;ll walk the ground on opportunities spanning:</p>
            <div className="opp-grid">
              {OPPORTUNITIES.map((o) => (<div className="opp-chip" key={o}><span className="dot" />{o}</div>))}
              <div className="opp-chip more">&amp; more</div>
            </div>
          </div>
        </section>

        {/* Qualify + request */}
        <section className="band" id="request">
          <div className="wrap">
            <div className="sec-head" style={{ justifyContent: "center", textAlign: "center" }}>
              <div><span className="eyebrow" style={{ color: "var(--teal-soft)" }}>Qualify · Then Pick Your Dates</span><h2>Create your profile to request a tour</h2></div>
            </div>
            <div className="form-wrap"><DiscoveryTourForm /></div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
