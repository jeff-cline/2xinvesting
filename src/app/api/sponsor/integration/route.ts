import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionSponsor } from "@/lib/sponsor-auth";
export const runtime = "nodejs"; export const dynamic = "force-dynamic";
export async function POST(req: NextRequest) {
  const s = await getSessionSponsor();
  if (!s) return NextResponse.json({ ok: false }, { status: 401 });
  const { crmType, crmApiKey, crmEndpoint } = await req.json().catch(() => ({}));
  const type = ["zoho", "gohighlevel", "salesforce"].includes(String(crmType)) ? String(crmType) : "";
  await db.investSponsor.update({ where: { id: s.id }, data: { crmType: type, crmApiKey: String(crmApiKey || ""), crmEndpoint: String(crmEndpoint || ""), crmConnected: !!(type && (crmApiKey || crmEndpoint)) } }).catch(() => {});
  return NextResponse.json({ ok: true });
}
