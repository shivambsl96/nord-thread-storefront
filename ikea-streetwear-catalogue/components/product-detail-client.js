"use client";

import { useMemo, useState } from "react";
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
    <div className="product-page mt-7 space-y-14 lg:mt-9 lg:space-y-16">
      <section className="product-detail-hero grid gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(380px,0.92fr)] lg:items-start lg:gap-14">
        <div className="product-gallery-column min-w-0">
          <ProductVisualStage
            product={product}
            images={galleryImages}
            selectedImageUrl={selectedImageUrl}
            onSelectImage={setSelectedImageUrl}
          />
        </div>

        <div className="product-purchase-panel min-w-0 lg:sticky lg:top-28">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-coral">
            {product.collection}
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-3xl font-bold uppercase leading-[0.94] tracking-[0.07em] text-ink sm:text-4xl xl:text-5xl">
            {product.name}
          </h1>
          <div className="mt-5">
            <p className="text-xl font-semibold uppercase tracking-[0.14em] text-ink">
              {formatMoney(selectedVariant?.price ?? product.price, selectedVariant?.currency ?? product.currency)}
            </p>
            {selectedVariant?.compareAtPrice || product.compareAtPrice ? (
              <p className="mt-1 text-xs uppercase tracking-[0.14em] text-ink/38 line-through">
                {formatMoney(selectedVariant?.compareAtPrice || product.compareAtPrice, product.currency)}
              </p>
            ) : null}
          </div>

          {(product.hook || product.inspiration) ? (
            <div className="my-7 border-y border-ink/10 py-6">
              {product.hook ? (
                <figure>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-coral">
                    Hook
                  </p>
                  <blockquote className="mt-3 max-w-xl text-balance font-display text-2xl font-bold uppercase leading-[0.98] tracking-[0.05em] text-ink sm:text-3xl">
                    {product.hook}
                  </blockquote>
                </figure>
              ) : null}

              {product.inspiration ? (
                <div className={product.hook ? "mt-6" : ""}>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-coral">
                    Inspiration
                  </p>
                  <p className="mt-3 max-w-xl text-base leading-7 text-ink/68">
                    {product.inspiration}
                  </p>
                </div>
              ) : null}
            </div>
          ) : null}

          <ProductConfigurator
            product={product}
            selectedOptions={selectedOptions}
            selectedVariant={selectedVariant}
            onOptionChange={updateOption}
          />
        </div>
      </section>

      <section className="product-story-section border-t border-ink/10 pt-10">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-coral">
          Details
        </p>
        <MainDescription text={product.mainDescription || product.description} />
      </section>

      <ProductStorySections product={product} />
    </div>
  );
}

function MainDescription({ text }) {
  const blocks = cleanDescriptionBlocks(splitDescriptionBlocks(text));

  if (!blocks.length) {
    return null;
  }

  const [opening, ...rest] = blocks;

  return (
    <div className="mt-5 grid gap-8 lg:grid-cols-[minmax(260px,0.5fr),minmax(0,0.75fr)] lg:gap-14">
      <p className="max-w-xl font-display text-2xl font-bold uppercase leading-tight tracking-[0.06em] text-ink sm:text-3xl">
        {opening}
      </p>
      <div className="max-w-3xl space-y-4 text-base leading-8 text-ink/72">
        {rest.map((block, index) =>
          isBulletLine(block) ? (
            <div
              key={`${block}-${index}`}
              className="grid grid-cols-[1.5rem,1fr] items-start gap-2 text-sm leading-7 text-ink/70"
            >
              <span aria-hidden className="text-coral">
                {extractBullet(block)}
              </span>
              <span>{stripBullet(block)}</span>
            </div>
          ) : (
            <p key={`${block}-${index}`}>{block}</p>
          )
        )}
      </div>
    </div>
  );
}

function splitDescriptionBlocks(text = "") {
  return String(text)
    .split(/\n+/)
    .map((block) => block.trim())
    .filter(Boolean);
}

function cleanDescriptionBlocks(blocks = []) {
  return blocks
    .map((block) => stripDecorativeSymbols(block))
    .filter((block) => block && !isDecorativeOnly(block));
}

function isBulletLine(value = "") {
  return /^(•|-|\*)\s*/u.test(value.trim());
}

function extractBullet(value = "") {
  const match = value.trim().match(/^(•|-|\*)/u);
  return match?.[0] === "-" || match?.[0] === "*" ? "•" : match?.[0] || "•";
}

function stripBullet(value = "") {
  return stripDecorativeSymbols(value).replace(/^(•|-|\*)\s*/u, "");
}

function stripDecorativeSymbols(value = "") {
  return String(value)
    .replace(/^[\s✨⭐✦✧✶✷✸✹❋❊•*-]+/u, "")
    .trim();
}

function isDecorativeOnly(value = "") {
  return /^[\s✨⭐✦✧✶✷✸✹❋❊•*-]+$/u.test(String(value).trim());
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
