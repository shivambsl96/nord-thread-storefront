"use client";

import Image from "next/image";
import { useCart } from "@/components/cart-provider";

export function CartDrawer() {
  const {
    items,
    itemCount,
    subtotal,
    currency,
    checkout,
    checkoutUrl,
    error,
    isDrawerOpen,
    isUpdating,
    setIsDrawerOpen,
    removeItem,
    updateQuantity
  } = useCart();

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-ink/20 transition ${
          isDrawerOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsDrawerOpen(false)}
      />
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-ink/10 bg-paper shadow-card transition duration-300 ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-ink/10 px-5 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-coral">Cart</p>
            <p className="mt-1 text-sm text-ink/60">
              {itemCount === 0 ? "Your cart is empty." : `${formatPieceCount(itemCount)} selected`}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsDrawerOpen(false)}
            className="border border-ink/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-ink"
          >
            Close
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {items.length === 0 ? (
            <div className="surface-stillness border border-dashed border-ink/15 p-6 text-center">
              <p className="font-display text-2xl font-bold uppercase tracking-[0.08em] text-ink">
                Begin with one piece
              </p>
              <p className="mt-3 text-sm leading-6 text-ink/62">
                Pick your mood.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <article key={item.id} className="border border-ink/10 bg-white p-4">
                  <div className="flex gap-4">
                    <div className="relative h-24 w-20 shrink-0 overflow-hidden border border-ink/10 bg-mist">
                      {item.product.image ? (
                        <Image
                          src={item.product.image}
                          alt={item.product.imageAlt || item.product.name}
                          fill
                          className="p-2 object-contain"
                          unoptimized
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center px-2 text-center text-[10px] uppercase tracking-[0.12em] text-ink/45">
                          No image
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs uppercase tracking-[0.2em] text-ink/45">
                        {item.product.collection}
                      </p>
                      <h3 className="mt-1 font-display text-lg font-bold uppercase tracking-[0.06em] text-ink">
                        {item.product.name}
                      </h3>
                      <p className="mt-2 text-xs uppercase tracking-[0.18em] text-ink/55">
                        {item.variant.color} / {item.variant.size}
                      </p>
                      <div className="mt-4 flex items-center justify-between gap-3">
                        <div className="flex items-center border border-ink/10">
                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-3 py-2 text-sm"
                          >
                            -
                          </button>
                          <span className="min-w-10 px-2 text-center text-sm">{item.quantity}</span>
                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-3 py-2 text-sm"
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() => removeItem(item.id)}
                          className="text-xs font-semibold uppercase tracking-[0.16em] text-ink/55"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-ink/10 bg-white px-5 py-5">
          <div className="flex items-center justify-between text-sm uppercase tracking-[0.16em] text-ink">
            <span>Subtotal</span>
            <span>{formatMoney(subtotal, currency)}</span>
          </div>
          <p className="mt-3 text-sm leading-6 text-ink/60">
            Secure checkout opens next.
          </p>
          {error ? (
            <p className="mt-3 border border-coral/30 bg-paper px-4 py-3 text-sm leading-6 text-ink/68">
              {error}
            </p>
          ) : null}
          <button
            type="button"
            disabled={!checkoutUrl || isUpdating}
            onClick={checkout}
            className="mt-5 w-full border border-ink bg-white px-5 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-ink shadow-[inset_0_-4px_0_#ffcf3f] transition hover:bg-paper disabled:cursor-not-allowed disabled:opacity-50"
          >
            Checkout
          </button>
        </div>
      </aside>
    </>
  );
}

function formatPieceCount(count) {
  return `${count} ${count === 1 ? "piece" : "pieces"}`;
}

function formatMoney(amount, currency = "INR") {
  return new Intl.NumberFormat(currency === "INR" ? "en-IN" : "en-US", {
    style: "currency",
    currency
  }).format(Number(amount));
}
