import Image from "next/image";
import Link from "next/link";
import { getCollections } from "@/lib/products";

export const metadata = {
  title: "Collections | Nord Threads",
  description: "Emotional collection and inspiration page for Nord Threads."
};

export const dynamic = "force-dynamic";

export default async function CollectionsPage() {
  const collections = await getCollections();
  const featuredCollection = collections.find((collection) => collection.products?.length) ?? collections[0];
  const supportingCollections = collections.filter((collection) => collection.handle !== featuredCollection?.handle);

  return (
    <div>
      <section className="catalogue-shell soft-pattern border-b border-ink/10 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.42fr,1fr] lg:px-8 lg:py-14">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-coral">
              Collections
            </p>
            <h1 className="mt-4 font-display text-4xl font-bold uppercase leading-[0.92] tracking-[0.07em] text-ink sm:text-5xl">
              Pick your mood.
            </h1>
          </div>
          <p className="max-w-2xl text-base leading-8 text-ink/68 lg:pt-8">
            Live edits from Shopify, arranged as emotional states. Some are ready to shop now,
            others are quiet rooms waiting for their first pieces.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        {collections.length ? (
          <div className="space-y-5">
            {featuredCollection ? (
              <Link
                href={`/collections/${featuredCollection.handle}`}
                className={`${featuredCollection.surfaceClass} soft-pattern grid gap-6 border border-ink/10 p-5 transition duration-300 hover:-translate-y-1 hover:shadow-card lg:grid-cols-[0.9fr,1.1fr] lg:p-6`}
              >
                <CollectionCopy collection={featuredCollection} large />
                <CollectionPreview collection={featuredCollection} />
              </Link>
            ) : null}

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {supportingCollections.map((collection) => (
                <Link
                  key={collection.id}
                  href={`/collections/${collection.handle}`}
                  className={`${collection.surfaceClass} soft-pattern flex min-h-[280px] flex-col border border-ink/10 p-5 transition duration-300 hover:-translate-y-1 hover:shadow-card`}
                >
                  <CollectionCopy collection={collection} />
                  <div className="mt-auto pt-5">
                    <CollectionPreview collection={collection} compact />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-10 border border-dashed border-ink/20 bg-white px-6 py-10">
            <p className="font-display text-2xl font-bold uppercase tracking-[0.08em] text-ink">
              Collections are loading
            </p>
            <p className="mt-3 max-w-xl text-sm leading-6 text-ink/62">
              New edits land here soon.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

function CollectionCopy({ collection, large = false }) {
  const productCount = collection.products?.length ?? 0;

  return (
    <div>
      <div className={`h-2 ${large ? "w-32" : "w-20"} ${collection.accentClass}`} />
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ink/50">
          {collection.name}
        </p>
        <p className="border border-ink/10 bg-white/55 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink/48">
          {productCount ? `${productCount} ${productCount === 1 ? "piece" : "pieces"}` : "Building soon"}
        </p>
      </div>
      <h2 className={`${large ? "text-4xl sm:text-5xl" : "text-2xl"} mt-4 font-display font-bold uppercase leading-tight tracking-[0.08em] text-ink`}>
        {collection.symbol}
      </h2>
      <p className={`${large ? "max-w-xl text-base" : "text-sm"} mt-4 leading-7 text-ink/65`}>
        {collection.shortStory}
      </p>
      <p className="mt-4 text-xs uppercase tracking-[0.18em] text-ink/48">
        {collection.mood}
      </p>
    </div>
  );
}

function CollectionPreview({ collection, compact = false }) {
  const products = (collection.products ?? []).slice(0, compact ? 2 : 3);

  if (!products.length) {
    return (
      <div className="flex h-full min-h-28 items-center justify-center border border-dashed border-ink/15 bg-white/35 px-4 py-6 text-center text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">
        Pieces landing soon
      </div>
    );
  }

  return (
    <div className={`grid ${compact ? "grid-cols-2" : "grid-cols-3"} gap-3`}>
      {products.map((product) => (
        <div key={product.id} className="relative aspect-[4/5] border border-ink/10 bg-white/55">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.imageAlt || product.name}
              fill
              className="p-3 object-contain"
              unoptimized
            />
          ) : null}
        </div>
      ))}
    </div>
  );
}
