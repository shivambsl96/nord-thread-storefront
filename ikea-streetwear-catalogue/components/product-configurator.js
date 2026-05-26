"use client";

import { useState } from "react";
import { useCart } from "@/components/cart-provider";

export function ProductConfigurator({ product, selectedOptions, selectedVariant, onOptionChange }) {
  const [justAdded, setJustAdded] = useState(false);
  const { addItem, error, isUpdating, itemCount, reward } = useCart();
  const selectableOptions = (product.options ?? []).filter(
    (option) => !(option.name === "Title" && option.values.length === 1 && option.values[0] === "Default Title")
  );

  return (
    <div className="border border-ink/10 bg-white p-5">
      <div className="flex items-start justify-between gap-4 border-b border-ink/10 pb-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-coral">
            Pick your mood.
          </p>
          <p className="mt-2 text-sm leading-6 text-ink/60">
            Stay lowkey.
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
            Single finish.
          </div>
        )}

        <button
          type="button"
          disabled={!selectedVariant?.availableForSale || isUpdating}
          onClick={async () => {
            await addItem(product, { variantId: selectedVariant.id });
            setJustAdded(true);
          }}
          className="w-full border border-ink bg-white px-5 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-ink shadow-[inset_0_-4px_0_#ffcf3f] transition hover:bg-paper disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isUpdating ? "Adding..." : "Add to cart"}
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
                : "Added. Quietly locked in."}
            </p>
          </div>
        ) : null}

        {itemCount > 0 && !reward.unlocked && reward.nextTier ? (
          <p className="text-xs uppercase tracking-[0.18em] text-ink/45">
            Add {formatPieceCount(reward.nextTier.quantity - itemCount)} to unlock a{" "}
            {reward.nextTier.percentage}% gratitude reward.
          </p>
        ) : null}
      </div>
    </div>
  );
}

function formatPieceCount(count) {
  return `${count} ${count === 1 ? "piece" : "pieces"}`;
}

function hasMatchingVariant(variants, nextOptions) {
  return variants.some((variant) =>
    variant.selectedOptions.every((option) => nextOptions[option.name] === option.value)
  );
}

function formatMoney(amount, currency = "INR") {
  return new Intl.NumberFormat(currency === "INR" ? "en-IN" : "en-US", {
    style: "currency",
    currency
  }).format(Number(amount));
}
