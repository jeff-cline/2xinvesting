import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { registerMember, createMemberSession } from "@/lib/member-auth";
import { notifyFounder } from "@/lib/notify";
import { pushLeadToKlaviyo } from "@/lib/klaviyo";
export const runtime = "nodejs"; export const dynamic = "force-dynamic";
const schema = z.object({ name: z.string().min(1), email: z.string().email(), phone: z.string().min(3), password: z.string().min(8), role: z.enum(["accredited", "fund_manager", "jv", "private"]).optional().default("private") });
export async function POST(req: NextRequest) {
  const p = schema.safeParse(await req.json().catch(() => ({})));
  if (!p.success) return NextResponse.json({ ok: false, error: p.error.issues[0]?.message || "Invalid input." }, { status: 400 });
  const r = await registerMember(p.data.name, p.data.email, p.data.phone, p.data.password, p.data.role);
  if (r.error || !r.member) return NextResponse.json({ ok: false, error: r.error }, { status: 400 });
  await createMemberSession(r.member.id);
  notifyFounder("New 2X Member registered", [`<b>${p.data.name}</b>`, `Email: ${p.data.email}`, `Phone: ${p.data.phone}`, `Type: ${p.data.role}`]).catch(() => {});
  // Membership is the opt-in moment — hand the profile to Klaviyo to start the welcome sequence.
  pushLeadToKlaviyo({ name: p.data.name, email: p.data.email, phone: p.data.phone, kind: "member-signup", interest: "New member", source: "membership" }).catch(() => {});
  return NextResponse.json({ ok: true });
}
