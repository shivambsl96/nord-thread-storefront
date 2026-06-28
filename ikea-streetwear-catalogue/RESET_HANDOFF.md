# Nord Threads Reset Handoff

Use this file to continue the project after a laptop reset.

## Repository

- GitHub repo: `git@github.com:shivambsl96/nord-thread-storefront.git`
- App directory: `ikea-streetwear-catalogue`
- Main branch: `main`
- Latest known deployed commit before reset: `c6aa476 Fix blog content and product image matching`

## Clone And Run

```bash
git clone git@github.com:shivambsl96/nord-thread-storefront.git
cd nord-thread-storefront/ikea-streetwear-catalogue
npm install
npm run dev
```

Open `http://localhost:3000`.

## Required Local Env

Create `ikea-streetwear-catalogue/.env.local`.

```bash
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=nordthreads.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-public-storefront-token
NEXT_PUBLIC_SHOPIFY_API_VERSION=2025-01
NEXT_PUBLIC_SITE_URL=https://www.nordthreads.com
```

Optional local-only Admin env vars may exist for one-off Shopify management scripts, but never commit Admin tokens:

```bash
SHOPIFY_STORE_DOMAIN=nordthreads.myshopify.com
SHOPIFY_ADMIN_ACCESS_TOKEN=your-admin-token
SHOPIFY_API_VERSION=2025-01
```

## Deployment

- Hosting: Azure Static Web Apps.
- Live domain: `https://www.nordthreads.com`.
- Pushes to `main` trigger GitHub Actions deployment.
- Workflow file: `.github/workflows/azure-static-web-app.yml`.
- Azure/GitHub secrets must already exist in GitHub Actions:
  - `AZURE_STATIC_WEB_APPS_API_TOKEN`
  - `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN`
  - `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN`
  - `NEXT_PUBLIC_SHOPIFY_API_VERSION`

## Project Source Of Truth

Read `PROJECT_CONTEXT.md` before making design or architecture changes. It captures:

- brand direction
- design guardrails
- Shopify architecture
- product-description parsing rules
- collection rules
- blog rules
- image matching rules
- deployment workflow

## Current Feature State

- Homepage has a full-width featured product grid and collections below.
- Products, collections, cart, checkout, and blogs are loaded from Shopify Storefront API.
- Checkout button uses the exact Shopify `checkoutUrl`.
- Next `proxy.js` redirects Shopify checkout paths landing on Azure to `nordthreads.myshopify.com`.
- `/blogs` renders Shopify article content inside the Nord Threads site.
- Product gallery color filtering supports explicit color filenames and Printrove-style `c_<number>` image groups.
- Product image query fetches up to 80 images to avoid losing color sets.

## Validation Commands

Run these before committing:

```bash
npm run lint
npx next build --webpack
```

After pushing, check deployment:

```bash
gh run list --repo shivambsl96/nord-thread-storefront --limit 3
gh run watch <run-id> --repo shivambsl96/nord-thread-storefront --exit-status
```

## Important Notes

- Do not redesign the whole site unless explicitly requested.
- Preserve the IKEA-inspired premium catalogue identity.
- Keep Shopify as the source of truth for commerce data.
- Do not expose Shopify Admin API tokens.
- Do not rewrite Shopify checkout URLs in the checkout button.
