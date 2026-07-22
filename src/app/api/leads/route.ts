import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { notifyFounder } from "@/lib/notify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  name: z.string().min(1),
  phone: z.string().min(3),
  email: z.string().email(),
  business: z.string().optional().default(""),
  role: z.enum(["accredited", "fund_manager", "jv", "private"]).optional().default("accredited"),
  offer: z.string().optional(),
  kind: z.enum(["investor", "pocket", "geek"]).optional().default("investor"),
  sourcePage: z.string().optional().default(""),
  message: z.string().optional().default(""),
});

const ROLE_LABEL: Record<string, string> = { accredited: "Accredited Investor", fund_manager: "Fund Manager", jv: "Joint Venture", private: "Private Investor" };
const KIND_SUBJECT: Record<string, string> = { investor: "New 2X Investor signup", pocket: "New 2X Pocket Offering request", geek: "New 'Need a Geek' inquiry" };

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ ok: false, error: parsed.error.issues[0]?.message || "Invalid input." }, { status: 400 });
  const d = parsed.data;

  let offerId: string | undefined;
  let offerTitle = "";
  if (d.offer) {
    const o = await db.investOffer.findUnique({ where: { slug: d.offer } }).catch(() => null);
    if (o) { offerId = o.id; offerTitle = o.title; db.investOffer.update({ where: { id: o.id }, data: { clicks: { increment: 1 } } }).catch(() => {}); }
  }
  const interests = d.message ? [d.message] : d.offer ? [d.offer] : [];

  await db.investLead.create({
    data: { name: d.name, phone: d.phone, email: d.email, business: d.business, role: d.role, kind: d.kind, sourcePage: d.sourcePage, offerId: offerId || null, interests: JSON.stringify(interests), source: d.kind },
  }).catch(() => {});

  await notifyFounder(KIND_SUBJECT[d.kind] || KIND_SUBJECT.investor, [
    `<b>${d.name}</b>${d.kind === "investor" ? ` — ${ROLE_LABEL[d.role]}` : ""}`,
    `Phone: ${d.phone}`,
    `Email: ${d.email}`,
    d.business ? `Business: ${d.business}` : "",
    offerTitle ? `Interested in: <b>${offerTitle}</b>` : "",
    d.message ? `Message: ${d.message}` : "",
    d.sourcePage ? `Signed up on: ${d.sourcePage}` : "",
  ].filter(Boolean));

  return NextResponse.json({ ok: true });
}
