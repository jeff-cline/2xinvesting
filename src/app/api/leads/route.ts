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
  role: z.enum(["accredited", "fund_manager", "jv", "private"]).default("accredited"),
  offer: z.string().optional(),
});

const ROLE_LABEL: Record<string, string> = { accredited: "Accredited Investor", fund_manager: "Fund Manager", jv: "Joint Venture", private: "Private Investor" };

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

  await db.investLead.create({
    data: { name: d.name, phone: d.phone, email: d.email, business: d.business, role: d.role, offerId: offerId || null, interests: d.offer ? JSON.stringify([d.offer]) : "[]", source: "intake" },
  }).catch(() => {});

  await notifyFounder("New 2X Investor signup", [
    `<b>${d.name}</b> — ${ROLE_LABEL[d.role]}`,
    `Phone: ${d.phone}`,
    `Email: ${d.email}`,
    d.business ? `Business: ${d.business}` : "",
    offerTitle ? `Interested in: <b>${offerTitle}</b>` : "Interested in: (browsing)",
  ].filter(Boolean));

  return NextResponse.json({ ok: true });
}
