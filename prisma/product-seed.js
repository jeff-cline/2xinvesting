const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();
const PRODUCTS = [
  { slug: "private-jet", title: "Private Jet Membership", category: "Aviation", iconGlyph: "✈", img: "/media/prod-jet.jpg", blurb: "Fractional and on-demand private aviation for members.", description: "A private aviation membership — fractional ownership and on-demand charter with fixed hourly rates, guaranteed availability, and no positioning fees. Fly private without owning the whole aircraft." },
  { slug: "yacht-charter", title: "Yacht Charter Program", category: "Maritime", iconGlyph: "⚓", img: "/media/prod-yacht.jpg", blurb: "A managed charter program across a global fleet.", description: "Access a managed yacht charter program spanning the Mediterranean, Caribbean, and beyond — crewed, provisioned, and concierge-managed, with member pricing and priority booking." },
  { slug: "watch-portfolio", title: "Luxury Watch Portfolio", category: "Collectibles", iconGlyph: "◷", img: "/media/prod-watch.jpg", blurb: "Curated, appreciating timepieces as a tangible asset.", description: "A curated portfolio of investment-grade timepieces — sourced, authenticated, insured, and stored on your behalf. Wear them, or hold them as an appreciating tangible asset." },
];
(async () => {
  for (const p of PRODUCTS) {
    const data = { title: p.title, category: p.category, iconGlyph: p.iconGlyph, blurb: p.blurb, description: p.description, featuredImage: p.img, listingType: "product", isSample: true, status: "live", coverClass: "c3", pdfs: JSON.stringify([{ label: "Product Overview", url: "#" }, { label: "Pricing Sheet", url: "#" }]) };
    await db.investOffer.upsert({ where: { slug: p.slug }, update: data, create: { slug: p.slug, ...data } });
  }
  console.log("products:", await db.investOffer.count({ where: { listingType: "product" } }));
  process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
