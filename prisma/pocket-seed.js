const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

const POCKET = [
  {
    slug: "nav-leverage", title: "NAV — Leverage Your Equity", category: "Member Benefit", iconGlyph: "◆",
    blurb: "Turn private shares into deployable capital — without selling.",
    description: "Leverage your private equity or private company stock. Take a low-interest, long-term loan against your private company shares — for companies valued over $10 million — and deploy that capital into alternative investments with far higher returns. You arbitrage the upside while your shares keep compounding, creating real lifestyle liquidity without selling. A 2X member benefit, offered at a discount.",
    featuredImage: "/media/nav.jpg", priority: 99,
  },
  {
    slug: "exit-optimization", title: "Exit Optimization", category: "Member Benefit", iconGlyph: "◇",
    blurb: "Command higher multiples and reduce your tax burden at exit.",
    description: "Maximize your exit. We help you package IP, technology, and revenue streams to command higher multiples — building your NAV alongside your portfolio. With strategic two-step guidance, you optimize your exit opportunities and reduce your overall tax burden. A 2X member benefit, offered at a discount.",
    featuredImage: "/media/exit-optimization.jpg", priority: 98,
  },
];

(async () => {
  for (const o of POCKET) {
    const data = { title: o.title, category: o.category, iconGlyph: o.iconGlyph, blurb: o.blurb, description: o.description, featuredImage: o.featuredImage, priority: o.priority, pocket: true, trending: false, isSample: true, status: "live" };
    await db.investOffer.upsert({
      where: { slug: o.slug },
      update: data,
      create: { slug: o.slug, coverClass: "c3", pdfs: JSON.stringify([{ label: "Member Overview", url: "#" }]), ...data },
    });
  }
  console.log("pocket offers:", await db.investOffer.count({ where: { pocket: true } }));
  process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
