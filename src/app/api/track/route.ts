import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Logs a visitor action and maintains a long-lived visitor id cookie for click-path tracking.
export async function POST(req: NextRequest) {
  const { type, page, offerSlug } = await req.json().catch(() => ({}));
  const jar = await cookies();
  let vid = jar.get("twox_vid")?.value;
  if (!vid) {
    vid = crypto.randomBytes(12).toString("hex");
    jar.set("twox_vid", vid, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 31536000 });
  }
  await db.investEvent.create({ data: { visitorId: vid, type: String(type || "pageview").slice(0, 20), page: String(page || "").slice(0, 200), offerSlug: String(offerSlug || "").slice(0, 80) } }).catch(() => {});
  return NextResponse.json({ ok: true });
}
