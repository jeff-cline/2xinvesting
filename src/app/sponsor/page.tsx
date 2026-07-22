import { Header, Footer } from "@/components/Chrome";
import SponsorForm from "@/components/SponsorForm";

export const dynamic = "force-dynamic";

export default function SponsorPage() {
  return (
    <>
      <Header />
      <main>
        <div className="wrap page-head" style={{ textAlign: "center" }}>
          <span className="eyebrow">For Sponsors</span>
          <h1 style={{ fontSize: "clamp(32px,4.4vw,50px)", marginTop: 14 }}>Become a Sponsor</h1>
          <p className="lede" style={{ margin: "16px auto 0", maxWidth: "56ch", color: "var(--muted)" }}>List your offering to a private audience of accredited investors. Build a landing page with your film, gallery, and documents — then track impressions, high-intent matches, and expressed interest, with your CRM synced to Zoho, GoHighLevel, or Salesforce.</p>
        </div>
        <div className="wrap"><div className="form-wrap"><SponsorForm /></div></div>
      </main>
      <Footer />
    </>
  );
}
