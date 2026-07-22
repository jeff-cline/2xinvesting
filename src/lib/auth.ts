import crypto from "crypto";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

// Minimal God-account auth for the 2X admin/CRM. HMAC-signed cookie, bcrypt password,
// forced reset on first login. God = jeff.cline@me.com / TEMP!234 (seeded on first touch).
const SECRET = process.env.SESSION_SECRET || "2x-dev-secret-change-me";
const COOKIE = "twox_admin";
const GOD_EMAIL = "jeff.cline@me.com";

type God = { email: string; hash: string; mustReset: boolean };

export async function getGod(): Promise<God> {
  let row = await db.setting.findUnique({ where: { key: "investGod" } }).catch(() => null);
  if (!row) {
    const value = JSON.stringify({ email: GOD_EMAIL, hash: bcrypt.hashSync("TEMP!234", 10), mustReset: true });
    row = await db.setting.upsert({ where: { key: "investGod" }, update: {}, create: { key: "investGod", value } }).catch(() => null);
    if (!row) return { email: GOD_EMAIL, hash: "", mustReset: true };
  }
  try { return JSON.parse(row.value) as God; } catch { return { email: GOD_EMAIL, hash: "", mustReset: true }; }
}

export async function checkLogin(email: string, pass: string): Promise<boolean> {
  const g = await getGod();
  if (email.trim().toLowerCase() !== g.email.toLowerCase()) return false;
  return !!g.hash && bcrypt.compareSync(pass, g.hash);
}

export async function setGodPassword(newPass: string) {
  const g = await getGod();
  await db.setting.update({ where: { key: "investGod" }, data: { value: JSON.stringify({ ...g, hash: bcrypt.hashSync(newPass, 10), mustReset: false }) } }).catch(() => {});
}

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

export async function createSession() {
  const token = sign({ god: true, exp: Date.now() + 7 * 86400_000 });
  (await cookies()).set(COOKIE, token, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 604800 });
}
export async function clearSession() { (await cookies()).delete(COOKIE); }
export async function isAuthed(): Promise<boolean> {
  const c = (await cookies()).get(COOKIE)?.value;
  return !!c && !!verify(c);
}
