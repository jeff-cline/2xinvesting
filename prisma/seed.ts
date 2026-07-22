import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

const OFFERS = [
  { slug: "islay-reserve", title: "The Islay Reserve Allocation", category: "Whisky", coverClass: "c7", iconGlyph: "❦", priority: 90, blurb: "A closed allocation of maturing single-malt casks — held in bond, insured, exit-planned.", description: "A closed allocation of maturing single-malt casks from a family distillery, held in bond, fully insured, and exit-planned across a seven-year horizon. Tangible, appreciating, and pouring — an asset you can visit, gift, and eventually drink.", pdfs: [{label:"Pitch Deck",url:"#"},{label:"Executive Summary",url:"#"},{label:"PPM",url:"#"},{label:"Memorandum",url:"#"}] },
  { slug: "sovereign-cay", title: "Sovereign Cay", category: "Private Island", coverClass: "c2", iconGlyph: "⚓", priority: 80, blurb: "A titled private island held for lifestyle, legacy, and land appreciation.", description: "A titled private island acquisition held for lifestyle, legacy, and long-horizon land appreciation. Direct ownership, clean title, and a development option for those who want more than a return.", pdfs: [{label:"Pitch Deck",url:"#"},{label:"Executive Summary",url:"#"}] },
  { slug: "bullion-trust", title: "The Bullion Trust", category: "Gold Reserve", coverClass: "c3", iconGlyph: "◈", priority: 70, blurb: "Allocated, vaulted gold with audited holdings and redemption rights.", description: "Allocated, vaulted physical gold with independently audited holdings and investor redemption rights. A store of value engineered for preservation, not speculation.", pdfs: [{label:"Executive Summary",url:"#"},{label:"PPM",url:"#"}] },
  { slug: "longevity-ventures", title: "Longevity Ventures", category: "Biotech", coverClass: "c6", iconGlyph: "✚", priority: 60, blurb: "An early-stage syndicate across diagnostics and regenerative therapeutics.", description: "An early-stage venture syndicate across diagnostics and regenerative therapeutics — a curated basket of longevity companies assembled for qualified investors.", pdfs: [{label:"Pitch Deck",url:"#"},{label:"Memorandum",url:"#"}] },
  { slug: "signal-capital", title: "Signal Capital", category: "AI Demand Engine", coverClass: "c8", iconGlyph: "✦", priority: 55, blurb: "Revenue-share in a deployed AI demand-generation platform.", description: "A revenue-share position in a deployed AI demand-generation platform already producing cash flow — participate in the economics of an operating engine, not a promise.", pdfs: [{label:"Pitch Deck",url:"#"},{label:"Executive Summary",url:"#"}] },
  { slug: "blue-harbour", title: "Blue Harbour Resort", category: "Caribbean Island", coverClass: "c4", iconGlyph: "☼", priority: 50, blurb: "A boutique resort development with pre-construction investor units.", description: "A boutique Caribbean resort development offering pre-construction investor units — hospitality yield paired with a place you'll actually want to be.", pdfs: [{label:"Pitch Deck",url:"#"},{label:"PPM",url:"#"}] },
  { slug: "yield-fund", title: "The Yield Fund", category: "Real Estate", coverClass: "c1", iconGlyph: "▦", priority: 45, blurb: "Income-producing multifamily assets across growth-corridor markets.", description: "A fund of income-producing multifamily assets concentrated in growth-corridor markets — durable cash flow with a clear value-add thesis.", pdfs: [{label:"Executive Summary",url:"#"},{label:"PPM",url:"#"}] },
  { slug: "rapid-build", title: "Rapid Build Systems", category: "Foam Building", coverClass: "c1", iconGlyph: "◇", priority: 40, blurb: "Patented foam-core construction scaling into the housing shortage.", description: "A patented foam-core construction system scaling into the national housing shortage — an industrial play on faster, cheaper, stronger building.", pdfs: [{label:"Pitch Deck",url:"#"},{label:"Executive Summary",url:"#"}] },
  { slug: "medigap", title: "1-800-MEDIGAP", category: "Medigap", coverClass: "c4", iconGlyph: "✛", priority: 35, blurb: "Cash-flowing Medicare lead & call platform with recurring economics.", description: "A cash-flowing Medicare lead and call platform with recurring economics — a mature, AI-operated demand engine in the senior-services vertical.", pdfs: [{label:"Executive Summary",url:"#"},{label:"Memorandum",url:"#"}] },
];

(async () => {
  for (const o of OFFERS) {
    await db.investOffer.upsert({
      where: { slug: o.slug },
      update: { title: o.title, category: o.category, blurb: o.blurb, description: o.description, iconGlyph: o.iconGlyph, coverClass: o.coverClass, priority: o.priority, pdfs: JSON.stringify(o.pdfs), isSample: true, status: "live" },
      create: { slug: o.slug, title: o.title, category: o.category, blurb: o.blurb, description: o.description, iconGlyph: o.iconGlyph, coverClass: o.coverClass, priority: o.priority, pdfs: JSON.stringify(o.pdfs), isSample: true, status: "live" },
    });
  }
  console.log(`Seeded ${OFFERS.length} sample offers.`);
  process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
