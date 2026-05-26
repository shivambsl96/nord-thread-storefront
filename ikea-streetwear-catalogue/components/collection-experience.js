import Link from "next/link";
import { ProductCard } from "@/components/product-card";

export function CollectionExperience({ collection, collections }) {
  const products = collection.products ?? [];
  const textColor = collection.textColor || "#111111";
  const themeColor = collection.themeColor || "#fcfcf8";
  const softThemeColor = `color-mix(in srgb, ${themeColor} 38%, #fcfcf8)`;

  return (
    <div
      className="min-h-screen transition-colors duration-500"
      style={{
        color: textColor,
        backgroundColor: softThemeColor
      }}
    >
      <section
        className="soft-pattern border-b border-ink/10"
        style={{
          color: textColor,
          backgroundColor: themeColor,
          backgroundImage: `linear-gradient(135deg, ${themeColor} 0%, rgba(255,255,255,0.64) 100%), url("${collection.backgroundPattern}")`,
          backgroundSize: "cover, 320px 320px"
        }}
      >
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/collections"
              className="w-fit border border-current/20 bg-white/30 px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] backdrop-blur-sm transition hover:bg-white/45"
            >
              Collections
            </Link>
            <a
              href="#collection-products"
              className="w-fit border border-current bg-white/35 px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] shadow-[inset_0_-4px_0_rgba(255,207,63,0.72)] backdrop-blur-sm transition hover:bg-white/50"
            >
              Explore pieces
            </a>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-[0.92fr,1.08fr] lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] opacity-65">
                Collection
              </p>
              <h1 className="mt-5 font-display text-5xl font-bold uppercase leading-[0.9] tracking-[0.06em] sm:text-6xl lg:text-7xl">
                {collection.name}
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 opacity-72">
                {collection.story}
              </p>
              <div className="mt-7 flex flex-wrap gap-2">
                {(collection.moodWords ?? []).map((word) => (
                  <span
                    key={word}
                    className="border border-current/20 bg-white/25 px-3 py-2 text-xs uppercase tracking-[0.18em] backdrop-blur-sm"
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>

            <div className="border border-current/15 bg-white/30 p-5 backdrop-blur-sm">
              <div className="border border-current/10 bg-white/55 p-6">
                <p className="text-xs uppercase tracking-[0.22em] opacity-55">
                  {collection.shortSubtitle}
                </p>
                <p className="mt-6 font-display text-4xl font-bold uppercase leading-none tracking-[0.08em]">
                  {collection.symbol}
                </p>
                <p className="mt-8 max-w-sm text-sm leading-7 opacity-70">
                  Future hero asset: {collection.heroImage}
                </p>
              </div>
            </div>
          </div>

          <div className="-mx-4 mt-10 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            <div className="flex min-w-max gap-3">
              {collections.map((item) => {
                const isSelected = item.handle === collection.handle;

                return (
                  <Link
                    key={item.handle}
                    href={`/collections/${item.handle}`}
                    className={`w-52 border bg-white/35 p-4 text-left backdrop-blur-sm transition hover:bg-white/50 ${
                      isSelected ? "border-current shadow-card" : "border-current/15"
                    }`}
                  >
                    <p className="text-[10px] uppercase tracking-[0.22em] opacity-50">
                      {String(item.sortOrder).padStart(2, "0")}
                    </p>
                    <h2 className="mt-4 font-display text-2xl font-bold uppercase tracking-[0.08em]">
                      {item.name}
                    </h2>
                    <p className="mt-3 line-clamp-2 text-xs leading-5 opacity-65">
                      {item.shortSubtitle}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section
        id="collection-products"
        className="text-ink"
        style={{
          backgroundColor: softThemeColor
        }}
      >
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="mb-7 flex flex-col gap-3 border-b border-ink/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-coral">
                Collection pieces
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-[0.08em] text-ink">
                {collection.name}
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-ink/58">
              A focused edit for this mood.
            </p>
          </div>

          {products.length ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-ink/20 bg-white px-6 py-10">
              <p className="font-display text-2xl font-bold uppercase tracking-[0.08em] text-ink">
                Almost ready
              </p>
              <p className="mt-3 max-w-xl text-sm leading-6 text-ink/62">
                Pieces for <span className="font-semibold">{collection.name}</span> land here soon.
              </p>
            </div>
          )}
        </div>
      </section>

      <a
        href="#collection-products"
        className="fixed bottom-5 right-5 z-30 border border-ink bg-white/90 px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-ink shadow-[inset_0_-4px_0_#ffcf3f,0_12px_28px_rgba(17,17,17,0.12)] backdrop-blur-sm transition hover:bg-white"
      >
        {products.length ? "View collection" : "Explore pieces"}
      </a>
    </div>
  );
}
