"use client";

import Link from "next/link";
import { useState } from "react";
import { ProductCard } from "@/components/product-card";

export function CollectionExperience({ collection, collections }) {
  const [activeHandle, setActiveHandle] = useState(collection.handle);
  const activeCollection =
    collections.find((item) => item.handle === activeHandle) ?? collection;
  const products = collection.products ?? [];
  const textColor = activeCollection.textColor || "#111111";

  return (
    <div
      className="transition-colors duration-500"
      style={{
        color: textColor,
        backgroundColor: activeCollection.themeColor || "#fcfcf8"
      }}
    >
      <section
        className="soft-pattern relative flex min-h-[calc(100vh-72px)] items-stretch overflow-hidden border-b border-ink/10"
        style={{
          backgroundImage: `linear-gradient(135deg, ${activeCollection.themeColor || "#fcfcf8"} 0%, rgba(255,255,255,0.58) 100%), url("${activeCollection.backgroundPattern}")`,
          backgroundSize: "cover, 320px 320px"
        }}
      >
        <div className="mx-auto flex w-full max-w-7xl flex-col justify-between px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/collections"
              className="border border-current/20 bg-white/25 px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] backdrop-blur-sm transition hover:bg-white/40"
            >
              Collections
            </Link>
            <a
              href="#collection-products"
              className="hidden border border-current bg-white/30 px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] shadow-[inset_0_-4px_0_rgba(255,207,63,0.72)] backdrop-blur-sm transition hover:-translate-y-0.5 sm:inline-flex"
            >
              Explore pieces
            </a>
          </div>

          <div className="grid flex-1 gap-8 py-10 lg:grid-cols-[0.95fr,1.05fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] opacity-65">
                Selected state
              </p>
              <h1 className="mt-5 font-display text-5xl font-bold uppercase leading-[0.9] tracking-[0.06em] sm:text-6xl lg:text-7xl">
                {activeCollection.name}
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 opacity-72">
                {activeCollection.story}
              </p>
              <div className="mt-7 flex flex-wrap gap-2">
                {(activeCollection.moodWords ?? []).map((word) => (
                  <span
                    key={word}
                    className="border border-current/20 bg-white/25 px-3 py-2 text-xs uppercase tracking-[0.18em] backdrop-blur-sm"
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>

            <div className="mx-auto w-full max-w-lg [perspective:1200px]">
              <div className="relative aspect-[4/5] border border-current/15 bg-white/25 p-5 shadow-[0_30px_80px_rgba(17,17,17,0.16)] backdrop-blur-sm transition duration-700 [transform-style:preserve-3d] hover:[transform:rotateY(-8deg)_rotateX(5deg)_translateY(-8px)]">
                <div className="absolute inset-5 border border-current/15" />
                <div className="flex h-full flex-col justify-between border border-current/10 bg-white/55 p-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] opacity-55">
                      {activeCollection.shortSubtitle}
                    </p>
                    <p className="mt-6 font-display text-4xl font-bold uppercase leading-none tracking-[0.08em]">
                      {activeCollection.symbol}
                    </p>
                  </div>
                  <p className="max-w-sm text-sm leading-7 opacity-70">
                    Future hero asset: {activeCollection.heroImage}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="-mx-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            <div className="flex min-w-max items-end gap-3">
              {collections.map((item) => {
                const isSelected = item.handle === collection.handle;
                const isActive = item.handle === activeCollection.handle;

                return (
                  <Link
                    key={item.handle}
                    href={`/collections/${item.handle}`}
                    onMouseEnter={() => setActiveHandle(item.handle)}
                    onFocus={() => setActiveHandle(item.handle)}
                    onMouseLeave={() => setActiveHandle(collection.handle)}
                    className={`w-52 border bg-white/35 p-4 text-left backdrop-blur-sm transition duration-300 hover:-translate-y-2 ${
                      isActive ? "border-current shadow-card" : "border-current/15"
                    } ${isSelected ? "min-h-40" : "min-h-32 opacity-78"}`}
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

      <section id="collection-products" className="bg-paper text-ink">
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
              Product membership, order, prices, variants, and availability come from Shopify.
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
                Collection ready for Shopify products
              </p>
              <p className="mt-3 max-w-xl text-sm leading-6 text-ink/62">
                Create or populate the Shopify collection handle{" "}
                <span className="font-semibold">{collection.handle}</span>. Automated
                collections can use the tag{" "}
                <span className="font-semibold">collection:{collection.handle}</span>.
              </p>
            </div>
          )}
        </div>
      </section>

      <a
        href="#collection-products"
        className="fixed bottom-5 right-5 z-30 border border-ink bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-ink shadow-[inset_0_-4px_0_#ffcf3f,0_12px_28px_rgba(17,17,17,0.12)] transition hover:-translate-y-0.5 hover:bg-paper"
      >
        {products.length ? "View collection" : "Explore pieces"}
      </a>
    </div>
  );
}
