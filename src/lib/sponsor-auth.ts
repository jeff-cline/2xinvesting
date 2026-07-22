import crypto from "crypto";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

const SECRET = process.env.SESSION_SECRET || "2x-dev-secret-change-me";
const COOKIE = "twox_sponsor";

function sign(payload: Record<string, unknown>): string {
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", SECRET).update(data).digest("base64url");
  return `${data}.${sig}`;
}
function verify(token: string): Record<string, unknown> | null {
  const [data, sig] = token.split(".");
  if (!data || !sig) return null;
  const exp = crypto.createHmac("sha256", SECRET).update(data).digest("base64url");
  try { if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(exp))) return null; } catch { return null; }
  try { const p = JSON.parse(Buffer.from(data, "base64url").toString()); if (typeof p.exp === "number" && Date.now() > p.exp) return null; return p; } catch { return null; }
}

export async function checkSponsorLogin(email: string, pass: string) {
  const s = await db.investSponsor.findUnique({ where: { email: email.trim().toLowerCase() } }).catch(() => null);
  if (!s || s.status !== "active" || !s.passwordHash) return null;
  return bcrypt.compareSync(pass, s.passwordHash) ? s : null;
}

export async function createSponsorSession(sponsorId: string, byGod = false) {
  const token = sign({ sid: sponsorId, god: byGod, exp: Date.now() + 7 * 86400_000 });
  (await cookies()).set(COOKIE, token, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 604800 });
}
export async function clearSponsorSession() { (await cookies()).delete(COOKIE); }

export async function getSessionSponsor() {
  const c = (await cookies()).get(COOKIE)?.value;
  if (!c) return null;
  const p = verify(c);
  if (!p?.sid) return null;
  return db.investSponsor.findUnique({ where: { id: String(p.sid) } }).catch(() => null);
}

export async function setSponsorPassword(sponsorId: string, newPass: string) {
  await db.investSponsor.update({ where: { id: sponsorId }, data: { passwordHash: bcrypt.hashSync(newPass, 10), mustReset: false } }).catch(() => {});
}
