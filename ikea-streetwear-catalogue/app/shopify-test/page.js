import Image from "next/image";
import { shopifyFetch } from "@/lib/shopify";

export const dynamic = "force-dynamic";

const TEST_PRODUCTS_QUERY = `
  query ShopifyTestProducts {
    products(first: 10) {
      edges {
        node {
          id
          title
          handle
          availableForSale
          featuredImage {
            url
            altText
            width
            height
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

export const metadata = {
  title: "Shopify Test | Nord Thread",
  description: "Temporary Shopify Storefront API diagnostic page."
};

export default async function ShopifyTestPage() {
  const response = await shopifyFetch({
    query: TEST_PRODUCTS_QUERY,
    cache: "no-store"
  });

  const products =
    response.data?.products?.edges?.map((edge) => edge.node).filter(Boolean) ?? [];
  const errors = sanitizeErrors(response.errors);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="border-b border-ink/10 pb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-coral">
          Shopify diagnostic
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold uppercase leading-none tracking-[0.08em] text-ink">
          Storefront API products test
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-ink/65">
          This page directly queries `products(first: 10)` from the Shopify Storefront
          API. It does not use local product data or collections.
        </p>
      </div>

      <section className="mt-8">
        <div className="flex items-end justify-between gap-4 border-y border-ink/10 bg-white px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-coral">
              Result
            </p>
            <h2 className="mt-1 font-display text-2xl font-bold uppercase tracking-[0.08em] text-ink">
              {products.length} products returned
            </h2>
          </div>
        </div>

        {errors.length ? (
          <div className="mt-6 border border-coral/30 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-coral">
              GraphQL errors
            </p>
            <pre className="mt-4 overflow-auto bg-paper p-4 text-sm leading-6 text-ink/75">
              {JSON.stringify(errors, null, 2)}
            </pre>
          </div>
        ) : null}

        {!errors.length && !products.length ? (
          <div className="mt-6 border border-dashed border-ink/20 bg-white px-6 py-10">
            <p className="font-display text-2xl font-bold uppercase tracking-[0.08em] text-ink">
              No products returned
            </p>
            <p className="mt-3 max-w-xl text-sm leading-6 text-ink/62">
              The API request succeeded without GraphQL errors, but Shopify returned zero
              products. Check that products are active, published to the Storefront sales
              channel, and available to the Storefront API.
            </p>
          </div>
        ) : null}

        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => {
            const price = product.priceRange?.minVariantPrice;

            return (
              <article key={product.id} className="border border-ink/10 bg-white">
                <div className="relative aspect-[4/5] bg-mist">
                  {product.featuredImage?.url ? (
                    <Image
                      src={product.featuredImage.url}
                      alt={product.featuredImage.altText || product.title}
                      fill
                      className="p-6 object-contain"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center px-6 text-center text-sm uppercase tracking-[0.18em] text-ink/45">
                      No featured image
                    </div>
                  )}
                </div>
                <div className="space-y-3 p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-ink/45">
                    {product.handle}
                  </p>
                  <h2 className="font-display text-xl font-bold uppercase leading-tight tracking-[0.08em] text-ink">
                    {product.title}
                  </h2>
                  <div className="grid gap-3 border-t border-ink/10 pt-4 text-sm text-ink/65">
                    <p>
                      <span className="font-semibold text-ink">Price:</span>{" "}
                      {price
                        ? formatMoney(price.amount, price.currencyCode)
                        : "No price returned"}
                    </p>
                    <p>
                      <span className="font-semibold text-ink">Availability:</span>{" "}
                      {product.availableForSale ? "Available" : "Unavailable"}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function sanitizeErrors(errors = []) {
  return errors.map((error) => ({
    message: error.message,
    path: error.path,
    locations: error.locations,
    extensions: error.extensions
  }));
}

function formatMoney(amount, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency
  }).format(Number(amount));
}
