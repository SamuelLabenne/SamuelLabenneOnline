# samuellabenne.com

Personal site of Sam Labenne, digital builder: websites, webshops (Wix & Shopify), Odoo and
Salesforce. *From pixel to pipeline.* Built with [Astro](https://astro.build) as a static site and
deployed to GitHub Pages.

- **Preview (staging):** https://samuellabenne.github.io/SamuelLabenneOnline/
- **Future domain:** https://samuellabenne.com
- **Pages:** Home, Services, About, Insights (blog), Contact, Privacy policy, Cookie policy, 404

## Working on the site

Requires Node 22.12 or newer.

```bash
npm install
npm run dev       # local dev server at http://localhost:4321/SamuelLabenneOnline/
npm run build     # production build into dist/
npm run preview   # serve the production build locally
```

Every push to `main` builds and deploys automatically (`.github/workflows/deploy.yml`).

## Where things live

| What | Where |
| --- | --- |
| Personal details (email, LinkedIn, featured project, analytics, indexing) | `src/config/site.ts` |
| The four services (used on Home and Services) | `src/data/services.ts` |
| Pages | `src/pages/` |
| Blog posts (Insights) | `src/content/insights/*.md` |
| Home page sections and 3D effects | `src/components/home/` |
| Design tokens and shared styles | `src/styles/global.css` |
| Scroll engine for the 3D effects | `src/scripts/scroll.ts` |

## Writing an Insights post

Add a Markdown file to `src/content/insights/`. The file name becomes the URL
(`my-post.md` → `/insights/my-post/`).

```markdown
---
title: Your headline
description: One or two sentences shown on cards and in search results.
date: 2026-10-01
category: Guide        # e.g. News, Guide, Odoo
cover: 2               # optional cover style 0–3 (mint, lime, green, sun)
draft: false           # true hides the post
---

Post body in Markdown…
```

## Contact

There is no contact form: every call to action opens an email to the address in
`src/config/site.ts`, and the contact page has a one-click "Copy address" button.

## Cookies, analytics and policies

A consent banner (`src/components/CookieConsent.astro`) asks new visitors to accept or decline
analytics cookies, with equal-weight buttons as EU rules require. The choice is kept for 12 months
and can be changed from **Cookie settings** in the footer.

The site sets no cookies today. To add Google Analytics, put the GA4 measurement ID in
`analyticsId` in `src/config/site.ts`: it only loads after a visitor accepts, and the cookie and
privacy policies list it automatically. Bump `policiesUpdated` whenever the policies change.

## Going live on samuellabenne.com (Cloudflare)

1. In `astro.config.mjs`, set `CUSTOM_DOMAIN = 'samuellabenne.com'`.
2. Add `public/CNAME` containing just `samuellabenne.com`.
3. In `src/config/site.ts`, set `indexable: true`. Push to `main`.
4. In Cloudflare → **DNS**, add these records with the proxy **off** (grey cloud, "DNS only"):

   | Type | Name | Content |
   | --- | --- | --- |
   | A | `@` | `185.199.108.153` |
   | A | `@` | `185.199.109.153` |
   | A | `@` | `185.199.110.153` |
   | A | `@` | `185.199.111.153` |
   | AAAA | `@` | `2606:50c0:8000::153` |
   | AAAA | `@` | `2606:50c0:8001::153` |
   | AAAA | `@` | `2606:50c0:8002::153` |
   | AAAA | `@` | `2606:50c0:8003::153` |
   | CNAME | `www` | `samuellabenne.github.io` |

5. In GitHub → repo **Settings → Pages → Custom domain**, enter `samuellabenne.com`, wait for the
   DNS check to pass, then tick **Enforce HTTPS**.
6. Optional: once HTTPS works, you can switch the Cloudflare proxy on (orange cloud). If you do,
   set Cloudflare **SSL/TLS** mode to **Full (strict)**.
