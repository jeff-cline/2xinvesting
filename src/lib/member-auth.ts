import crypto from "crypto";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

const SECRET = process.env.SESSION_SECRET || "2x-dev-secret-change-me";
const COOKIE = "twox_member";

function sign(p: Record<string, unknown>) { const d = Buffer.from(JSON.stringify(p)).toString("base64url"); return `${d}.${crypto.createHmac("sha256", SECRET).update(d).digest("base64url")}`; }
function verify(t: string): Record<string, unknown> | null {
  const [d, s] = t.split("."); if (!d || !s) return null;
  const e = crypto.createHmac("sha256", SECRET).update(d).digest("base64url");
  try { if (!crypto.timingSafeEqual(Buffer.from(s), Buffer.from(e))) return null; } catch { return null; }
  try { const p = JSON.parse(Buffer.from(d, "base64url").toString()); if (typeof p.exp === "number" && Date.now() > p.exp) return null; return p; } catch { return null; }
}

export async function registerMember(name: string, email: string, phone: string, password: string, role: string) {
  const e = email.trim().toLowerCase();
  if (!e || password.length < 8) return { error: "Enter a valid email and a password of at least 8 characters." };
  const existing = await db.investMember.findUnique({ where: { email: e } }).catch(() => null);
  if (existing) return { error: "An account with this email already exists — sign in instead." };
  const m = await db.investMember.create({ data: { name, email: e, phone, passwordHash: bcrypt.hashSync(password, 10), role } }).catch(() => null);
  return m ? { member: m } : { error: "Could not create your account." };
}

export async function checkMemberLogin(email: string, pass: string) {
  const m = await db.investMember.findUnique({ where: { email: email.trim().toLowerCase() } }).catch(() => null);
  if (!m || !m.passwordHash) return null;
  return bcrypt.compareSync(pass, m.passwordHash) ? m : null;
}

export async function createMemberSession(memberId: string) {
  (await cookies()).set(COOKIE, sign({ mid: memberId, exp: Date.now() + 30 * 86400_000 }), { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 2592000 });
}
export async function clearMemberSession() { (await cookies()).delete(COOKIE); }
export async function getSessionMember() {
  const c = (await cookies()).get(COOKIE)?.value; if (!c) return null;
  const p = verify(c); if (!p?.mid) return null;
  return db.investMember.findUnique({ where: { id: String(p.mid) } }).catch(() => null);
}
