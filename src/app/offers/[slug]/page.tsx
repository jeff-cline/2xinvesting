import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Header, Footer } from "@/components/Chrome";
import { getOffer } from "@/lib/offers";
import { db } from "@/lib/db";
import { getSessionMember } from "@/lib/member-auth";
import { recordMemberInterest, recordMemberDownload } from "@/lib/member-lead";

export const dynamic = "force-dynamic";

export default async function OfferPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ dl?: string }> }) {
  const { slug } = await params;
  const { dl } = await searchParams;
  const offer = await getOffer(slug);
  if (!offer) notFound();
  // Record an impression (fire-and-forget).
  db.investOffer.update({ where: { slug }, data: { impressions: { increment: 1 } } }).catch(() => {});
  // Members unlock private docs; a member clicking into a sponsor's opportunity becomes a sponsor lead.
  const member = await getSessionMember();
  const ownerRef = { id: offer.id, slug: offer.slug, title: offer.title, sponsorId: offer.sponsorId };
  if (member) recordMemberInterest({ id: member.id, name: member.name, email: member.email, phone: member.phone, role: member.role }, ownerRef);
  // A member downloading a document → download lead + (if a real file) redirect to it.
  if (member && dl) {
    await recordMemberDownload({ id: member.id, name: member.name, email: member.email, phone: member.phone, role: member.role }, ownerRef, dl);
    const doc = offer.pdfs.find((p) => p.label === dl);
    if (doc && doc.url && doc.url !== "#") redirect(doc.url);
  }
  // Guests hitting a doc link are sent to join.
  if (!member && dl) redirect(`/member/login?next=/offers/${slug}`);

  return (
    <>
      <Header />
      <main>
        <div className="wrap page-head">
          <Link className="back" href="/#offerings">← All offerings</Link>
          <div className="detail-hero fade d1" style={offer.featuredImage ? { backgroundImage: `linear-gradient(120deg, rgba(10,15,12,.50), rgba(10,15,12,.20)), url(${offer.featuredImage})`, backgroundSize: "cover", backgroundPosition: "center" } : { background: "linear-gradient(150deg,#153a2c,#0c1d16 55%,#1a140b)" }}>
            <span className="oglyph">{offer.iconGlyph}</span>
            <div style={{ position: "relative", zIndex: 2 }}>
              <span className="eyebrow">{offer.category}</span>
              <h1 style={{ fontSize: "clamp(32px,4.4vw,52px)", marginTop: 12 }}>{offer.title}</h1>
            </div>
          </div>
        </div>

        <div className="wrap">
          <div className="detail-body">
            <div className="fade d1">
              <p className="lead">{offer.description}</p>
              {offer.gallery.length > 0 && (
                <div className="gallery">
                  {offer.gallery.map((g, i) => (
                    <div className="g" key={i} style={{ backgroundImage: `url(${g})`, backgroundSize: "cover", backgroundPosition: "center" }} />
                  ))}
                </div>
              )}
              {offer.isSample && <p className="form-note" style={{ marginTop: 22 }}>This is a sample offering shown while the platform builds its roster. Sponsor offerings will appear here with full documentation.</p>}
            </div>
            <aside className="aside fade d2">
              <h4>Request the full package</h4>
              <p style={{ color: "var(--muted)", fontSize: 14, margin: "0 0 18px" }}>Register your interest and we&rsquo;ll send the documents and connect you with the principals.</p>
              <div className="actions" style={{ flexDirection: "column", gap: 10 }}>
                <Link className="btn solid" href={`/invest?offer=${offer.slug}`} style={{ justifyContent: "center" }}>Register Interest</Link>
              </div>
              {offer.pdfs.length > 0 && (
                <>
                  <div style={{ height: 1, background: "var(--line-soft)", margin: "22px 0" }} />
                  <div className="text" style={{ fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 12 }}>Documents</div>
                  {member ? (
                    <div className="docs" style={{ flexDirection: "column" }}>
                      {offer.pdfs.map((p) => (
                        <a className="doc" key={p.label} href={`/offers/${offer.slug}?dl=${encodeURIComponent(p.label)}`}><svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth={1.6}><path d="M14 3v5h5M7 3h8l5 5v13H7z" /></svg>{p.label}</a>
                      ))}
                    </div>
                  ) : (
                    <div className="locked-docs">
                      <div className="locked-list">
                        {offer.pdfs.map((p) => (<div className="doc locked" key={p.label}><span className="lock">🔒</span>{p.label}</div>))}
                      </div>
                      <Link className="btn-teal" href={`/member/login?next=/offers/${offer.slug}`} style={{ width: "100%", justifyContent: "center", marginTop: 12 }}>Become a member to unlock</Link>
                    </div>
                  )}
                </>
              )}
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
