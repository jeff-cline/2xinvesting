import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAuthed } from "@/lib/auth";
import { getKlaviyoConfig, saveKlaviyoConfig, testKlaviyo } from "@/lib/klaviyo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// This God-only route serves two admin panels (kept in one file due to a Next route-registration
// quirk on this host): ?section=klaviyo → Klaviyo config; otherwise → Discovery Tour CC list.

async function readCc(): Promise<string[]> {
  const row = await db.setting.findUnique({ where: { key: "discoveryTourCC" } }).catch(() => null);
  try { const a = row ? JSON.parse(row.value) : []; return Array.isArray(a) ? a : []; } catch { return []; }
}

export async function GET(req: NextRequest) {
  if (!(await isAuthed())) return NextResponse.json({ ok: false }, { status: 401 });
  if (new URL(req.url).searchParams.get("section") === "klaviyo") {
    const c = await getKlaviyoConfig();
    return NextResponse.json({ ok: true, hasKey: !!c.apiKey, listId: c.listId, connected: c.connected });
  }
  return NextResponse.json({ ok: true, emails: await readCc() });
}

export async function POST(req: NextRequest) {
  if (!(await isAuthed())) return NextResponse.json({ ok: false }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  if (body.section === "klaviyo") {
    const cur = await getKlaviyoConfig();
    const key = body.apiKey && String(body.apiKey).trim() ? String(body.apiKey).trim() : cur.apiKey;
    const ok = await testKlaviyo(key);
    await saveKlaviyoConfig(key, String(body.listId ?? cur.listId ?? ""), ok);
    return NextResponse.json({ ok: true, connected: ok, error: ok ? "" : "Klaviyo rejected the key — check it's a Private API Key (pk_…)." });
  }
  const clean = Array.isArray(body.emails) ? body.emails.map((e: string) => String(e).trim().toLowerCase()).filter((e: string) => /.+@.+\..+/.test(e)) : [];
  await db.setting.upsert({ where: { key: "discoveryTourCC" }, update: { value: JSON.stringify(clean) }, create: { key: "discoveryTourCC", value: JSON.stringify(clean) } }).catch(() => {});
  return NextResponse.json({ ok: true, emails: clean });
}
