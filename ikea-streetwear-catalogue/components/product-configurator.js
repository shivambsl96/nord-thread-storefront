"use client";

import { useState } from "react";
import { useCart } from "@/components/cart-provider";

export function ProductConfigurator({ product, selectedOptions, selectedVariant, onOptionChange }) {
  const [justAdded, setJustAdded] = useState(false);
  const { addItem, error, isUpdating, itemCount, reward } = useCart();
  const selectableOptions = (product.options ?? []).filter(
    (option) => !(option.name === "Title" && option.values.length === 1 && option.values[0] === "Default Title")
  );
  const selectedLabel =
    selectedVariant?.selectedOptions?.map((option) => option.value).join(" / ") ||
    selectedVariant?.title ||
    "Default";

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
        {selectableOptions.length ? (
          selectableOptions.map((option) => (
            <div key={option.id ?? option.name}>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink">
                {option.name}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {option.values.map((value) => {
                  const isSelected = selectedOptions[option.name] === value;
                  const canSelect = hasMatchingVariant(product.variants, {
                    ...selectedOptions,
                    [option.name]: value
                  });

                  return (
                    <button
                      key={value}
                      type="button"
                      disabled={!canSelect}
                      onClick={() => onOptionChange(option.name, value)}
                      className={`border px-4 py-2 text-sm uppercase tracking-[0.14em] transition disabled:cursor-not-allowed disabled:opacity-35 ${
                        isSelected
                          ? "border-ink bg-white text-ink shadow-[inset_0_-3px_0_#ffcf3f]"
                          : "border-ink/15 bg-paper text-ink hover:border-ink"
                      }`}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <div className="border border-ink/10 bg-paper p-4 text-sm leading-6 text-ink/60">
            This product does not expose selectable Shopify variants yet.
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="border border-ink/10 bg-paper p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-ink/45">Selected</p>
            <p className="mt-2 text-sm font-semibold uppercase tracking-[0.14em] text-ink">
              {selectedLabel}
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

function hasMatchingVariant(variants, nextOptions) {
  return variants.some((variant) =>
    variant.selectedOptions.every((option) => nextOptions[option.name] === option.value)
  );
}

function formatMoney(amount, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency
  }).format(Number(amount));
}
