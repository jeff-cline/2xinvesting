import { NextRequest, NextResponse } from "next/server";
import { checkSponsorLogin, createSponsorSession } from "@/lib/sponsor-auth";
export const runtime = "nodejs"; export const dynamic = "force-dynamic";
export async function POST(req: NextRequest) {
  const { email, password } = await req.json().catch(() => ({}));
  const s = await checkSponsorLogin(String(email || ""), String(password || ""));
  if (!s) return NextResponse.json({ ok: false, error: "Invalid email or password (accounts must be approved)." }, { status: 401 });
  await createSponsorSession(s.id);
  return NextResponse.json({ ok: true, mustReset: s.mustReset });
}
