import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAuthed } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function read(): Promise<string[]> {
  const row = await db.setting.findUnique({ where: { key: "discoveryTourCC" } }).catch(() => null);
  try { const a = row ? JSON.parse(row.value) : []; return Array.isArray(a) ? a : []; } catch { return []; }
}

export async function GET() {
  if (!(await isAuthed())) return NextResponse.json({ ok: false }, { status: 401 });
  return NextResponse.json({ ok: true, emails: await read() });
}

export async function POST(req: NextRequest) {
  if (!(await isAuthed())) return NextResponse.json({ ok: false }, { status: 401 });
  const { emails } = await req.json().catch(() => ({}));
  const clean = Array.isArray(emails) ? emails.map((e) => String(e).trim().toLowerCase()).filter((e) => /.+@.+\..+/.test(e)) : [];
  await db.setting.upsert({ where: { key: "discoveryTourCC" }, update: { value: JSON.stringify(clean) }, create: { key: "discoveryTourCC", value: JSON.stringify(clean) } }).catch(() => {});
  return NextResponse.json({ ok: true, emails: clean });
}
