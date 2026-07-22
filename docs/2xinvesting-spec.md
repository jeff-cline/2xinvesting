# 2X Investing — Platform Spec

**One line:** A boutique "Lifestyle Investing" marketing platform — a curated house of alternative-investment offers, with a public marketing site, sponsor offer portal + CRM, investor accounts, membership tiers, and a full marketing engine (Zapmail + Klaviyo + VoiceDrip), all managed from a God console under the medigap Core.

Design **approved** 2026-07-22 (see `design/homepage-approved.html`). Domain `2xinvesting.com` (currently WordPress at 69.48.151.143 — to be replaced). Featured video: https://youtu.be/1eAo8NvpnB0

---

## Architecture

- **Separate Next.js app** on the same Vultr box (137.220.56.129) as medigap/beyondlimits — the Beyond Limits pattern: own pm2 process (`2xinvesting`), own port (proposed **3060**), own nginx vhost for `2xinvesting.com`.
- **Shares Core data** — connects to the same Postgres instance so the medigap Core can manage its offers/leads/campaigns from a left-nav **INVESTING** section (mirrors `/u65`).
- Stack mirrors Core: Next.js 15 App Router, TypeScript, Prisma pinned **6.19.3**, Postgres (prod) / SQLite (dev), Tailwind.
- **IP switch is gated:** build → preview on the box → user approves → point `2xinvesting.com` A-record to 137.220.56.129. Do NOT switch until approved.
- Save to GitHub `git@github.com:jeff-cline/2xinvesting.git`; push at start; post-commit auto-push hook.

## Look & feel (approved)

Dark, rich, lush, boutique investment-fund. Deep emerald-black ground (#0A0F0C/#0E1512), champagne-gold accent (#C9A24B) used sparingly, warm ivory text (#ECE7DA), sage muted (#8B9A8F). Didone serif display (Didot/Bodoni stack) + Helvetica Neue/grotesque body. Film-grain, gold hairlines, generous negative space. **Dark-only** (deliberate). Featured video front-and-center in a gold-lit frame.

## The God account

- **jeff.cline@me.com**, default password **TEMP!234**, **forced reset on first login**.
- Can **impersonate** any sponsor or investor account.
- Can **reset any account** and reset own.
- God dashboard: # opportunities, # clicks on opportunities, which are trending, drill into ANY offer's sponsor admin.
- Prioritizes offers **on-site and in the email drip**.

## Offers ("opportunities")

**Seed (sample) offers** — 9 categories, flagged `isSample=true`, auto-retire as real sponsor offers accumulate: Foam Building, Medigap, Caribbean Island, Real Estate, Private Island, Whisky, Gold Reserve, AI Demand Engine, Biotech.

**Homepage rotation** (as specified): all shown at first → **1 Featured** offer, rotating every **3 days** → **"People Also View"** (offers ranked 3–9) → **Trending** (3). God priority overrides rank.

**Offer landing page** (sponsor-built, optimized): featured image, portfolio image gallery, title, description, pick icon, and downloadable PDFs — **Pitch Deck, Executive Summary, Memorandum, PPM** (+ add other). CTA → investor lead capture.

## Sponsors

- **Create sponsor account** (footer "Become a Sponsor").
- **Offer portal:** add/manage their offer + upload all assets above.
- **Own admin + CRM:** their own login; see the leads for THEIR offer; make notes per lead.
- **Integrations tab:** connect their CRM — **Zoho, GoHighLevel, Salesforce** — via API, so leads sync out.
- **Sponsor dashboard:** impressions and clicks for their ad (tracked on-site AND in email); "High-Intent Opportunity Matches" total; "Expressed Interest" count (anyone who clicked into their offer).

## Investors

- **Investor intake** (footer "Become an Investor"): name, phone, email, business name, + role dropdown: **Accredited Investor, Fund Manager, Joint Venture, Private Investor**.
- **Investor account:** revisit anytime, change interests, view all offers again and again.
- Multi-**membership** tiers.

## Tracking

- **Impressions**: every load of an offer's ad — on the website AND in email — is tracked.
- **Clicks**: every click into an offer = "Expressed Interest" for that sponsor.
- Surfaced on sponsor dashboards and the God dashboard (trending = momentum of impressions/clicks).

## Marketing engine (mirror U65 model)

- **Global marketing campaign** with **lead upload** (same as U65/Fire).
- **Outbound email + outbound VoiceDrip** (reuse the U65/Fire + VoiceDrip engines).
- **Two email systems:**
  - **Zapmail** — fresh/unvalidated cold sends: **welcome, hello, intro, and monthly summary**.
  - **Klaviyo** — a **drip campaign** on top, for those who **opt in** or call in. "Get More Info" → Klaviyo drip.
- **Offer portal** feeds the marketing: offers managed there flow into the on-site placement AND the email drip; God prioritizes.

## Notifications (email)

- **Any signup** (investor OR sponsor) → email **jeff.cline@me.com** directly with their **name, phone, email, and what they were interested in**.
- **New offer uploaded** → platform-wide email to **everyone** announcing the new opportunity, and **below it the trending 5 offers that match that recipient's profile**.

## Phases

1. **Public site** (this is the browser-gated deliverable): homepage (approved) + offer landing pages + investor intake + sponsor "become a sponsor" + footer CTAs. Seed offers flagged as samples. Real embedded video. Deploy preview on the box.
2. **Accounts & portals:** God account (forced reset + impersonation), sponsor create/offer-portal/CRM+notes, investor accounts (set/change interests, revisit), membership tiers.
3. **Tracking & dashboards:** impressions + clicks (site + email), sponsor dashboard (matches, expressed interest), God dashboard (opportunities, clicks, trending, drill-in).
4. **Marketing engine:** lead upload, outbound email + VoiceDrip, Zapmail (welcome/hello/intro/monthly), Klaviyo drip (opt-in), notifications (signup→Jeff; new offer→everyone + trending-5 matches), sponsor CRM integrations (Zoho/GHL/Salesforce).
5. **INVESTING nav in Core** to run all of the above from medigap.

Each phase must be viewable/testable on its own; nothing goes live on the real domain until approved in preview.
