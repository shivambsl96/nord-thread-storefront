# Nord Threads Shopify Storefront

Headless Shopify storefront built with Next.js and Tailwind CSS. The visual system keeps the existing IKEA-inspired catalogue direction while Shopify becomes the source of truth for products, collections, images, descriptions, prices, variants, availability, cart, and checkout.

## Shopify Setup

1. In Shopify Admin, create or open a custom app with Storefront API access.
2. Enable Storefront API permissions for products, collections, product variants, and cart.
3. Copy the Storefront access token. Do not use an Admin API token in this app.
4. Add products and collections in Shopify.
5. Use Shopify product option names `Color` and `Size` if you want the existing filters and variant selector to work automatically.
6. Create Shopify collections with these handles if you want the branded collection pages to line up with the local storytelling config:
   - `focus`
   - `peace`
   - `discipline`
   - `manifest`
   - `stillness`
   - `growth`
7. For automated Shopify collections, use product tags such as:
   - `collection:focus`
   - `collection:peace`
   - `collection:discipline`
   - `collection:manifest`
   - `collection:stillness`
   - `collection:growth`
8. Optional product tags supported by the frontend:
   - `fit: Relaxed fit`
   - `material: 240gsm organic cotton`
   - `mood: Focus`
   - `art: Minimal typography`
   - `detail: Soft enzyme wash`

Collection product membership and product order come from Shopify. The frontend keeps only short emotional storytelling and visual theme metadata in `lib/collectionStories.js`, so long brand copy does not need to live inside Shopify product descriptions.

## Environment Variables

Create `.env.local` from `.env.example`:

```bash
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-storefront-access-token
NEXT_PUBLIC_SHOPIFY_API_VERSION=2025-01
```

These are public Storefront API credentials intended for browser storefront use. Never expose Shopify Admin API credentials in this project.

## Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Build

```bash
npm run build
```

The site fetches Shopify products and collections during static generation where possible. Cart mutations run in the browser through the Shopify Storefront Cart API.

## Catalogue Source

The frontend reads catalogue data through `lib/catalogueSource.js`.

Current source:

```bash
CATALOGUE_SOURCE=shopify
```

Today this delegates directly to Shopify Storefront API. Later, the same file is the switch point for a cached catalogue source such as `products.json` stored in Azure Blob Storage, without changing catalogue pages or product components.

## Azure Static Web Apps

Terraform for Azure Static Web Apps lives at:

```bash
../infra/azure-static-web-app
```

Recommended GitHub Actions configuration:

```yaml
app_location: "ikea-streetwear-catalogue"
output_location: ".next"
app_build_command: "npm run build"
```

Set the Shopify environment variables in Azure Static Web Apps application settings:

```bash
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN
NEXT_PUBLIC_SHOPIFY_API_VERSION
```

Shopify handles checkout, payments, orders, taxes, shipping, and order lifecycle through the `checkoutUrl` returned by the Storefront Cart API.

Detailed Terraform and GitHub Actions instructions are in `../infra/azure-static-web-app/README.md`.
