import Link from "next/link";

export function Header() {
  return (
    <header>
      <div className="wrap nav">
        <Link className="brand" href="/">
          <span className="mark"><b>2X</b> Investing</span>
          <span className="sub">Lifestyle Investing</span>
        </Link>
        <ul>
          <li><Link href="/#offerings">Offerings</Link></li>
          <li><Link href="/offtake-agreements">Off‑Take</Link></li>
          <li><Link href="/exit-optimization">Exit Opt</Link></li>
          <li><Link href="/invest">For Investors</Link></li>
          <li><Link href="/sponsor">For Sponsors</Link></li>
        </ul>
        <Link className="btn-teal" href="/investor-discovery-tour">★ Free Discovery Tour</Link>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <Link className="brand" href="/"><span className="mark"><b>2X</b> Investing</span></Link>
            <p className="mission">A boutique house for lifestyle investing — curating alternative offerings for investors who want their capital to build a life, not just a balance.</p>
          </div>
          <div className="foot-col">
            <h5>Get Involved</h5>
            <Link className="foot-cta" href="/sponsor"><b>Become a Sponsor →</b><small>List and manage your offering</small></Link>
            <Link className="foot-cta" href="/invest"><b>Become an Investor →</b><small>Set your interests, see every deal</small></Link>
          </div>
          <div className="foot-col">
            <h5>Explore</h5>
            <Link href="/#offerings">All Offerings</Link>
            <Link href="/#featured">Featured</Link>
            <Link href="/offtake-agreements">Off‑Take Agreements</Link>
            <Link href="/exit-optimization">Exit Optimization</Link>
            <Link href="/invest">For Investors</Link>
            <Link href="/sponsor">For Sponsors</Link>
            <Link href="/sponsor/login">Sponsor Login</Link>
          </div>
        </div>
        <div className="legal">
          <span>© 2026 2X Investing · Lifestyle Investing</span>
          <span>Offerings are private placements available to qualified investors only.</span>
        </div>
      </div>
    </footer>
  );
}
