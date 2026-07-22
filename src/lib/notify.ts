import nodemailer from "nodemailer";
import { db } from "@/lib/db";

type Mailbox = { smtpUser?: string; smtpPass?: string; smtpHost?: string; smtpPort?: number };

async function firstMailbox(): Promise<Mailbox | null> {
  const row = await db.integration.findUnique({ where: { key: "zapmail" } }).catch(() => null);
  if (!row) return null;
  try {
    const cfg = JSON.parse(row.config || "{}");
    const mbs: Mailbox[] = cfg.mailboxes || [];
    return mbs.find((m) => m.smtpUser && m.smtpPass && m.smtpHost) || null;
  } catch { return null; }
}

// Extra people to CC on Investor Discovery Tour requests (managed in the God account). Jeff is always included.
export async function getDiscoveryTourCc(): Promise<string[]> {
  const row = await db.setting.findUnique({ where: { key: "discoveryTourCC" } }).catch(() => null);
  try { const arr = row ? JSON.parse(row.value) : []; return Array.isArray(arr) ? arr.filter((x) => typeof x === "string") : []; } catch { return []; }
}

// Send a direct email to a specific recipient (e.g., a sponsor's login details). Never throws.
export async function sendTo(to: string, subject: string, html: string) {
  try {
    const mb = await firstMailbox();
    if (!mb) { console.log("[sendTo] no mailbox for", to, subject); return; }
    const t = nodemailer.createTransport({ host: mb.smtpHost, port: mb.smtpPort || 587, secure: mb.smtpPort === 465, auth: { user: mb.smtpUser, pass: mb.smtpPass } });
    await t.sendMail({ from: mb.smtpUser, to, subject, html });
  } catch (e) { console.log("[sendTo] failed:", e instanceof Error ? e.message : "unknown"); }
}

// Email jeff.cline@me.com directly. Optionally CC others. Never throws.
export async function notifyFounder(subject: string, lines: string[], cc: string[] = []) {
  try {
    const mb = await firstMailbox();
    const to = process.env.NOTIFY_EMAIL || "jeff.cline@me.com";
    const body = lines.map((l) => `<p style="margin:4px 0">${l}</p>`).join("");
    const html = `<div style="font-family:Arial,sans-serif;color:#14202e"><h2 style="margin:0 0 10px">${subject}</h2>${body}<p style="color:#8b9a8f;font-size:12px;margin-top:16px">2X Investing · lifestyle capital</p></div>`;
    if (!mb) { console.log("[notify] no mailbox; would send:", subject, lines.join(" | ")); return; }
    const t = nodemailer.createTransport({ host: mb.smtpHost, port: mb.smtpPort || 587, secure: mb.smtpPort === 465, auth: { user: mb.smtpUser, pass: mb.smtpPass } });
    await t.sendMail({ from: mb.smtpUser, to, cc: cc.filter((e) => e && e !== to), subject, html });
  } catch (e) {
    console.log("[notify] failed:", e instanceof Error ? e.message : "unknown");
  }
}
