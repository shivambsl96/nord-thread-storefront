"use client";

import { useState } from "react";
import { useCart } from "@/components/cart-provider";

export function ProductConfigurator({ product }) {
  const colorOption = product.options.find((option) => option.name.toLowerCase() === "color");
  const sizeOption = product.options.find((option) => option.name.toLowerCase() === "size");
  const [selectedColor, setSelectedColor] = useState(product.colors[0] ?? "");
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] ?? "");
  const [justAdded, setJustAdded] = useState(false);
  const { addItem, error, isUpdating, itemCount, reward } = useCart();
  const selectedVariant =
    product.variants.find((variant) =>
      variant.selectedOptions.every((option) => {
        if (option.name.toLowerCase() === "color") return option.value === selectedColor;
        if (option.name.toLowerCase() === "size") return option.value === selectedSize;
        return true;
      })
    ) ?? product.variants[0];

  return (
    <div className="border border-ink/10 bg-white p-5">
      <div className="flex items-start justify-between gap-4 border-b border-ink/10 pb-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-coral">
            Wardrobe selection
          </p>
          <p className="mt-2 text-sm leading-6 text-ink/60">
            Choose the size and color that best fits your daily rhythm. Availability and
            variants are synced from Shopify.
          </p>
        </div>
        <p className="text-lg font-semibold uppercase tracking-[0.14em] text-ink">
          {formatMoney(selectedVariant?.price ?? product.price, product.currency)}
        </p>
      </div>

      <div className="mt-5 space-y-5">
        {colorOption ? (
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink">
            Color
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {product.colors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedColor(color)}
                className={`border px-4 py-2 text-sm uppercase tracking-[0.14em] transition ${
                  selectedColor === color
                    ? "border-ink bg-white text-ink shadow-[inset_0_-3px_0_#ffcf3f]"
                    : "border-ink/15 bg-paper text-ink hover:border-ink"
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
        ) : null}

        {sizeOption ? (
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink">
            Size
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                className={`min-w-12 border px-4 py-2 text-sm uppercase tracking-[0.14em] transition ${
                  selectedSize === size
                    ? "border-ink bg-white text-ink shadow-[inset_0_-3px_0_#ffcf3f]"
                    : "border-ink/15 bg-paper text-ink hover:border-ink"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
        ) : null}

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="border border-ink/10 bg-paper p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-ink/45">Selected</p>
            <p className="mt-2 text-sm font-semibold uppercase tracking-[0.14em] text-ink">
              {selectedColor} / {selectedSize}
            </p>
          </div>
          <div className="border border-ink/10 bg-paper p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-ink/45">Availability</p>
            <p className="mt-2 text-sm font-semibold uppercase tracking-[0.14em] text-ink">
              {selectedVariant?.availableForSale ? "Available" : "Unavailable"}
            </p>
          </div>
        </div>

        <button
          type="button"
          disabled={!selectedVariant?.availableForSale || isUpdating}
          onClick={async () => {
            await addItem(product, { variantId: selectedVariant.id });
            setJustAdded(true);
          }}
          className="w-full border border-ink bg-white px-5 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-ink shadow-[inset_0_-4px_0_#ffcf3f] transition hover:bg-paper disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isUpdating ? "Adding..." : "Add to wardrobe"}
        </button>

        {error ? (
          <p className="border border-coral/30 bg-white px-4 py-3 text-sm leading-6 text-ink/68">
            {error}
          </p>
        ) : null}

        {justAdded ? (
          <div className="surface-peace border border-ink/10 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-coral">
              Added with thanks
            </p>
            <p className="mt-2 text-sm leading-6 text-ink/68">
              {reward.unlocked
                ? `You've unlocked a gratitude reward of ${reward.percentage}%.`
                : "Your piece has been added. Gratitude rewards appear quietly once your wardrobe grows."}
            </p>
          </div>
        ) : null}

        {itemCount > 0 && !reward.unlocked && reward.nextTier ? (
          <p className="text-xs uppercase tracking-[0.18em] text-ink/45">
            Add {reward.nextTier.quantity - itemCount} more piece
            {reward.nextTier.quantity - itemCount === 1 ? "" : "s"} to unlock a{" "}
            {reward.nextTier.percentage}% gratitude reward.
          </p>
        ) : null}
      </div>
    </div>
  );
}

function formatMoney(amount, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency
  }).format(Number(amount));
}
