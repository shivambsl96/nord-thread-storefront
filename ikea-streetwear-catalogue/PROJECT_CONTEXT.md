# Nord Threads Project Context

This file is the working source of truth for maintaining consistency across future edits.

## Brand

- Brand name: Nord Threads.
- Public website: `https://www.nordthreads.com`.
- Shopify store domain: `nordthreads.myshopify.com`.
- Positioning: premium, calm, mindful, minimal self-improvement lifestyle brand.
- Visual identity: IKEA-inspired catalogue structure with Apple-like product presentation.
- Tone: short, clean, emotionally intelligent, slightly Gen-Z, not cringe.

## Design Principles

- Preserve the strong grid, whitespace, bold typography, and Scandinavian catalogue feeling.
- Product pages should feel premium/editorial, not like a generic Shopify template.
- Homepage should prioritize products and collections without oversized filler blocks.
- Avoid cramped layouts. Product cards need breathing room and clear internal hierarchy.
- Avoid loud discount/sales language, flashy neon effects, hustle culture, sigma aesthetics, fake spirituality, and marketplace clutter.
- Use subtle patterns, soft surfaces, quiet dividers, and restrained motion.

## Copy Rules

- Prefer short lines like:
  - Pick your mood.
  - Soft chaos. Clean fits.
  - Low noise. High intent.
  - Made for quiet wins.
  - Wear the mood.
  - Stay lowkey.
- Do not show customer-facing backend language like:
  - synced from Shopify
  - Shopify source
  - Storefront API
  - availability stats
  - variant counts

## Shopify Architecture

- Shopify Storefront API is the source of truth for:
  - products
  - collections
  - product images
  - descriptions
  - prices
  - variants
  - sizes/colors
  - availability
  - cart
  - checkout URL
  - blogs/articles
- Do not use Shopify Admin API in frontend code.
- Do not expose Admin API tokens.
- Checkout button must use the exact `checkoutUrl` returned by Shopify Cart API.
- The app redirects Shopify checkout paths that land on Azure (`/cart/c/*`, `/checkout/*`, `/checkouts/*`) to `https://nordthreads.myshopify.com`.
- Cart ID is persisted in `localStorage` using `nord-threads-cart-id`.

## Product Description Structure

Shopify product descriptions may use this structure:

```text
Opening description before Fabric:

Fabric:
Fit:
Care:
Hook:
Inspiration:
```

Frontend parser should map:

- Opening description -> product story/details.
- Fabric -> Fabric note.
- Fit -> Fit note.
- Care -> Care note.
- Hook -> bold emotional statement.
- Inspiration -> supporting campaign paragraph.

## Collections

Collections are emotional/lifestyle themes, not clothing categories.

Approved themes:

- Peace
- Focus
- Manifest
- Discipline
- Patience
- Growth

Shopify collection membership comes from Shopify. Frontend config only controls storytelling, theme styling, and display order.

## Current Homepage Direction

- No left-side hero rail with large text/buttons/stats.
- Featured products should be the primary first section.
- Product cards should be spacious and placed in a clean catalogue grid.
- Prices must stay inside product cards, below the title.
- Collections should follow as mood-selection cards.

## Blogs

- `/blogs` renders Shopify blogs/articles through Storefront API.
- Keep blog pages editorial and brand-native.
- Render full article content for featured articles, not only excerpts.
- Do not show author/date metadata unless explicitly requested.
- Do not link users to Shopify storefront blog pages unless explicitly required.

## Product Image Matching

- Product gallery color filtering must support both explicit color filenames and Printrove-style color codes.
- Shopify product image queries should fetch enough images for all color sets; do not lower the image limit without checking large products.
- Explicit filename/alt color names win over Shopify variant images when they conflict.
- If filenames do not contain color names, use the selected variant image's `c_<number>` code to group matching front/back images.
- If one variant image URL is shared by multiple colors, treat it as unreliable and fall back to filename/color matching.

## Deployment

- Hosting target: Azure Static Web Apps.
- GitHub repo: `shivambsl96/nord-thread-storefront`.
- Branch: `main`.
- Push to `main` triggers Azure Static Web Apps deployment.
- Required public env vars:
  - `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN`
  - `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN`
  - `NEXT_PUBLIC_SHOPIFY_API_VERSION`
  - `NEXT_PUBLIC_SITE_URL=https://www.nordthreads.com`

## Editing Guardrails

- Do not redesign the whole site unless explicitly requested.
- Preserve the current Nord Threads visual language.
- Before major UI edits, check this file and existing components.
- After changes, run:

```bash
npm run lint
npx next build --webpack
```

- For deploys, commit intentionally, push `main`, and watch GitHub Actions.
