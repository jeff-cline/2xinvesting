import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionSponsor } from "@/lib/sponsor-auth";
export const runtime = "nodejs"; export const dynamic = "force-dynamic";
export async function POST(req: NextRequest) {
  const s = await getSessionSponsor();
  if (!s) return NextResponse.json({ ok: false }, { status: 401 });
  const { leadId, note } = await req.json().catch(() => ({}));
  // Only allow notes on leads tied to an offer this sponsor owns.
  const myOffers = await db.investOffer.findMany({ where: { sponsorId: s.id }, select: { id: true } });
  const ids = new Set(myOffers.map((o) => o.id));
  const lead = await db.investLead.findUnique({ where: { id: String(leadId || "") } }).catch(() => null);
  if (!lead || !lead.offerId || !ids.has(lead.offerId)) return NextResponse.json({ ok: false, error: "Not your lead." }, { status: 403 });
  await db.investLead.update({ where: { id: lead.id }, data: { sponsorNote: String(note || "").slice(0, 2000) } }).catch(() => {});
  return NextResponse.json({ ok: true });
}
