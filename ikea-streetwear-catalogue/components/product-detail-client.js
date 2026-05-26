"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ProductConfigurator } from "@/components/product-configurator";
import { ProductVisualStage } from "@/components/product-visual-stage";

export function ProductDetailClient({ product }) {
  const initialVariant = product.variants.find((variant) => variant.availableForSale) ?? product.variants[0];
  const [selectedOptions, setSelectedOptions] = useState(() =>
    Object.fromEntries((initialVariant?.selectedOptions ?? []).map((option) => [option.name, option.value]))
  );
  const selectedVariant = useMemo(
    () => findSelectedVariant(product.variants, selectedOptions) ?? initialVariant,
    [initialVariant, product.variants, selectedOptions]
  );
  const [selectedImageUrl, setSelectedImageUrl] = useState(
    selectedVariant?.image?.url || product.image || ""
  );

  function updateOption(optionName, value) {
    const nextOptions = {
      ...selectedOptions,
      [optionName]: value
    };
    const nextVariant = findSelectedVariant(product.variants, nextOptions) ?? initialVariant;

    setSelectedOptions(nextOptions);
    setSelectedImageUrl(nextVariant?.image?.url || product.image || "");
  }

  return (
    <div className="mt-5 grid gap-8 lg:grid-cols-[minmax(0,0.92fr),minmax(360px,0.82fr)] lg:items-start">
      <ProductVisualStage
        product={product}
        selectedImageUrl={selectedImageUrl}
        onSelectImage={setSelectedImageUrl}
      />

      <div className="space-y-5 lg:sticky lg:top-24">
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
            <div className="whitespace-nowrap text-left sm:text-right">
              <p className="text-lg font-semibold uppercase tracking-[0.14em] text-ink">
                {formatMoney(selectedVariant?.price ?? product.price, selectedVariant?.currency ?? product.currency)}
              </p>
              {selectedVariant?.compareAtPrice || product.compareAtPrice ? (
                <p className="mt-1 text-xs uppercase tracking-[0.14em] text-ink/38 line-through">
                  {formatMoney(selectedVariant?.compareAtPrice || product.compareAtPrice, product.currency)}
                </p>
              ) : null}
            </div>
          </div>

          <p className="mt-5 max-w-2xl text-base leading-7 text-ink/66">
            {product.description}
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <InfoCard label="Availability" value={selectedVariant?.availableForSale ? "Available" : "Unavailable"} />
            <InfoCard label="Colors" value={product.colors.length ? product.colors.join(" / ") : "Shopify variant"} />
            <InfoCard label="Sizes" value={product.sizes.length ? product.sizes.join(" / ") : "Shopify variant"} />
          </div>

          {product.gsm || product.material ? (
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {product.material ? <InfoCard label="Material" value={product.material} /> : null}
              {product.gsm ? <InfoCard label="GSM" value={product.gsm} /> : null}
            </div>
          ) : null}

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

        <ProductConfigurator
          product={product}
          selectedOptions={selectedOptions}
          selectedVariant={selectedVariant}
          onOptionChange={updateOption}
        />
      </div>
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

function findSelectedVariant(variants, selectedOptions) {
  return variants.find((variant) =>
    variant.selectedOptions.every((option) => selectedOptions[option.name] === option.value)
  );
}

function formatMoney(amount, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency
  }).format(Number(amount));
}
