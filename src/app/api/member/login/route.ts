import { NextRequest, NextResponse } from "next/server";
import { checkMemberLogin, createMemberSession } from "@/lib/member-auth";
export const runtime = "nodejs"; export const dynamic = "force-dynamic";
export async function POST(req: NextRequest) {
  const { email, password } = await req.json().catch(() => ({}));
  const m = await checkMemberLogin(String(email || ""), String(password || ""));
  if (!m) return NextResponse.json({ ok: false, error: "Invalid email or password." }, { status: 401 });
  await createMemberSession(m.id);
  return NextResponse.json({ ok: true });
}
