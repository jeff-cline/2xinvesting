import { Header, Footer } from "@/components/Chrome";
import GeekForm from "@/components/GeekForm";
export const dynamic = "force-dynamic";
export default function GeekPage() {
  return (
    <>
      <Header />
      <main>
        <div className="wrap page-head" style={{ textAlign: "center" }}>
          <span className="eyebrow">An Aside</span>
          <h1 style={{ fontSize: "clamp(32px,4.4vw,50px)", marginTop: 14 }}>Need a Geek?</h1>
          <p className="lede" style={{ margin: "16px auto 0", maxWidth: "52ch", color: "var(--muted)" }}>Every industry is a <em style={{ color: "var(--gold-soft)", fontStyle: "italic" }}>geek</em> way from being Uber‑ized. If you want in early, tell us what you&rsquo;re building — Jeff Cline will reach out.</p>
        </div>
        <div className="wrap"><div className="form-wrap"><GeekForm /></div></div>
      </main>
      <Footer />
    </>
  );
}
