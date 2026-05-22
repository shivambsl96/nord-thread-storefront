"use client";

import { useState } from "react";
import { ProductCard } from "@/components/product-card";

const priceRanges = [
  { label: "All prices", value: "all" },
  { label: "Under $35", value: "under-35" },
  { label: "$35 to $45", value: "35-45" },
  { label: "$45 and above", value: "45-plus" }
];

export function CatalogueClient({ products, filters }) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSize, setSelectedSize] = useState("All");
  const [selectedColor, setSelectedColor] = useState("All");
  const [selectedPrice, setSelectedPrice] = useState("all");

  const term = search.trim().toLowerCase();

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      !term ||
      [product.name, product.tagline, product.category, product.collection]
        .join(" ")
        .toLowerCase()
        .includes(term);

    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    const matchesSize = selectedSize === "All" || product.sizes.includes(selectedSize);
    const matchesColor = selectedColor === "All" || product.colors.includes(selectedColor);
    const matchesPrice =
      selectedPrice === "all" ||
      (selectedPrice === "under-35" && product.price < 35) ||
      (selectedPrice === "35-45" && product.price >= 35 && product.price < 45) ||
      (selectedPrice === "45-plus" && product.price >= 45);

    return (
      matchesSearch &&
      matchesCategory &&
      matchesSize &&
      matchesColor &&
      matchesPrice
    );
  });

  return (
    <div className="flex flex-col items-stretch gap-8 lg:flex-row lg:items-start">
      <aside className="h-fit border border-ink/10 bg-white p-5 lg:w-72 lg:shrink-0">
        <div className="flex items-center justify-between gap-3 border-b border-ink/10 pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-coral">
              Filters
            </p>
            <p className="mt-1 text-sm text-ink/60">Fast catalogue browsing</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setSelectedCategory("All");
              setSelectedSize("All");
              setSelectedColor("All");
              setSelectedPrice("all");
            }}
            className="text-xs font-semibold uppercase tracking-[0.16em] text-ink/60 transition hover:text-ink"
          >
            Reset
          </button>
        </div>

        <div className="mt-5 space-y-5">
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-ink">
              Search
            </span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search tees, collections..."
              className="mt-2 w-full rounded-none border border-ink/15 bg-paper px-4 py-3 text-sm text-ink outline-none ring-0 placeholder:text-ink/35 focus:border-ink"
            />
          </label>

          <FilterSelect
            label="Category"
            value={selectedCategory}
            onChange={setSelectedCategory}
            options={["All", ...filters.categories]}
          />
          <FilterSelect
            label="Size"
            value={selectedSize}
            onChange={setSelectedSize}
            options={["All", ...filters.sizes]}
          />
          <FilterSelect
            label="Color"
            value={selectedColor}
            onChange={setSelectedColor}
            options={["All", ...filters.colors]}
          />
          <FilterSelect
            label="Price"
            value={selectedPrice}
            onChange={setSelectedPrice}
            options={priceRanges.map((range) => range.value)}
            labels={Object.fromEntries(priceRanges.map((range) => [range.value, range.label]))}
          />
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <div className="flex flex-col gap-3 border-y border-ink/10 bg-white px-5 py-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-coral">
              Sorted by relevance
            </p>
            <h3 className="mt-1 font-display text-2xl font-bold uppercase tracking-[0.08em] text-ink">
              {filteredProducts.length} styles found
            </h3>
          </div>
          <p className="max-w-lg text-sm leading-6 text-ink/60">
            Product data, variants, imagery, pricing, and availability are synced from
            Shopify Storefront API.
          </p>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="mt-6 border border-dashed border-ink/20 bg-white px-6 py-12 text-center">
            <p className="font-display text-2xl font-bold uppercase tracking-[0.08em] text-ink">
              No matches
            </p>
            <p className="mt-3 text-sm leading-6 text-ink/60">
              Try widening the filters or using a shorter search term.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function FilterSelect({ label, value, onChange, options, labels = {} }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-ink">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-none border border-ink/15 bg-paper px-4 py-3 text-sm text-ink outline-none focus:border-ink"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {labels[option] ?? option}
          </option>
        ))}
      </select>
    </label>
  );
}
