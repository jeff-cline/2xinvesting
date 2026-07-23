import { Header, Footer } from "@/components/Chrome";
import OpportunityForm from "@/components/OpportunityForm";

export const dynamic = "force-dynamic";

const APPROACH = [
  { t: "One unified team", d: "Attorneys, CPAs, and advisors working from a single strategic plan — not siloed vendors pulling in different directions." },
  { t: "Expand your multiple", d: "Identify and capture the hidden value most owners leave behind, then package it to command a higher multiple at exit." },
  { t: "Get paid at the close", d: "Deal protection and transaction readiness so the value you build actually shows up in your account at closing." },
  { t: "Flexible engagement", d: "Pay-to-Play, Equity Partnership, or Backend Success — align our incentives with your outcome." },
];
const ROLES = ["Business Owner", "Advisor / Broker", "Investor", "Other"];

export default function ExitOptimizationPage() {
  return (
    <>
      <Header />
      <main>
        <section className="partner-hero">
          <div className="wrap partner-hero-in">
            <div>
              <span className="eyebrow" style={{ color: "var(--teal-soft)" }}>In Cooperation with Exit Optimization</span>
              <h1 style={{ fontSize: "clamp(38px,5.2vw,62px)", lineHeight: 1.04, marginTop: 16 }}>Exit Optimization</h1>
              <p className="lede" style={{ color: "var(--ivory)", opacity: .92, maxWidth: "50ch", marginTop: 16, fontSize: 18 }}>Double — even triple — your exit valuation. Most owners leave <b>30–60% of their value on the table</b>. We assemble the team, technology, and strategy that expand your multiple and get you paid at the close.</p>
              <div className="cta-row" style={{ marginTop: 26 }}>
                <OpportunityForm kind="exit-optimization" buttonLabel="Request Information" roleOptions={ROLES} detailsLabel="Revenue range, target exit timeline & what's driving it" detailsPlaceholder="e.g. $8M revenue services firm, exit in 18–24 months" />
              </div>
            </div>
            <div className="partner-logo"><div className="eo-wordmark"><span>EXIT</span><span>OPTIMIZATION</span></div></div>
          </div>
        </section>

        <section className="band">
          <div className="wrap">
            <div className="sec-head"><div><span className="eyebrow">The Approach</span><h2>Stop leaving value on the table</h2></div></div>
            <div className="grid six">
              {APPROACH.map((v) => (
                <div className="card" key={v.t} style={{ padding: "26px 24px" }}>
                  <h4 style={{ fontFamily: "var(--serif)", fontWeight: 400, fontSize: 20, margin: "0 0 10px" }}>{v.t}</h4>
                  <p style={{ color: "var(--muted)", fontSize: 14, margin: 0 }}>{v.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="band" style={{ textAlign: "center" }}>
          <div className="wrap">
            <h2 style={{ fontSize: "clamp(26px,3vw,38px)" }}>See what your exit could be worth</h2>
            <p style={{ color: "var(--muted)", maxWidth: "48ch", margin: "14px auto 22px" }}>Request a complimentary assessment and 30‑minute consultation.</p>
            <OpportunityForm kind="exit-optimization" buttonLabel="Request Information" roleOptions={ROLES} detailsLabel="Revenue range, target exit timeline & what's driving it" detailsPlaceholder="e.g. $8M revenue services firm, exit in 18–24 months" />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
