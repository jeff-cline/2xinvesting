import { NextRequest, NextResponse } from "next/server";
import { checkLogin, createSession, getGod } from "@/lib/auth";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function POST(req: NextRequest) {
  const { email, password } = await req.json().catch(() => ({}));
  if (!(await checkLogin(String(email || ""), String(password || "")))) return NextResponse.json({ ok: false, error: "Invalid email or password." }, { status: 401 });
  await createSession();
  const g = await getGod();
  return NextResponse.json({ ok: true, mustReset: g.mustReset });
}
