import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { notifyFounder } from "@/lib/notify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(3),
  business: z.string().min(1),
  offerPitch: z.string().optional().default(""),
});

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ ok: false, error: parsed.error.issues[0]?.message || "Invalid input." }, { status: 400 });
  const d = parsed.data;

  await db.investSponsor.upsert({
    where: { email: d.email },
    update: { name: d.name, phone: d.phone, business: d.business, offerPitch: d.offerPitch },
    create: { name: d.name, email: d.email, phone: d.phone, business: d.business, offerPitch: d.offerPitch, status: "pending", mustReset: true },
  }).catch(() => {});

  await notifyFounder("New 2X Sponsor application", [
    `<b>${d.name}</b> — ${d.business}`,
    `Phone: ${d.phone}`,
    `Email: ${d.email}`,
    d.offerPitch ? `Offering: ${d.offerPitch}` : "",
  ].filter(Boolean));

  return NextResponse.json({ ok: true });
}
