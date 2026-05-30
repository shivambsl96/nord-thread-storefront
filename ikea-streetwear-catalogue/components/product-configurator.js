"use client";

import { useState } from "react";
import { useCart } from "@/components/cart-provider";

export function ProductConfigurator({ product, selectedOptions, selectedVariant, onOptionChange }) {
  const [justAdded, setJustAdded] = useState(false);
  const { addItem, error, isUpdating } = useCart();
  const selectableOptions = (product.options ?? []).filter(
    (option) => !(option.name === "Title" && option.values.length === 1 && option.values[0] === "Default Title")
  );

  return (
    <div className="space-y-5">
      <div className="space-y-5">
        {selectableOptions.length ? (
          selectableOptions.map((option) => (
            <div key={option.id ?? option.name}>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink">
                {option.name}
              </p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {sortOptionValues(option).map((value) => {
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
                      className={`border px-3.5 py-2 text-sm uppercase tracking-[0.14em] transition disabled:cursor-not-allowed disabled:opacity-35 ${
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
          <div className="text-sm leading-6 text-ink/60">
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
          <div className="surface-peace p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-coral">
              Added with thanks
            </p>
            <p className="mt-2 text-sm leading-6 text-ink/68">
              Added. Quietly locked in.
            </p>
          </div>
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

function sortOptionValues(option) {
  if (!isSizeOption(option.name)) {
    return option.values;
  }

  return [...option.values].sort(compareSizes);
}

function isSizeOption(name = "") {
  return name.toLowerCase() === "size";
}

function compareSizes(left, right) {
  const sizeOrder = ["xxs", "xs", "s", "m", "l", "xl", "xxl", "xxxl"];
  const leftIndex = sizeOrder.indexOf(String(left).toLowerCase());
  const rightIndex = sizeOrder.indexOf(String(right).toLowerCase());

  if (leftIndex === -1 && rightIndex === -1) {
    return String(left).localeCompare(String(right), undefined, { numeric: true });
  }

  if (leftIndex === -1) return 1;
  if (rightIndex === -1) return -1;

  return leftIndex - rightIndex;
}
