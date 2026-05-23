import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { ProductConfigurator } from "@/components/product-configurator";
import { ProductStorySections } from "@/components/product-story-sections";
import { ProductVisualStage } from "@/components/product-visual-stage";
import { getProductByHandle, getRelatedProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { handle } = await params;
  const product = await getProductByHandle(handle);

  if (!product) {
    return { title: "Product not found | Nord Thread" };
  }

  return {
    title: `${product.name} | Nord Thread`,
    description: product.description
  };
}

export default async function ProductDetailPage({ params }) {
  const { handle } = await params;
  const product = await getProductByHandle(handle);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product);

  return (
    <div className="bg-paper">
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <Link
          href="/catalogue"
          className="text-xs font-semibold uppercase tracking-[0.22em] text-ink/55"
        >
          Back to catalogue
        </Link>

        <div className="mt-5 grid gap-8 lg:grid-cols-[1.05fr,0.95fr] lg:items-start">
          <ProductVisualStage product={product} />

          <div className="space-y-5">
            <div className="border border-ink/10 bg-white p-5">
              <div className="flex flex-col gap-5 border-b border-ink/10 pb-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-coral">
                    {product.collection}
                  </p>
                  <h1 className="mt-3 font-display text-4xl font-bold uppercase leading-[0.95] tracking-[0.08em] text-ink sm:text-5xl">
                    {product.name}
                  </h1>
                  <p className="mt-3 text-xs uppercase tracking-[0.2em] text-ink/45">
                    {product.handle}
                  </p>
                </div>
                <p className="whitespace-nowrap text-lg font-semibold uppercase tracking-[0.14em] text-ink">
                  {formatMoney(product.price, product.currency)}
                </p>
              </div>

              <p className="mt-5 max-w-2xl text-base leading-7 text-ink/66">
                {product.description}
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <InfoCard label="Availability" value={product.availableForSale ? "Available" : "Unavailable"} />
                <InfoCard label="Colors" value={product.colors.length ? product.colors.join(" / ") : "Shopify variant"} />
                <InfoCard label="Sizes" value={product.sizes.length ? product.sizes.join(" / ") : "Shopify variant"} />
              </div>

              {product.collectionReferences?.length ? (
                <div className="mt-5 border border-ink/10 bg-paper p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-ink/45">
                    Shopify collections
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {product.collectionReferences.map((collection) => (
                      <Link
                        key={collection.id}
                        href={`/collections/${collection.handle}`}
                        className="border border-ink/10 bg-white px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink/55 transition hover:border-ink"
                      >
                        {collection.title}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}

              {product.tags.length ? (
                <div className="mt-5 flex flex-wrap gap-2">
                  {product.tags.slice(0, 8).map((tag) => (
                    <span
                      key={tag}
                      className="border border-ink/10 bg-paper px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-ink/48"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>

            <ProductConfigurator product={product} />
          </div>
        </div>

        <ProductStorySections product={product} />

        <section className="mt-14">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-coral">
                Related styles
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold uppercase tracking-[0.08em] text-ink">
                More in this state
              </h2>
            </div>
          </div>
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </section>
      </section>
    </div>
  );
}

function InfoCard({ label, value }) {
  return (
    <div className="border border-ink/10 bg-paper p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-ink/45">{label}</p>
      <p className="mt-2 text-sm font-semibold uppercase tracking-[0.12em] text-ink">
        {value}
      </p>
    </div>
  );
}

function formatMoney(amount, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency
  }).format(Number(amount));
}
