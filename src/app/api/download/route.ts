import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionMember } from "@/lib/member-auth";
import { notifyFounder, sendTo } from "@/lib/notify";
import { pushLeadToKlaviyo } from "@/lib/klaviyo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Members-only document download. Logs a "download lead" into the owning sponsor/advertiser CRM,
// emails them, pushes to Klaviyo, then serves the document.
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const slug = url.searchParams.get("offer") || "";
  const docLabel = url.searchParams.get("doc") || "";
  const member = await getSessionMember();
  if (!member) return NextResponse.redirect(new URL(`/member/login?next=/offers/${slug}`, req.url));

  const offer = await db.investOffer.findUnique({ where: { slug } }).catch(() => null);
  if (!offer) return NextResponse.redirect(new URL("/", req.url));

  let docUrl = "#";
  try { const pdfs = JSON.parse(offer.pdfs || "[]"); const m = pdfs.find((p: { label: string; url: string }) => p.label === docLabel); if (m) docUrl = m.url; } catch { /* ignore */ }

  if (offer.sponsorId) {
    const dup = await db.investLead.findFirst({ where: { memberId: member.id, offerId: offer.id, kind: "download", sponsorNote: docLabel } }).catch(() => null);
    if (!dup) {
      await db.investLead.create({ data: { name: member.name, email: member.email, phone: member.phone, role: member.role, kind: "download", offerId: offer.id, memberId: member.id, interests: JSON.stringify([`Downloaded: ${docLabel} — ${offer.title}`]), sponsorNote: docLabel, sourcePage: `/offers/${slug}`, source: "download" } }).catch(() => {});
      const owner = await db.investSponsor.findUnique({ where: { id: offer.sponsorId } }).catch(() => null);
      const lines = [`<b>${member.name}</b>`, `Email: ${member.email}`, `Phone: ${member.phone}`, `Downloaded: <b>${docLabel}</b> on <b>${offer.title}</b>`];
      if (owner?.email) sendTo(owner.email, `Download lead: ${docLabel} — ${offer.title}`, `<div style="font-family:Arial,sans-serif;color:#14202e"><h2>New download lead</h2>${lines.map((l) => `<p style="margin:4px 0">${l}</p>`).join("")}</div>`).catch(() => {});
      notifyFounder(`Download lead → ${offer.title} (${docLabel})`, lines).catch(() => {});
      pushLeadToKlaviyo({ name: member.name, email: member.email, phone: member.phone, kind: "download", interest: `${docLabel} — ${offer.title}`, source: "download", sponsor: owner?.business }).catch(() => {});
    }
  }

  // Placeholder docs (url "#") route back to the offer; real uploaded docs redirect to the file.
  if (!docUrl || docUrl === "#") return NextResponse.redirect(new URL(`/offers/${slug}?downloaded=1`, req.url));
  return NextResponse.redirect(docUrl.startsWith("http") ? docUrl : new URL(docUrl, req.url));
}
