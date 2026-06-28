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
    () => filterImagesForColor(product.images, selectedColor, selectedVariant, product.variants),
    [product.images, product.variants, selectedColor, selectedVariant]
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
    setSelectedImageUrl(resolveMainImageUrl(product, nextVariant, nextColor, filterImagesForColor(product.images, nextColor, nextVariant, product.variants)));
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
                  <blockquote className="mt-3 max-w-xl text-balance font-display text-2xl font-bold uppercase leading-[0.98] tracking-[0.05em] text-ink sm:text-3xl">
                    {product.hook}
                  </blockquote>
                </figure>
              ) : null}

              {product.inspiration ? (
                <div className={product.hook ? "mt-6" : ""}>
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
        <div className="product-details-grid mt-5 grid gap-10 lg:grid-cols-[minmax(0,0.78fr)_minmax(300px,0.42fr)] lg:gap-14">
          <MainDescription text={product.mainDescription || product.description} />
          <ProductStorySections product={product} />
        </div>
      </section>
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
    <div className="grid gap-6">
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
  const namedColorImage = findColorImage(images, color);

  if (namedColorImage?.url) {
    return namedColorImage.url;
  }

  if (variant?.image?.url && imageBelongsToFilteredSet(variant.image, images)) {
    return variant.image.url;
  }

  return product.image || images[0]?.url || "";
}

function filterImagesForColor(images = [], color, variant, variants = []) {
  if (!color) {
    return images;
  }

  const colorNamedImages = images.filter((image) => imageMatchesColor(image, color));
  const commonImages = images.filter(imageIsCommon);
  const colorCode = variantImageColorCode(variant, variants);
  const codedImages = colorNamedImages.length
    ? []
    : images.filter((image) => imageMatchesColorCode(image, colorCode));
  const filteredImages = uniqueImages([...colorNamedImages, ...codedImages, ...commonImages]);
  const variantImage = variantImageIsTrustworthy(variant, variants) ? variant?.image : null;

  if (
    variantImage?.url &&
    !colorNamedImages.length &&
    !filteredImages.some((image) => image.url === variantImage.url)
  ) {
    filteredImages.unshift(variantImage);
  }

  return filteredImages.length ? filteredImages : images;
}

function uniqueImages(images = []) {
  const seen = new Set();

  return images.filter((image) => {
    if (!image?.url || seen.has(image.url)) {
      return false;
    }

    seen.add(image.url);
    return true;
  });
}

function findColorImage(images = [], color) {
  if (!color) {
    return null;
  }

  return images.find((image) => imageMatchesColor(image, color));
}

function imageMatchesColor(image, color) {
  const imageText = normalizedImageText(image);
  const colorPhrases = colorSearchPhrases(color);

  return colorPhrases.some((phrase) => textContainsPhrase(imageText, phrase));
}

function imageIsCommon(image) {
  const text = normalizedImageText(image);
  return ["size", "chart", "guide", "fit", "detail", "fabric", "label"].some((token) =>
    text.includes(token)
  );
}

function imageBelongsToFilteredSet(image, images = []) {
  return images.some((item) => item.url === image.url);
}

function variantImageIsTrustworthy(variant, variants = []) {
  if (!variant?.image?.url) {
    return false;
  }

  const colorsUsingImage = new Set(
    variants
      .filter((item) => item.image?.url === variant.image.url)
      .map((item) => item.color)
      .filter(Boolean)
  );

  return colorsUsingImage.size <= 1;
}

function variantImageColorCode(variant, variants = []) {
  if (!variantImageIsTrustworthy(variant, variants)) {
    return "";
  }

  return colorCodeFromImage(variant?.image);
}

function imageMatchesColorCode(image, colorCode) {
  return Boolean(colorCode) && colorCodeFromImage(image) === colorCode;
}

function colorCodeFromImage(image) {
  const text = `${image?.altText ?? ""} ${fileNameFromUrl(image?.url)}`;
  return text.match(/(?:^|[_\-\s])c[_\-\s]*(\d+)(?:[_\-\s.]|$)/i)?.[1] || "";
}

function normalizedImageText(image) {
  return normalizeSearchText(`${image?.altText ?? ""} ${fileNameFromUrl(image?.url)}`);
}

function fileNameFromUrl(url = "") {
  const fileName = String(url).split("/").pop()?.split("?")[0] ?? "";

  try {
    return decodeURIComponent(fileName);
  } catch {
    return fileName;
  }
}

function normalizeSearchText(value = "") {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function colorSearchPhrases(color = "") {
  const normalizedColor = normalizeSearchText(color);
  const words = normalizedColor.split(" ").filter(Boolean);
  const phrases = new Set([normalizedColor]);
  const compactColorNames = new Set(["pink", "blue", "green", "red", "black", "white", "beige", "cream", "lavender", "mint", "coral", "navy", "olive", "grey", "gray"]);

  if (normalizedColor.includes("pink")) phrases.add("pink");
  if (normalizedColor.includes("navy blue")) phrases.add("navy blue");
  if (normalizedColor.includes("baby blue")) phrases.add("baby blue");
  if (normalizedColor.includes("olive green")) phrases.add("olive green");
  if (normalizedColor.includes("bottle green")) phrases.add("bottle green");
  if (normalizedColor.includes("grey melange")) phrases.add("grey");
  if (normalizedColor.includes("gray melange")) phrases.add("gray");

  words
    .filter((word) => compactColorNames.has(word))
    .forEach((word) => phrases.add(word));

  return [...phrases].filter(Boolean);
}

function textContainsPhrase(text, phrase) {
  return new RegExp(`(^| )${escapeRegExp(phrase)}( |$)`, "i").test(text);
}

function escapeRegExp(value = "") {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function formatMoney(amount, currency = "INR") {
  return new Intl.NumberFormat(currency === "INR" ? "en-IN" : "en-US", {
    style: "currency",
    currency
  }).format(Number(amount));
}
