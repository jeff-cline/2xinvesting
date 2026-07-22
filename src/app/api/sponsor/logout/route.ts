import { NextResponse } from "next/server";
import { clearSponsorSession } from "@/lib/sponsor-auth";
export const runtime = "nodejs"; export const dynamic = "force-dynamic";
export async function POST() { await clearSponsorSession(); return NextResponse.json({ ok: true }); }
