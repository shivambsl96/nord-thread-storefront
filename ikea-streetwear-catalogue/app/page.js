import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { getCollections, getFeaturedProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featuredProducts, collectionCards] = await Promise.all([
    getFeaturedProducts(6),
    getCollections()
  ]);

  return (
    <div>
      <section className="catalogue-shell soft-pattern border-b border-ink/10">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div>
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-coral">
                  Featured products
                </p>
                <h1 className="mt-2 max-w-3xl font-display text-4xl font-bold uppercase leading-[0.95] tracking-[0.07em] text-ink sm:text-5xl lg:text-6xl">
                  Quietly locked in
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-ink/62 sm:text-base">
                  Low noise. High intent. Clean tees for better days.
                </p>
              </div>
              <Link
                href="/catalogue"
                className="inline-flex w-fit border border-ink bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-ink shadow-[inset_0_-3px_0_#ffcf3f] transition hover:bg-paper"
              >
                Shop all products
              </Link>
            </div>

            {featuredProducts.length ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                {featuredProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} priority={index < 2} compact />
                ))}
              </div>
            ) : (
              <EmptyShopifyState />
            )}
          </div>
        </div>
      </section>

      <section className="border-y border-ink/10 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.28fr,1fr] lg:px-8 lg:py-14">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-coral">
              Collections
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold uppercase tracking-[0.08em] text-ink">
              Pick your mood
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {collectionCards.map((collection) => (
              <Link
                key={collection.id}
                href={`/collections/${collection.handle}`}
                className={`soft-pattern ${collection.surfaceClass} border border-ink/10 p-4 transition duration-300 hover:-translate-y-1 hover:shadow-card`}
              >
                <div className={`h-1.5 w-16 ${collection.accentClass}`} />
                <h3 className="mt-4 font-display text-xl font-bold uppercase tracking-[0.08em] text-ink">
                  {collection.name}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-ink/65">{collection.shortStory}</p>
                <p className="mt-3 text-xs uppercase tracking-[0.18em] text-ink/48">
                  {collection.mood}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-5 lg:grid-cols-[1.05fr,0.95fr]">
          <div className="soft-pattern surface-stillness border border-ink/10 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-coral">
              Low noise
            </p>
            <h2 className="mt-4 font-display text-3xl font-bold uppercase leading-tight tracking-[0.06em] text-ink">
              Built for better days.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-ink/68">
              Soft graphics. Clean fits. Everyday reset energy.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <LifestyleTile
              title="Morning clarity"
              text="Clean starts. Less noise."
            />
            <LifestyleTile
              title="Quiet confidence"
              text="Simple pieces that still hit."
            />
            <LifestyleTile
              title="Intentional rotation"
              text="Easy tees. Better days."
            />
            <LifestyleTile
              title="Conscious rotation"
              text="Pieces made with intention."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function EmptyShopifyState() {
  return (
    <div className="mt-8 border border-dashed border-ink/20 bg-white px-6 py-10">
      <p className="font-display text-2xl font-bold uppercase tracking-[0.08em] text-ink">
        Products are loading
      </p>
      <p className="mt-3 max-w-xl text-sm leading-6 text-ink/62">
        New pieces will land here soon.
      </p>
    </div>
  );
}

function LifestyleTile({ title, text }) {
  return (
    <article className="border border-ink/10 bg-white p-5 transition duration-300 hover:-translate-y-1 hover:shadow-card">
      <h3 className="font-display text-xl font-bold uppercase tracking-[0.08em] text-ink">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-7 text-ink/65">{text}</p>
    </article>
  );
}
