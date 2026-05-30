import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { getCollections, getFeaturedProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featuredProducts, collectionCards] = await Promise.all([
    getFeaturedProducts(3),
    getCollections()
  ]);

  return (
    <div>
      <section className="catalogue-shell soft-pattern border-b border-ink/10">
        <div className="home-hero-grid mx-auto grid max-w-7xl gap-7 px-4 py-8 sm:px-6 lg:grid-cols-[0.5fr,1.5fr] lg:px-8 lg:py-10">
          <aside className="flex flex-col justify-between gap-6 lg:sticky lg:top-28 lg:self-start">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-coral">
                Soft chaos. Clean fits.
              </p>
              <h1 className="mt-3 font-display text-3xl font-bold uppercase leading-[0.95] tracking-[0.05em] text-ink sm:text-4xl">
                Wear the mood.
                <br />
                Stay lowkey.
              </h1>
              <p className="mt-3 max-w-md text-sm leading-6 text-ink/68">
                Low noise. High intent. Tees for better days.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <Link
                href="/catalogue"
                className="inline-flex items-center justify-center border border-ink bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-ink shadow-[inset_0_-3px_0_#ffcf3f] transition hover:bg-paper"
              >
                Browse Catalogue
              </Link>
              <Link
                href="/collections"
                className="inline-flex items-center justify-center border border-ink/15 bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-ink transition hover:border-ink"
              >
                View Collections
              </Link>
            </div>

            <div className="space-y-3 border-t border-ink/10 pt-5">
              <MiniStat label="This season" value="Quiet wins" />
              <MiniStat label="Products" value={String(featuredProducts.length).padStart(2, "0")} />
              <MiniStat label="Collections" value={String(collectionCards.length).padStart(2, "0")} />
            </div>
          </aside>

          <div>
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-coral">
                  Featured products
                </p>
                <h2 className="mt-2 font-display text-2xl font-bold uppercase tracking-[0.08em] text-ink sm:text-3xl">
                  Quietly locked in
                </h2>
              </div>
              <Link
                href="/catalogue"
                className="hidden text-xs font-semibold uppercase tracking-[0.18em] text-ink sm:block"
              >
                Shop all products
              </Link>
            </div>

            {featuredProducts.length ? (
              <div className="grid gap-5 md:grid-cols-3">
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
              title="Subtle reward"
              text="A small thanks when your cart grows."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="flex items-baseline justify-between gap-5">
      <p className="text-[10px] uppercase tracking-[0.22em] text-ink/45">{label}</p>
      <p className="font-display text-lg font-bold uppercase leading-tight tracking-[0.08em] text-ink">
        {value}
      </p>
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
