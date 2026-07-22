import { NextRequest, NextResponse } from "next/server";
import { isAuthed, setGodPassword } from "@/lib/auth";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function POST(req: NextRequest) {
  if (!(await isAuthed())) return NextResponse.json({ ok: false, error: "Not signed in." }, { status: 401 });
  const { password } = await req.json().catch(() => ({}));
  if (!password || String(password).length < 8) return NextResponse.json({ ok: false, error: "Password must be at least 8 characters." }, { status: 400 });
  await setGodPassword(String(password));
  return NextResponse.json({ ok: true });
}
