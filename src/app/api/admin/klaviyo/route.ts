import { NextRequest, NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import { getKlaviyoConfig, saveKlaviyoConfig, testKlaviyo } from "@/lib/klaviyo";
export const runtime = "nodejs"; export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAuthed())) return NextResponse.json({ ok: false }, { status: 401 });
  const c = await getKlaviyoConfig();
  return NextResponse.json({ ok: true, hasKey: !!c.apiKey, listId: c.listId, connected: c.connected });
}
export async function POST(req: NextRequest) {
  if (!(await isAuthed())) return NextResponse.json({ ok: false }, { status: 401 });
  const { apiKey, listId } = await req.json().catch(() => ({}));
  const cur = await getKlaviyoConfig();
  const key = apiKey && String(apiKey).trim() ? String(apiKey).trim() : cur.apiKey; // keep existing if blank
  const ok = await testKlaviyo(key);
  await saveKlaviyoConfig(key, String(listId || cur.listId || ""), ok);
  return NextResponse.json({ ok: true, connected: ok, error: ok ? "" : "Klaviyo rejected the key — check it's a Private API Key (pk_…)." });
}
