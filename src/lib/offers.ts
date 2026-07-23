import { db } from "@/lib/db";

export type OfferPdf = { label: string; url: string };
export type Offer = {
  id: string; slug: string; title: string; category: string; blurb: string;
  description: string; iconGlyph: string; coverClass: string; featuredImage: string;
  gallery: string[]; pdfs: OfferPdf[]; isSample: boolean; priority: number;
  trending: boolean; pocket: boolean; sponsorId: string | null; impressions: number; clicks: number;
};


function toOffer(r: Record<string, unknown>): Offer {
  return {
    id: String(r.id), slug: String(r.slug), title: String(r.title), category: String(r.category),
    blurb: String(r.blurb), description: String(r.description), iconGlyph: String(r.iconGlyph),
    coverClass: String(r.coverClass), featuredImage: String(r.featuredImage),
    gallery: safeArr(r.gallery) as string[], pdfs: safeArr(r.pdfs) as OfferPdf[],
    isSample: Boolean(r.isSample), priority: Number(r.priority), trending: Boolean(r.trending), pocket: Boolean(r.pocket),
    sponsorId: (r.sponsorId as string) ?? null,
    impressions: Number(r.impressions), clicks: Number(r.clicks),
  };
}
function safeArr(s: unknown): unknown[] { try { const v = JSON.parse(String(s || "[]")); return Array.isArray(v) ? v : []; } catch { return []; } }

// Rank: God priority first, then momentum (clicks+impressions), then recency.
// Real (non-sample) offers always outrank samples so samples retire as inventory grows.
function rank(a: Offer, b: Offer) {
  if (a.isSample !== b.isSample) return a.isSample ? 1 : -1;
  if (b.priority !== a.priority) return b.priority - a.priority;
  return (b.clicks * 3 + b.impressions) - (a.clicks * 3 + a.impressions);
}

// Featured rotates every 3 days across the top-ranked offers (deterministic, no randomness).
export async function getHomeOffers() {
  const rows = await db.investOffer.findMany({ where: { status: "live" } }).catch(() => []);
  const all = rows.map(toOffer).sort(rank);
  const pocket = all.filter((o) => o.pocket).sort((a, b) => b.priority - a.priority);
  // Trending = offers flagged trending (God-controlled); they don't appear in featured/also-view.
  const trending = all.filter((o) => o.trending && !o.pocket).slice(0, 6);
  const pool = all.filter((o) => !o.trending && !o.pocket);
  if (!pool.length) return { featured: null, alsoView: [], trending, pocket, all };
  const cycle = Math.floor(Date.now() / (3 * 86400_000));
  const topPool = pool.slice(0, Math.min(4, pool.length));
  const featured = topPool[cycle % topPool.length];
  const rest = pool.filter((o) => o.slug !== featured.slug);
  const alsoView = rest.slice(0, 6);
  return { featured, alsoView, trending, pocket, all };
}

export async function getOffer(slug: string): Promise<Offer | null> {
  const r = await db.investOffer.findUnique({ where: { slug } }).catch(() => null);
  return r ? toOffer(r as Record<string, unknown>) : null;
}
