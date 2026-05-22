import Link from "next/link";
import { SectionHeading } from "@/components/section-heading";
import { ProductCard } from "@/components/product-card";
import { getCollections, getFeaturedProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featuredProducts, collectionCards] = await Promise.all([
    getFeaturedProducts(4),
    getCollections()
  ]);

  return (
    <div>
      <section className="catalogue-shell soft-pattern border-b border-ink/10">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 md:py-14 lg:grid-cols-[1.15fr,0.85fr] lg:px-8 lg:py-16">
          <div className="flex flex-col justify-between gap-7">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-coral">
                Calm Scandinavian wardrobe
              </p>
              <h1 className="mt-4 font-display text-4xl font-bold uppercase leading-[0.95] tracking-[0.05em] text-ink sm:text-5xl lg:text-6xl">
                Wear your mindset.
                <br />
                Keep the noise low.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-ink/68">
                Nord Thread turns self-improvement into a calmer wardrobe language:
                precise layouts, clean silhouettes, and collections built around how you
                want to feel rather than how loud you want to look.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/catalogue"
                className="inline-flex items-center justify-center border border-ink bg-white px-6 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-ink shadow-[inset_0_-4px_0_#ffcf3f] transition hover:bg-paper"
              >
                Browse Catalogue
              </Link>
              <Link
                href="/collections"
                className="inline-flex items-center justify-center border border-ink/15 bg-white px-6 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-ink transition hover:border-ink"
              >
                View Collections
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="soft-pattern border border-ink/10 bg-white p-5 sm:col-span-2">
              <p className="text-xs uppercase tracking-[0.2em] text-ink/45">This season</p>
              <div className="mt-5 grid gap-4 sm:grid-cols-[1.2fr,0.8fr]">
                <div className="surface-focus p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ink/60">
                    Focus
                  </p>
                  <p className="mt-3 font-display text-2xl font-bold uppercase leading-tight tracking-[0.08em] text-ink">
                    Premium pieces for quieter ambition
                  </p>
                </div>
                <div className="grid gap-4">
                  <div className="border border-ink/10 bg-paper p-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-ink/45">
                      Products
                    </p>
                    <p className="mt-3 font-display text-4xl font-bold uppercase tracking-[0.06em] text-ink">
                      {String(featuredProducts.length).padStart(2, "0")}
                    </p>
                  </div>
                  <div className="border border-ink/10 bg-white p-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-ink/45">
                      Collections
                    </p>
                    <p className="mt-3 font-display text-4xl font-bold uppercase tracking-[0.06em] text-ink">
                      {String(collectionCards.length).padStart(2, "0")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="surface-peace border border-ink/10 p-5 transition duration-300 hover:-translate-y-1">
              <p className="text-xs uppercase tracking-[0.2em] text-ink/50">Mood</p>
              <p className="mt-3 font-display text-xl font-bold uppercase leading-tight tracking-[0.08em] text-ink">
                Focused, calm,
                <br />
                emotionally premium
              </p>
            </div>
            <div className="soft-pattern border border-ink/10 bg-white p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-ink/50">Wardrobe note</p>
              <p className="mt-3 text-sm leading-7 text-ink/68">
                The catalogue still leads with product, pricing, and fit clarity, but the
                emotional tone is softer, wiser, and less performative.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Featured products"
            title="A calmer edit"
            description="A first-pass product selection for people who want their wardrobe to feel intentional, useful, and visually quiet."
          />
          <Link
            href="/catalogue"
            className="text-sm font-semibold uppercase tracking-[0.18em] text-ink"
          >
            Shop all products
          </Link>
        </div>

        {featuredProducts.length ? (
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {featuredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} priority={index < 2} />
            ))}
          </div>
        ) : (
          <EmptyShopifyState />
        )}
      </section>

      <section className="border-y border-ink/10 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <SectionHeading
            eyebrow="Collections"
            title="Emotional collections"
            description="Each collection holds a different internal tone while preserving the same catalogue grid, spacing, and premium restraint."
          />
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {collectionCards.map((collection) => (
              <Link
                key={collection.id}
                href={`/collections/${collection.handle}`}
                className={`soft-pattern ${collection.surfaceClass} border border-ink/10 p-5 transition duration-300 hover:-translate-y-1 hover:shadow-card`}
              >
                <div className={`h-2 w-24 ${collection.accentClass}`} />
                <h3 className="mt-5 font-display text-2xl font-bold uppercase tracking-[0.08em] text-ink">
                  {collection.name}
                </h3>
                <p className="mt-3 text-sm leading-7 text-ink/65">{collection.shortStory}</p>
                <p className="mt-4 text-xs uppercase tracking-[0.18em] text-ink/48">
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
              Mindful wardrobe
            </p>
            <h2 className="mt-4 font-display text-3xl font-bold uppercase leading-tight tracking-[0.06em] text-ink">
              Dress for the state you want to return to.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-ink/68">
              These pieces are not designed as loud declarations. They are cues:
              reminders to stay steady, stay soft, stay attentive, and keep your inner
              environment uncluttered.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <LifestyleTile
              title="Morning clarity"
              text="Minimal typography, open space, and clean silhouettes for focused starts."
            />
            <LifestyleTile
              title="Quiet confidence"
              text="Premium construction and calm symbolism instead of aggressive status signals."
            />
            <LifestyleTile
              title="Intentional rotation"
              text="A compact wardrobe language that still feels expressive and emotionally alive."
            />
            <LifestyleTile
              title="Subtle reward"
              text="The brand appreciation system appears only after adding to cart, keeping the storefront premium first."
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
        Connect Shopify to populate products
      </p>
      <p className="mt-3 max-w-xl text-sm leading-6 text-ink/62">
        Add the Storefront API environment variables and Shopify will become the source of
        truth for products, images, collections, prices, variants, and availability.
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
