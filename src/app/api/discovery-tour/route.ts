import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { notifyFounder, getDiscoveryTourCc } from "@/lib/notify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  name: z.string().min(1),
  phone: z.string().min(3),
  email: z.string().email(),
  business: z.string().optional().default(""),
  role: z.enum(["accredited", "fund_manager", "jv", "private"]).optional().default("accredited"),
  dates: z.string().optional().default(""),
  notes: z.string().optional().default(""),
});
const ROLE: Record<string, string> = { accredited: "Accredited Investor", fund_manager: "Fund Manager", jv: "Joint Venture", private: "Private Investor" };

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ ok: false, error: parsed.error.issues[0]?.message || "Invalid input." }, { status: 400 });
  const d = parsed.data;

  await db.investLead.create({
    data: { name: d.name, phone: d.phone, email: d.email, business: d.business, role: d.role, kind: "discovery-tour", sourcePage: "/investor-discovery-tour", interests: JSON.stringify([d.dates, d.notes].filter(Boolean)), source: "discovery-tour" },
  }).catch(() => {});

  const cc = await getDiscoveryTourCc();
  await notifyFounder("New Investor Discovery Tour request", [
    `<b>${d.name}</b> — ${ROLE[d.role]}`,
    `Phone: ${d.phone}`,
    `Email: ${d.email}`,
    d.business ? `Business: ${d.business}` : "",
    d.dates ? `Requested dates: <b>${d.dates}</b>` : "",
    d.notes ? `Notes: ${d.notes}` : "",
  ].filter(Boolean), cc);

  return NextResponse.json({ ok: true });
}
