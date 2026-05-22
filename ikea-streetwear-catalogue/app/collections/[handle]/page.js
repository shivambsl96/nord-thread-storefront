import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { getCollectionByHandle, getCollections } from "@/lib/products";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const collections = await getCollections();
  return collections.map((collection) => ({ handle: collection.handle }));
}

export async function generateMetadata({ params }) {
  const { handle } = await params;
  const collection = await getCollectionByHandle(handle);

  if (!collection) {
    return { title: "Collection not found | Nord Thread" };
  }

  return {
    title: `${collection.name} | Nord Thread`,
    description: collection.description
  };
}

export default async function CollectionDetailPage({ params }) {
  const { handle } = await params;
  const collection = await getCollectionByHandle(handle);

  if (!collection) {
    notFound();
  }

  return (
    <div>
      <section className={`${collection.surfaceClass} soft-pattern border-b border-ink/10`}>
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
          <Link
            href="/collections"
            className="text-xs font-semibold uppercase tracking-[0.22em] text-ink/55"
          >
            Back to collections
          </Link>
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr,0.9fr] lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-coral">
                Mindful collection
              </p>
              <h1 className="mt-4 font-display text-4xl font-bold uppercase leading-[0.95] tracking-[0.06em] text-ink sm:text-5xl lg:text-6xl">
                {collection.name}
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-ink/68">
                {collection.story}
              </p>
            </div>
            <div className="border border-ink/10 bg-white/70 p-5 backdrop-blur-sm">
              <div className={`h-2 w-24 ${collection.accentClass}`} />
              <p className="mt-5 font-display text-2xl font-bold uppercase leading-tight tracking-[0.08em] text-ink">
                {collection.symbol}
              </p>
              <p className="mt-4 text-sm leading-7 text-ink/65">{collection.mood}</p>
              <p className="mt-5 text-xs uppercase tracking-[0.18em] text-ink/45">
                {collection.isPlaceholder
                  ? "Placeholder collection"
                  : "Products from Shopify collection order"}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="mb-6 flex flex-col gap-3 border-b border-ink/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ink/45">
              Collection products
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold uppercase tracking-[0.08em] text-ink">
              {collection.products?.length ?? 0} pieces
            </h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-ink/58">
            Product images, prices, variants, and availability are synced from Shopify.
          </p>
        </div>

        {collection.products?.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {collection.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-ink/20 bg-white px-6 py-10">
            <p className="font-display text-2xl font-bold uppercase tracking-[0.08em] text-ink">
              {collection.isPlaceholder
                ? "Collection ready for Shopify products"
                : "No products in this collection"}
            </p>
            <p className="mt-3 max-w-xl text-sm leading-6 text-ink/62">
              {collection.isPlaceholder
                ? `Create a Shopify collection with the handle "${collection.handle}", or automate it with the product tag "collection:${collection.handle}". Products will appear here automatically.`
                : "Add products to this Shopify collection and expose them to the Storefront API to populate this page."}
            </p>
          </div>
        )}
      </section>

      <Link
        href="/catalogue"
        className="fixed bottom-5 right-5 z-30 border border-ink bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-ink shadow-[inset_0_-4px_0_#ffcf3f,0_12px_28px_rgba(17,17,17,0.12)] transition hover:-translate-y-0.5 hover:bg-paper"
      >
        View all products
      </Link>
    </div>
  );
}
