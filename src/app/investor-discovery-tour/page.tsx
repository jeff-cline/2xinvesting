import { Header, Footer } from "@/components/Chrome";
import DiscoveryTourForm from "@/components/DiscoveryTourForm";

export const dynamic = "force-dynamic";

const EXPERIENCE = [
  { t: "Tour the offerings", d: "See the assets behind the deals — the casks, the land, the reserves — not a pitch deck." },
  { t: "Meet the principals", d: "Sit down with the people running each opportunity. Ask the hard questions in person." },
  { t: "Experience the lifestyle", d: "This is lifestyle investing. Spend time in the places your capital can take you." },
  { t: "No obligation", d: "Complimentary for qualified investors. Come, look, and decide on your own terms." },
];

export default function DiscoveryTourPage() {
  return (
    <>
      <Header />
      <main>
        <section className="dt-hero" style={{ backgroundImage: `linear-gradient(120deg, rgba(10,15,12,.82), rgba(10,15,12,.55)), url(/media/caribbean-bungalows.jpg)` }}>
          <div className="wrap">
            <span className="eyebrow" style={{ color: "var(--teal-soft)" }}>By Invitation · Complimentary</span>
            <h1 style={{ fontSize: "clamp(38px,5.4vw,64px)", lineHeight: 1.05, marginTop: 16, maxWidth: "14ch" }}>The Free Investor Discovery Tour</h1>
            <p className="lede" style={{ color: "var(--ivory)", opacity: .9, maxWidth: "50ch", marginTop: 18 }}>Don&rsquo;t just read the offerings — walk them. Spend a curated day (or more) inside the opportunities and the lifestyle behind 2X Investing, with the principals who run them.</p>
            <a className="btn-teal" href="#request" style={{ marginTop: 26, padding: "15px 26px" }}>Start Your Free Discovery Tour →</a>
          </div>
        </section>

        <section className="band">
          <div className="wrap">
            <div className="sec-head"><div><span className="eyebrow">The Experience</span><h2>What the tour includes</h2></div></div>
            <div className="grid six">
              {EXPERIENCE.map((e) => (
                <div className="card" key={e.t} style={{ padding: "26px 24px" }}>
                  <h4 style={{ fontFamily: "var(--serif)", fontWeight: 400, fontSize: 20, margin: "0 0 10px" }}>{e.t}</h4>
                  <p style={{ color: "var(--muted)", fontSize: 14, margin: 0 }}>{e.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

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
