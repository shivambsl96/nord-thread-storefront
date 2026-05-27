"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ProductConfigurator } from "@/components/product-configurator";
import { ProductStorySections } from "@/components/product-story-sections";
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
  const selectedColor = selectedVariant?.color || selectedOptions.Color || selectedOptions.Colour || "";
  const galleryImages = useMemo(
    () => filterImagesForColor(product.images, selectedColor, selectedVariant?.image),
    [product.images, selectedColor, selectedVariant?.image]
  );
  const mainImageUrl = useMemo(
    () => resolveMainImageUrl(product, selectedVariant, selectedColor, galleryImages),
    [galleryImages, product, selectedColor, selectedVariant]
  );
  const [selectedImageUrl, setSelectedImageUrl] = useState(mainImageUrl);

  function updateOption(optionName, value) {
    const nextOptions = {
      ...selectedOptions,
      [optionName]: value
    };
    const nextVariant = findSelectedVariant(product.variants, nextOptions) ?? initialVariant;
    const nextColor = nextVariant?.color || nextOptions.Color || nextOptions.Colour || "";

    setSelectedOptions(nextOptions);
    setSelectedImageUrl(resolveMainImageUrl(product, nextVariant, nextColor));
  }

  return (
    <div className="mt-5 grid gap-7 lg:grid-cols-[minmax(320px,0.82fr),minmax(0,1fr)] lg:items-start">
      <ProductVisualStage
        product={product}
        images={galleryImages}
        selectedImageUrl={selectedImageUrl}
        onSelectImage={setSelectedImageUrl}
      />

      <div className="space-y-5">
        <div className="border border-ink/10 bg-white p-5 sm:p-6">
          <div className="flex flex-col gap-5 border-b border-ink/10 pb-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-coral">
                {product.collection}
              </p>
              <h1 className="mt-3 font-display text-4xl font-bold uppercase leading-[0.92] tracking-[0.07em] text-ink sm:text-5xl lg:text-6xl">
                {product.name}
              </h1>
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

          <figure className="mt-5 border-l-4 border-accent bg-paper px-5 py-5">
            <blockquote className="font-display text-2xl font-bold uppercase leading-tight tracking-[0.06em] text-ink sm:text-3xl">
              {product.hook}
            </blockquote>
          </figure>

          <div className="mt-6 border-b border-ink/10 pb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-coral">
              Story / Intention
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-ink/68">
              {product.productStory || product.designIntention}
            </p>
          </div>

          {product.collectionReferences?.length ? (
            <div className="mt-5">
              <p className="text-xs uppercase tracking-[0.18em] text-ink/45">
                Collections
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.collectionReferences.map((collection) => (
                  <Link
                    key={collection.id}
                    href={`/collections/${collection.handle}`}
                    className="border border-ink/10 bg-paper px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink/55 transition hover:border-ink"
                  >
                    {collection.title}
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <ProductConfigurator
          product={product}
          selectedOptions={selectedOptions}
          selectedVariant={selectedVariant}
          onOptionChange={updateOption}
        />

        <div className="border border-ink/10 bg-white p-5 sm:p-6">
          <ProductStorySections product={product} />
        </div>
      </div>
    </div>
  );
}

function findSelectedVariant(variants, selectedOptions) {
  return variants.find((variant) =>
    variant.selectedOptions.every((option) => selectedOptions[option.name] === option.value)
  );
}

function resolveMainImageUrl(product, variant, color, images = product.images ?? []) {
  if (variant?.image?.url) {
    return variant.image.url;
  }

  return findColorImage(images, color)?.url || product.image || images[0]?.url || "";
}

function filterImagesForColor(images = [], color, variantImage) {
  if (!color) {
    return images;
  }

  const filteredImages = images.filter(
    (image) => imageMatchesColor(image, color) || imageIsCommon(image)
  );

  if (variantImage?.url && !filteredImages.some((image) => image.url === variantImage.url)) {
    filteredImages.unshift(variantImage);
  }

  return filteredImages.length ? filteredImages : images;
}

function findColorImage(images = [], color) {
  if (!color) {
    return null;
  }

  return images.find((image) => imageMatchesColor(image, color));
}

function imageMatchesColor(image, color) {
  const colorTokens = tokenize(color);
  const imageTokens = tokenize(`${image?.altText ?? ""} ${fileNameFromUrl(image?.url)}`);

  return colorTokens.some((token) => imageTokens.includes(token));
}

function imageIsCommon(image) {
  const text = `${image?.altText ?? ""} ${fileNameFromUrl(image?.url)}`.toLowerCase();
  return ["size", "chart", "guide", "fit", "detail", "fabric", "label"].some((token) =>
    text.includes(token)
  );
}

function fileNameFromUrl(url = "") {
  return String(url).split("/").pop()?.split("?")[0] ?? "";
}

function tokenize(value = "") {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .split(" ")
    .filter(Boolean);
}

function formatMoney(amount, currency = "INR") {
  return new Intl.NumberFormat(currency === "INR" ? "en-IN" : "en-US", {
    style: "currency",
    currency
  }).format(Number(amount));
}
