import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { notifyFounder } from "@/lib/notify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CFG: Record<string, { subject: string; cc: string[]; redirect: string; label: string }> = {
  offtake: { subject: "New Off-Take Agreements (NAEOA) info request", cc: ["david@hpftc.com"], redirect: "https://northamericanenergyofftakeassociation.com/", label: "Off-Take Agreements (NAEOA)" },
  "exit-optimization": { subject: "New Exit Optimization info request", cc: [], redirect: "https://exitoptimization.com/", label: "Exit Optimization" },
};

const schema = z.object({
  kind: z.enum(["offtake", "exit-optimization"]),
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(3),
  company: z.string().optional().default(""),
  role: z.string().optional().default(""),
  details: z.string().optional().default(""),
});

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ ok: false, error: parsed.error.issues[0]?.message || "Invalid input." }, { status: 400 });
  const d = parsed.data;
  const cfg = CFG[d.kind];

  await db.investLead.create({
    data: { name: d.name, email: d.email, phone: d.phone, business: d.company, role: "private", kind: d.kind, sourcePage: `/${d.kind === "offtake" ? "offtake-agreements" : "exit-optimization"}`, interests: JSON.stringify([d.role, d.details].filter(Boolean)), source: d.kind },
  }).catch(() => {});

  await notifyFounder(cfg.subject, [
    `<b>${d.name}</b>${d.role ? ` — ${d.role}` : ""}`,
    `Phone: ${d.phone}`,
    `Email: ${d.email}`,
    d.company ? `Company: ${d.company}` : "",
    d.details ? `Details: ${d.details}` : "",
    `Opportunity: <b>${cfg.label}</b>`,
  ].filter(Boolean), cfg.cc);

  return NextResponse.json({ ok: true, redirect: cfg.redirect });
}
