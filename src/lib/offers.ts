import { db } from "@/lib/db";

export type OfferPdf = { label: string; url: string };
export type Offer = {
  id: string; slug: string; title: string; category: string; blurb: string;
  description: string; iconGlyph: string; coverClass: string; featuredImage: string;
  gallery: string[]; pdfs: OfferPdf[]; isSample: boolean; priority: number;
  trending: boolean; pocket: boolean; impressions: number; clicks: number;
};

// The 9 seed offers — real content, flagged isSample so they retire as sponsors arrive.
export const SEED_OFFERS: Array<Omit<Offer, "id" | "gallery" | "pdfs" | "impressions" | "clicks" | "trending" | "pocket"> & { gallery: string[]; pdfs: OfferPdf[] }> = [
  { slug: "islay-reserve", title: "The Islay Reserve Allocation", category: "Whisky", coverClass: "c7", iconGlyph: "❦", priority: 90, isSample: true,
    blurb: "A closed allocation of maturing single-malt casks — held in bond, insured, exit-planned.",
    description: "A closed allocation of maturing single-malt casks from a family distillery, held in bond, fully insured, and exit-planned across a seven-year horizon. Tangible, appreciating, and pouring — an asset you can visit, gift, and eventually drink.",
    featuredImage: "", gallery: [], pdfs: [{label:"Pitch Deck",url:"#"},{label:"Executive Summary",url:"#"},{label:"PPM",url:"#"},{label:"Memorandum",url:"#"}] },
  { slug: "sovereign-cay", title: "Sovereign Cay", category: "Private Island", coverClass: "c2", iconGlyph: "⚓", priority: 80, isSample: true,
    blurb: "A titled private island held for lifestyle, legacy, and land appreciation.",
    description: "A titled private island acquisition held for lifestyle, legacy, and long-horizon land appreciation. Direct ownership, clean title, and a development option for those who want more than a return.",
    featuredImage: "", gallery: [], pdfs: [{label:"Pitch Deck",url:"#"},{label:"Executive Summary",url:"#"}] },
  { slug: "bullion-trust", title: "The Bullion Trust", category: "Gold Reserve", coverClass: "c3", iconGlyph: "◈", priority: 70, isSample: true,
    blurb: "Allocated, vaulted gold with audited holdings and redemption rights.",
    description: "Allocated, vaulted physical gold with independently audited holdings and investor redemption rights. A store of value engineered for preservation, not speculation.",
    featuredImage: "", gallery: [], pdfs: [{label:"Executive Summary",url:"#"},{label:"PPM",url:"#"}] },
  { slug: "longevity-ventures", title: "Longevity Ventures", category: "Biotech", coverClass: "c6", iconGlyph: "✚", priority: 60, isSample: true,
    blurb: "An early-stage syndicate across diagnostics and regenerative therapeutics.",
    description: "An early-stage venture syndicate across diagnostics and regenerative therapeutics — a curated basket of longevity companies assembled for qualified investors.",
    featuredImage: "", gallery: [], pdfs: [{label:"Pitch Deck",url:"#"},{label:"Memorandum",url:"#"}] },
  { slug: "signal-capital", title: "Signal Capital", category: "AI Demand Engine", coverClass: "c8", iconGlyph: "✦", priority: 55, isSample: true,
    blurb: "Revenue-share in a deployed AI demand-generation platform.",
    description: "A revenue-share position in a deployed AI demand-generation platform already producing cash flow — participate in the economics of an operating engine, not a promise.",
    featuredImage: "", gallery: [], pdfs: [{label:"Pitch Deck",url:"#"},{label:"Executive Summary",url:"#"}] },
  { slug: "blue-harbour", title: "Blue Harbour Resort", category: "Caribbean Island", coverClass: "c4", iconGlyph: "☼", priority: 50, isSample: true,
    blurb: "A boutique resort development with pre-construction investor units.",
    description: "A boutique Caribbean resort development offering pre-construction investor units — hospitality yield paired with a place you'll actually want to be.",
    featuredImage: "", gallery: [], pdfs: [{label:"Pitch Deck",url:"#"},{label:"PPM",url:"#"}] },
  { slug: "yield-fund", title: "The Yield Fund", category: "Real Estate", coverClass: "c1", iconGlyph: "▦", priority: 45, isSample: true,
    blurb: "Income-producing multifamily assets across growth-corridor markets.",
    description: "A fund of income-producing multifamily assets concentrated in growth-corridor markets — durable cash flow with a clear value-add thesis.",
    featuredImage: "", gallery: [], pdfs: [{label:"Executive Summary",url:"#"},{label:"PPM",url:"#"}] },
  { slug: "rapid-build", title: "Rapid Build Systems", category: "Foam Building", coverClass: "c1", iconGlyph: "◇", priority: 40, isSample: true,
    blurb: "Patented foam-core construction scaling into the housing shortage.",
    description: "A patented foam-core construction system scaling into the national housing shortage — an industrial play on faster, cheaper, stronger building.",
    featuredImage: "", gallery: [], pdfs: [{label:"Pitch Deck",url:"#"},{label:"Executive Summary",url:"#"}] },
  { slug: "medigap", title: "1-800-MEDIGAP", category: "Medigap", coverClass: "c4", iconGlyph: "✛", priority: 35, isSample: true,
    blurb: "Cash-flowing Medicare lead & call platform with recurring economics.",
    description: "A cash-flowing Medicare lead and call platform with recurring economics — a mature, AI-operated demand engine in the senior-services vertical.",
    featuredImage: "", gallery: [], pdfs: [{label:"Executive Summary",url:"#"},{label:"Memorandum",url:"#"}] },
];

function toOffer(r: Record<string, unknown>): Offer {
  return {
    id: String(r.id), slug: String(r.slug), title: String(r.title), category: String(r.category),
    blurb: String(r.blurb), description: String(r.description), iconGlyph: String(r.iconGlyph),
    coverClass: String(r.coverClass), featuredImage: String(r.featuredImage),
    gallery: safeArr(r.gallery) as string[], pdfs: safeArr(r.pdfs) as OfferPdf[],
    isSample: Boolean(r.isSample), priority: Number(r.priority), trending: Boolean(r.trending), pocket: Boolean(r.pocket),
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
