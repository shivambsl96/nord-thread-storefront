"use client";

import { useCart } from "@/components/cart-provider";

export function CartStatus() {
  const { itemCount, setIsDrawerOpen } = useCart();

  return (
    <button
      type="button"
      onClick={() => setIsDrawerOpen(true)}
      className="flex items-center gap-3 border border-ink/10 bg-white px-3 py-2 text-left transition hover:border-ink/25"
    >
      <span className="inline-flex h-9 min-w-9 items-center justify-center border border-ink/10 bg-white px-2 text-xs font-semibold uppercase tracking-[0.14em] text-ink shadow-[inset_0_-2px_0_#ffcf3f]">
        {itemCount}
      </span>
      <span className="hidden sm:block">
        <span className="block text-[10px] font-semibold uppercase tracking-[0.22em] text-ink/45">
          Cart
        </span>
        <span className="block text-sm uppercase tracking-[0.14em] text-ink">
          Wardrobe
        </span>
      </span>
    </button>
  );
}
