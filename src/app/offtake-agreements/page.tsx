import { Header, Footer } from "@/components/Chrome";
import OpportunityForm from "@/components/OpportunityForm";

export const dynamic = "force-dynamic";

const VALUE = [
  { t: "A private, vetted marketplace", d: "A closed ecosystem that connects developers, offtakers, investors, and enterprise buyers — reducing the time and cost of every transaction." },
  { t: "Full-service deal management", d: "Family-office expertise from both the developer and end-user side, structuring complex energy projects end to end." },
  { t: "Self-service option", d: "Prefer to run your own process? Facilitate transactions independently on the platform." },
  { t: "The introduction hub", d: "One centralized connection point for developers, buyers, and investors across North American energy." },
];
const ROLES = ["Developer", "Buyer / Offtaker", "Investor", "Enterprise Buyer", "Other"];

export default function OfftakePage() {
  return (
    <>
      <Header />
      <main>
        <section className="partner-hero">
          <div className="wrap partner-hero-in">
            <div>
              <span className="eyebrow" style={{ color: "var(--teal-soft)" }}>In Cooperation with NAEOA</span>
              <h1 style={{ fontSize: "clamp(38px,5.2vw,62px)", lineHeight: 1.04, marginTop: 16 }}>Off‑Take Agreements</h1>
              <p className="lede" style={{ color: "var(--ivory)", opacity: .92, maxWidth: "48ch", marginTop: 16, fontSize: 18 }}>The leading offtake marketplace for developers, buyers, and investors — a private ecosystem for structuring and closing North American energy deals.</p>
              <div className="cta-row" style={{ marginTop: 26 }}>
                <OpportunityForm kind="offtake" buttonLabel="Request Information" roleOptions={ROLES} detailsLabel="Project / energy type, capacity & timeline" detailsPlaceholder="e.g. 50MW solar PPA, seeking offtaker within 12 months" />
              </div>
            </div>
            <div className="partner-logo"><img src="/media/naeoa-logo.png" alt="North American Energy Offtake Association" width={280} height={280} /></div>
          </div>
        </section>

        <section className="band">
          <div className="wrap">
            <div className="sec-head"><div><span className="eyebrow">The Marketplace</span><h2>What NAEOA does</h2></div></div>
            <p style={{ color: "var(--muted)", maxWidth: "62ch", fontSize: 16, margin: "-10px 0 26px" }}>NAEOA operates a private marketplace and introduction hub connecting the whole energy value chain — developers, offtakers, investors, and enterprise buyers — with secure, full-service deal facilitation.</p>
            <div className="grid six">
              {VALUE.map((v) => (
                <div className="card" key={v.t} style={{ padding: "26px 24px" }}>
                  <h4 style={{ fontFamily: "var(--serif)", fontWeight: 400, fontSize: 20, margin: "0 0 10px" }}>{v.t}</h4>
                  <p style={{ color: "var(--muted)", fontSize: 14, margin: 0 }}>{v.d}</p>
                </div>
              ))}
            </div>
            <p className="form-note" style={{ marginTop: 24 }}>A division of Hornsby Benson &amp; Hughes Co. · Frisco, Texas.</p>
          </div>
        </section>

        <section className="band" style={{ textAlign: "center" }}>
          <div className="wrap">
            <h2 style={{ fontSize: "clamp(26px,3vw,38px)" }}>Explore an off‑take agreement</h2>
            <p style={{ color: "var(--muted)", maxWidth: "48ch", margin: "14px auto 22px" }}>Request information and we&rsquo;ll connect you into the NAEOA marketplace.</p>
            <OpportunityForm kind="offtake" buttonLabel="Request Information" roleOptions={ROLES} detailsLabel="Project / energy type, capacity & timeline" detailsPlaceholder="e.g. 50MW solar PPA, seeking offtaker within 12 months" />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
