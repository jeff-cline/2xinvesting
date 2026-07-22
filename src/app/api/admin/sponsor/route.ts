import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { isAuthed } from "@/lib/auth";
import { createSponsorSession } from "@/lib/sponsor-auth";
import { sendTo } from "@/lib/notify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BASE = "https://2xinvesting.com";

export async function POST(req: NextRequest) {
  if (!(await isAuthed())) return NextResponse.json({ ok: false }, { status: 401 });
  const { action, sponsorId, offerSlug } = await req.json().catch(() => ({}));
  const s = await db.investSponsor.findUnique({ where: { id: String(sponsorId || "") } }).catch(() => null);
  if (!s) return NextResponse.json({ ok: false, error: "Sponsor not found." }, { status: 404 });

  if (action === "activate") {
    await db.investSponsor.update({ where: { id: s.id }, data: { status: "active", passwordHash: bcrypt.hashSync("TEMP!234", 10), mustReset: true } }).catch(() => {});
    await sendTo(s.email, "Your 2X Investing sponsor account is live", `<div style="font-family:Arial,sans-serif;color:#14202e"><h2>Welcome to 2X Investing</h2><p>Your sponsor account is approved. Sign in to your portal:</p><p><b>Login:</b> ${BASE}/sponsor/login<br/><b>Email:</b> ${s.email}<br/><b>Temporary password:</b> TEMP!234</p><p>You'll be asked to set a new password on first login.</p></div>`);
    return NextResponse.json({ ok: true, message: `Activated. Temp password TEMP!234 emailed to ${s.email}.` });
  }
  if (action === "assign") {
    const o = await db.investOffer.findUnique({ where: { slug: String(offerSlug || "") } }).catch(() => null);
    if (!o) return NextResponse.json({ ok: false, error: "Offer not found." }, { status: 404 });
    await db.investOffer.update({ where: { id: o.id }, data: { sponsorId: s.id } }).catch(() => {});
    return NextResponse.json({ ok: true, message: `Assigned "${o.title}" to ${s.business || s.name}.` });
  }
  if (action === "impersonate") {
    if (s.status !== "active") return NextResponse.json({ ok: false, error: "Activate the sponsor first." }, { status: 400 });
    await createSponsorSession(s.id, true);
    return NextResponse.json({ ok: true, redirect: "/portal" });
  }
  return NextResponse.json({ ok: false, error: "Unknown action." }, { status: 400 });
}
