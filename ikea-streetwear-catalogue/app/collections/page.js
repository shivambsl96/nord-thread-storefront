import Link from "next/link";
import { SectionHeading } from "@/components/section-heading";
import { getCollections } from "@/lib/products";

export const metadata = {
  title: "Collections | Nord Thread",
  description: "Emotional collection and inspiration page for Nord Thread."
};

export const dynamic = "force-dynamic";

export default async function CollectionsPage() {
  const collections = await getCollections();

  return (
    <div>
      <section className="soft-pattern border-b border-ink/10 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <SectionHeading
            eyebrow="Collections"
            title="Mood-led wardrobe themes"
            description="These collections are emotional directions rather than clothing categories. Each one keeps the same design discipline while shifting the internal feeling."
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        {collections.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {collections.map((collection) => (
              <Link
                key={collection.id}
                href={`/collections/${collection.handle}`}
                className={`${collection.surfaceClass} soft-pattern border border-ink/10 p-5 transition duration-300 hover:-translate-y-1 hover:shadow-card`}
              >
                <div className={`h-3 w-28 ${collection.accentClass}`} />
                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.22em] text-ink/50">
                  {collection.name}
                </p>
                <h2 className="mt-3 font-display text-2xl font-bold uppercase leading-tight tracking-[0.08em] text-ink">
                  {collection.symbol}
                </h2>
                <p className="mt-4 text-sm leading-7 text-ink/65">{collection.shortStory}</p>
                <p className="mt-4 text-xs uppercase tracking-[0.18em] text-ink/48">
                  {collection.mood}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-10 border border-dashed border-ink/20 bg-white px-6 py-10">
            <p className="font-display text-2xl font-bold uppercase tracking-[0.08em] text-ink">
              Shopify collections will appear here
            </p>
            <p className="mt-3 max-w-xl text-sm leading-6 text-ink/62">
              Create collections in Shopify and expose them to the Storefront API to fill
              this page with live collection data.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
