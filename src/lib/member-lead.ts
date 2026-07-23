import { db } from "@/lib/db";
import { notifyFounder, sendTo } from "@/lib/notify";
import { pushLeadToKlaviyo } from "@/lib/klaviyo";

const ROLE: Record<string, string> = { accredited: "Accredited Investor", fund_manager: "Fund Manager", jv: "Joint Venture", private: "Private Investor" };

type Member = { id: string; name: string; email: string; phone: string; role: string };
type Offer = { id: string; slug: string; title: string; sponsorId: string | null };

// When a logged-in member clicks into a sponsor's opportunity, register a lead in that sponsor's CRM
// (deduped per member+offer) and email the sponsor + founder. Fire-and-forget; never throws.
export async function recordMemberInterest(member: Member, offer: Offer) {
  try {
    if (!offer.sponsorId) return;
    const exists = await db.investLead.findFirst({ where: { memberId: member.id, offerId: offer.id } });
    if (exists) return;
    await db.investLead.create({
      data: { name: member.name, email: member.email, phone: member.phone, role: member.role, kind: "member-interest", offerId: offer.id, memberId: member.id, interests: JSON.stringify([offer.slug]), sourcePage: `/offers/${offer.slug}`, source: "member-interest" },
    });
    db.investOffer.update({ where: { id: offer.id }, data: { clicks: { increment: 1 } } }).catch(() => {});
    const lines = [`<b>${member.name}</b> — ${ROLE[member.role] || member.role}`, `Email: ${member.email}`, `Phone: ${member.phone}`, `Clicked into: <b>${offer.title}</b>`];
    const sponsor = await db.investSponsor.findUnique({ where: { id: offer.sponsorId } }).catch(() => null);
    pushLeadToKlaviyo({ name: member.name, email: member.email, phone: member.phone, kind: "member-interest", interest: offer.title, source: "member-interest", sponsor: sponsor?.business }).catch(() => {});
    if (sponsor?.email) {
      const html = `<div style="font-family:Arial,sans-serif;color:#14202e"><h2 style="margin:0 0 10px">New lead on &ldquo;${offer.title}&rdquo;</h2>${lines.map((l) => `<p style="margin:4px 0">${l}</p>`).join("")}<p style="color:#8b9a8f;font-size:12px;margin-top:16px">Sign in to your 2X sponsor portal to see and note this lead.</p></div>`;
      sendTo(sponsor.email, `New lead on "${offer.title}" — 2X Investing`, html).catch(() => {});
    }
    notifyFounder(`Member lead → sponsor: ${offer.title}`, lines).catch(() => {});
  } catch { /* never block the page render */ }
}

// A member downloading a document → a "download lead" in the owner's CRM + email + Klaviyo. Deduped per member+offer+doc.
export async function recordMemberDownload(member: Member, offer: Offer, docLabel: string) {
  try {
    if (!offer.sponsorId) return;
    const dup = await db.investLead.findFirst({ where: { memberId: member.id, offerId: offer.id, kind: "download", sponsorNote: docLabel } });
    if (dup) return;
    await db.investLead.create({ data: { name: member.name, email: member.email, phone: member.phone, role: member.role, kind: "download", offerId: offer.id, memberId: member.id, interests: JSON.stringify([`Downloaded: ${docLabel} — ${offer.title}`]), sponsorNote: docLabel, sourcePage: `/offers/${offer.slug}`, source: "download" } });
    const owner = await db.investSponsor.findUnique({ where: { id: offer.sponsorId } }).catch(() => null);
    const lines = [`<b>${member.name}</b>`, `Email: ${member.email}`, `Phone: ${member.phone}`, `Downloaded: <b>${docLabel}</b> on <b>${offer.title}</b>`];
    if (owner?.email) sendTo(owner.email, `Download lead: ${docLabel} — ${offer.title}`, `<div style="font-family:Arial,sans-serif;color:#14202e"><h2>New download lead</h2>${lines.map((l) => `<p style="margin:4px 0">${l}</p>`).join("")}</div>`).catch(() => {});
    notifyFounder(`Download lead → ${offer.title} (${docLabel})`, lines).catch(() => {});
    pushLeadToKlaviyo({ name: member.name, email: member.email, phone: member.phone, kind: "download", interest: `${docLabel} — ${offer.title}`, source: "download", sponsor: owner?.business }).catch(() => {});
  } catch { /* never block */ }
}
