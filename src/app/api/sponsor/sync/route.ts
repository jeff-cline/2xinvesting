import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionSponsor } from "@/lib/sponsor-auth";
export const runtime = "nodejs"; export const dynamic = "force-dynamic";
// Push this sponsor's leads to their configured CRM. Webhook/endpoint style works for GoHighLevel
// and any generic webhook; Zoho/Salesforce OAuth flows are stubbed for a follow-up.
export async function POST() {
  const s = await getSessionSponsor();
  if (!s) return NextResponse.json({ ok: false }, { status: 401 });
  if (!s.crmConnected || !s.crmEndpoint) return NextResponse.json({ ok: false, error: "Connect a CRM with a webhook/endpoint first." }, { status: 400 });
  const myOffers = await db.investOffer.findMany({ where: { sponsorId: s.id }, select: { id: true } });
  const ids = myOffers.map((o) => o.id);
  const leads = await db.investLead.findMany({ where: { offerId: { in: ids } }, take: 200 });
  let pushed = 0;
  for (const l of leads) {
    const ok = await fetch(s.crmEndpoint, {
      method: "POST", headers: { "Content-Type": "application/json", ...(s.crmApiKey ? { Authorization: `Bearer ${s.crmApiKey}` } : {}) },
      body: JSON.stringify({ name: l.name, email: l.email, phone: l.phone, company: l.business, source: "2X Investing", note: l.sponsorNote }),
      signal: AbortSignal.timeout(12000),
    }).then((r) => r.ok).catch(() => false);
    if (ok) pushed++;
  }
  return NextResponse.json({ ok: true, pushed, total: leads.length });
}
