import { Header, Footer } from "@/components/Chrome";
import IntakeForm from "@/components/IntakeForm";

export const dynamic = "force-dynamic";

export default async function InvestPage({ searchParams }: { searchParams: Promise<{ offer?: string; kind?: string }> }) {
  const { offer, kind } = await searchParams;
  return (
    <>
      <Header />
      <main>
        <div className="wrap page-head" style={{ textAlign: "center" }}>
          <span className="eyebrow">For Investors</span>
          <h1 style={{ fontSize: "clamp(32px,4.4vw,50px)", marginTop: 14 }}>Become an Investor</h1>
          <p className="lede" style={{ margin: "16px auto 0", maxWidth: "52ch", color: "var(--muted)" }}>Tell us who you are and what you&rsquo;re drawn to. We&rsquo;ll bring you the matching offerings — and notify you the moment a new one opens.</p>
        </div>
        <div className="wrap"><div className="form-wrap"><IntakeForm offer={offer} kind={kind} /></div></div>
      </main>
      <Footer />
    </>
  );
}
