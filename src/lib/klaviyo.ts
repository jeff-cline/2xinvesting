import { db } from "@/lib/db";

// Klaviyo v3 integration. Config lives in the shared Integration table (key "klaviyo").
// Any CRM lead pushes a profile + a "2X Interest" event — the opt-in trigger that starts Klaviyo flows.

export type KlaviyoConfig = { apiKey: string; listId: string; connected: boolean };

export async function getKlaviyoConfig(): Promise<KlaviyoConfig> {
  const row = await db.integration.findUnique({ where: { key: "klaviyo" } }).catch(() => null);
  try { const c = row ? JSON.parse(row.config || "{}") : {}; return { apiKey: c.apiKey || "", listId: c.listId || "", connected: !!c.connected }; }
  catch { return { apiKey: "", listId: "", connected: false }; }
}

export async function saveKlaviyoConfig(apiKey: string, listId: string, connected: boolean) {
  const value = JSON.stringify({ apiKey, listId, connected });
  await db.integration.upsert({ where: { key: "klaviyo" }, update: { config: value }, create: { key: "klaviyo", config: value } }).catch(() => {});
}

function e164(phone: string): string | undefined {
  const d = (phone || "").replace(/\D/g, "");
  if (d.length === 10) return "+1" + d;
  if (d.length === 11 && d.startsWith("1")) return "+" + d;
  return undefined;
}
const H = (key: string) => ({ Authorization: `Klaviyo-API-Key ${key}`, revision: "2024-10-15", "Content-Type": "application/json", Accept: "application/json" });

// Verify the API key by hitting a lightweight endpoint.
export async function testKlaviyo(apiKey: string): Promise<boolean> {
  if (!apiKey) return false;
  const r = await fetch("https://a.klaviyo.com/api/accounts/", { headers: H(apiKey), signal: AbortSignal.timeout(12000) }).catch(() => null);
  return !!r && r.ok;
}

export type LeadForKlaviyo = { name: string; email: string; phone?: string; kind: string; interest?: string; source?: string; sponsor?: string };

// Push a profile + fire the "2X Interest" event (opt-in trigger), and subscribe to the list if configured. Never throws.
export async function pushLeadToKlaviyo(lead: LeadForKlaviyo) {
  try {
    const cfg = await getKlaviyoConfig();
    if (!cfg.apiKey || !lead.email) return;
    const [first, ...rest] = (lead.name || "").trim().split(" ");
    const profileAttrs: Record<string, unknown> = { email: lead.email };
    const phone = e164(lead.phone || ""); if (phone) profileAttrs.phone_number = phone;
    if (first) profileAttrs.first_name = first;
    if (rest.length) profileAttrs.last_name = rest.join(" ");
    profileAttrs.properties = { source: lead.source || "2xinvesting", latest_interest: lead.interest || "", latest_kind: lead.kind };

    // Event = the opt-in trigger. Creates/updates the profile automatically.
    await fetch("https://a.klaviyo.com/api/events/", {
      method: "POST", headers: H(cfg.apiKey), signal: AbortSignal.timeout(12000),
      body: JSON.stringify({ data: { type: "event", attributes: {
        metric: { data: { type: "metric", attributes: { name: "2X Interest" } } },
        profile: { data: { type: "profile", attributes: profileAttrs } },
        properties: { kind: lead.kind, interest: lead.interest || "", sponsor: lead.sponsor || "", source: lead.source || "2xinvesting" },
        time: new Date().toISOString(),
      } } }),
    }).catch(() => {});

    // Opt-in: subscribe to the marketing list if one is set.
    if (cfg.listId) {
      await fetch("https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/", {
        method: "POST", headers: H(cfg.apiKey), signal: AbortSignal.timeout(12000),
        body: JSON.stringify({ data: { type: "profile-subscription-bulk-create-job", attributes: {
          profiles: { data: [{ type: "profile", attributes: { email: lead.email, subscriptions: { email: { marketing: { consent: "SUBSCRIBED" } } } } }] },
        }, relationships: { list: { data: { type: "list", id: cfg.listId } } } } }),
      }).catch(() => {});
    }
  } catch { /* never block */ }
}
