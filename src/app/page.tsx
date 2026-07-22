import Link from "next/link";
import { Header, Footer } from "@/components/Chrome";
import { getHomeOffers, type Offer } from "@/lib/offers";

export const dynamic = "force-dynamic";

function OfferCard({ o, trending }: { o: Offer; trending?: boolean }) {
  return (
    <Link className="card fade d1" href={`/offers/${o.slug}`}>
      <div className={`cov ${o.featuredImage ? "has-img" : o.coverClass}`} style={o.featuredImage ? { backgroundImage: `linear-gradient(155deg, rgba(10,15,12,.10), rgba(10,15,12,.40)), url(${o.featuredImage})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}>
        {trending && (
          <span className="trend">
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth={2}><path d="M3 17l6-6 4 4 8-8" /></svg>Trending
          </span>
        )}
        {!o.featuredImage && <span className="oglyph">{o.iconGlyph}</span>}
      </div>
      <div className="in">
        <span className="cat">{o.category}</span>
        <h4>{o.title}</h4>
        <p>{o.blurb}</p>
        <div className="foot"><span>{o.isSample ? "Sample" : "Offering"}</span><span className="view">View →</span></div>
      </div>
    </Link>
  );
}

export default async function Home() {
  const { featured, alsoView, trending, pocket } = await getHomeOffers();
  return (
    <>
      <Header />
      <main>
        <section className="hero">
          <div className="wrap hero-grid">
            <div className="fade d1">
              <span className="eyebrow">Lifestyle Investing · By Invitation</span>
              <h1 style={{ marginTop: 18 }}>Invest in the <em>life</em> you actually want.</h1>
              <p className="lede">A curated house of alternative offerings — casks, land, reserves, and ventures — assembled for investors who measure returns in more than a number.</p>
              <div className="cta-row">
                <Link className="btn solid" href="/#offerings">Explore Offerings</Link>
                <Link className="btn ghost" href="/invest">Become an Investor</Link>
              </div>
              <div className="assur"><span>Vetted Sponsors</span><span>Accredited Access</span><span>Direct to Principals</span></div>
            </div>
            <div className="film fade d2">
              <span className="tag">Featured Film</span>
              <iframe src="https://www.youtube.com/embed/1eAo8NvpnB0?rel=0&modestbranding=1" title="Lifestyle Investing — The 2X Thesis" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            </div>
          </div>
        </section>

        {featured && (
          <section className="band" id="featured">
            <div className="wrap">
              <div className="sec-head">
                <div><span className="eyebrow">Featured This Cycle</span><h2>Offering in the spotlight</h2></div>
                <Link className="more" href="/#offerings">View all offerings →</Link>
              </div>
              <div className="feature fade d1">
                <div className="cover" style={featured.featuredImage ? { backgroundImage: `linear-gradient(150deg, rgba(10,15,12,.16), rgba(10,15,12,.46)), url(${featured.featuredImage})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}>
                  <span className="pin">Featured</span>
                  {!featured.featuredImage && <span className="oglyph">{featured.iconGlyph}</span>}
                </div>
                <div className="body">
                  <div className="kicker">{featured.category}</div>
                  <h3>{featured.title}</h3>
                  <p>{featured.description}</p>
                  <div className="docs">
                    {featured.pdfs.map((p) => (
                      <a className="doc" key={p.label} href={p.url}><svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth={1.6}><path d="M14 3v5h5M7 3h8l5 5v13H7z" /></svg>{p.label}</a>
                    ))}
                  </div>
                  <div className="actions">
                    <Link className="btn solid" href={`/offers/${featured.slug}`}>View Offering</Link>
                    <Link className="btn ghost" href="/invest">Register Interest</Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="band" id="offerings">
          <div className="wrap">
            <div className="sec-head">
              <div><span className="eyebrow">The Portfolio</span><h2>People also view</h2></div>
              <Link className="more" href="/invest">Browse the house →</Link>
            </div>
            <div className="grid six">
              {alsoView.map((o) => <OfferCard key={o.slug} o={o} />)}
            </div>
          </div>
        </section>

        {trending.length > 0 && (
          <section className="band">
            <div className="wrap">
              <div className="sec-head"><div><span className="eyebrow">Momentum</span><h2>Trending now</h2></div></div>
              <div className="grid three">
                {trending.map((o) => <OfferCard key={o.slug} o={o} trending />)}
              </div>
            </div>
          </section>
        )}

        <section className="band" id="investor">
          <div className="wrap">
            <div className="investor fade d1">
              <div>
                <span className="eyebrow">For Investors</span>
                <h2 style={{ marginTop: 12 }}>See every offering. Set your interests. We bring you the matches.</h2>
                <p>Tell us who you are and what you&rsquo;re drawn to. Come back as often as you like, refine your interests, and we&rsquo;ll notify you the moment a fitting offering opens.</p>
                <div className="roles"><span>Accredited Investor</span><span>Fund Manager</span><span>Joint Venture</span><span>Private Investor</span></div>
              </div>
              <div className="panel">
                <Link className="btn solid" href="/invest" style={{ justifyContent: "center", padding: 15 }}>Become an Investor</Link>
                <Link className="btn ghost" href="/#offerings" style={{ justifyContent: "center", padding: 15 }}>Browse All Offerings</Link>
                <p style={{ color: "var(--muted)", fontSize: 12.5, margin: "6px 0 0", textAlign: "center" }}>Free · takes two minutes · no obligation</p>
              </div>
            </div>
          </div>
        </section>

        {pocket.length > 0 && (
          <section className="band" id="pocket">
            <div className="wrap">
              <div className="sec-head">
                <div><span className="eyebrow">Members Only · At a Discount</span><h2>Pocket Offerings</h2></div>
                <span className="crm-sub" style={{ maxWidth: "34ch", textAlign: "right" }}>Premium strategies unlocked for 2X members.</span>
              </div>
              <div className="pockets">
                {pocket.map((o) => (
                  <div className="pocket-row fade d1" key={o.slug}>
                    <div className="pocket-cover" style={o.featuredImage ? { backgroundImage: `linear-gradient(120deg, rgba(10,15,12,.34), rgba(10,15,12,.62)), url(${o.featuredImage})` } : undefined}>
                      <span className="oglyph">{o.iconGlyph}</span>
                    </div>
                    <div className="pocket-body">
                      <span className="member-badge">Member Benefit · Discounted</span>
                      <h3>{o.title}</h3>
                      <p>{o.description}</p>
                      <Link className="btn solid" href={`/invest?offer=${o.slug}&kind=pocket`}>Request as a Member</Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Need a Geek ad */}
        <section className="band">
          <div className="wrap">
            <div className="geek-ad fade d1">
              <div>
                <span className="eyebrow" style={{ color: "#e6cf96" }}>An Aside</span>
                <h2 style={{ fontSize: "clamp(26px,3.4vw,40px)", marginTop: 10 }}>Need a Geek?</h2>
                <p style={{ color: "var(--muted)", margin: "14px 0 0", maxWidth: "48ch" }}>Every industry is a <em style={{ color: "var(--gold-soft)", fontStyle: "italic" }}>geek</em> way from being Uber‑ized.</p>
              </div>
              <Link className="btn solid" href="/geek" style={{ padding: "15px 26px" }}>Contact Jeff Cline</Link>
            </div>
          </div>
        </section>

        <section className="band" id="sponsor">
          <div className="wrap">
            <div className="sec-head">
              <div><span className="eyebrow">For Sponsors</span><h2>List your offering to a qualified audience</h2></div>
              <Link className="btn solid" href="/sponsor">Become a Sponsor</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
