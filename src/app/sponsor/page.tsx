import { Header, Footer } from "@/components/Chrome";
import SponsorForm from "@/components/SponsorForm";

export const dynamic = "force-dynamic";

const BENEFITS = [
  { t: "A qualified audience", d: "Your offering reaches a private list of accredited investors, fund managers, and family offices — not the open internet." },
  { t: "An optimized landing page", d: "Publish your featured film, portfolio gallery, and downloadable documents — pitch deck, executive summary, memorandum, PPM." },
  { t: "Your own admin + CRM", d: "A private login to your dashboard and CRM. See every lead for your offering, add notes, and work them your way." },
  { t: "CRM integrations", d: "Sync your leads straight into Zoho, GoHighLevel, or Salesforce via API — your pipeline, your system." },
  { t: "High-intent matching", d: "We surface the investors whose interests match your offering, and show you impressions, clicks, and expressed interest in real time." },
  { t: "Priority placement", d: "Featured rotation, People-Also-View, and Trending placement — on-site and inside the email drip." },
];

export default function SponsorPage() {
  return (
    <>
      <Header />
      <main>
        <div className="wrap page-head" style={{ textAlign: "center" }}>
          <span className="eyebrow">For Sponsors</span>
          <h1 style={{ fontSize: "clamp(34px,4.6vw,54px)", marginTop: 14 }}>List your offering to a<br />qualified audience</h1>
          <p className="lede" style={{ margin: "18px auto 0", maxWidth: "56ch", color: "var(--muted)" }}>Bring your deal to a private audience of accredited investors — with the tools to publish, track, and convert on your terms.</p>
        </div>

        <section className="band" style={{ borderTop: "none", paddingTop: 20 }}>
          <div className="wrap">
            <div className="grid six">
              {BENEFITS.map((b) => (
                <div className="card" key={b.t} style={{ padding: "26px 24px" }}>
                  <h4 style={{ fontFamily: "var(--serif)", fontWeight: 400, fontSize: 20, margin: "0 0 10px" }}>{b.t}</h4>
                  <p style={{ color: "var(--muted)", fontSize: 14, margin: 0 }}>{b.d}</p>
                </div>
              ))}
            </div>

            <div className="rocket fade d1">
              <span className="eyebrow" style={{ color: "var(--gold-soft)" }}>The Engine</span>
              <h2 style={{ fontSize: "clamp(24px,3vw,34px)", marginTop: 10 }}>Powered by <span style={{ color: "var(--gold-soft)" }}>r0cketship.com</span> technology</h2>
              <p style={{ color: "var(--muted)", maxWidth: "58ch", margin: "14px 0 0", fontSize: 15.5 }}>Every impression, click, and expressed interest is scored by r0cketship.com&rsquo;s high-intent optimization engine — so your offering is shown to the investors most likely to act, and you see exactly where the intent is.</p>
            </div>
          </div>
        </section>

        <section className="band">
          <div className="wrap">
            <div className="sec-head"><div><span className="eyebrow">Apply</span><h2>Become a Sponsor</h2></div></div>
            <div className="form-wrap"><SponsorForm /></div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
