import Image from "next/image";
import Link from "next/link";

export function ProductCard({ product, priority = false }) {
  return (
    <article className="group flex h-full flex-col border border-ink/10 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-card">
      <Link
        href={`/products/${product.handle}`}
        className={`relative block overflow-hidden ${getSurfaceClass(product.backgroundTheme)}`}
      >
        <div className="absolute left-4 top-4 z-10 bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-ink backdrop-blur-sm">
          {product.collection}
        </div>
        <div className="relative aspect-[4/5]">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.imageAlt || product.name}
              fill
              priority={priority}
              className="p-6 object-contain transition duration-700 group-hover:scale-[1.025]"
              unoptimized
            />
          ) : (
            <div className="flex h-full items-center justify-center px-6 text-center text-xs uppercase tracking-[0.18em] text-ink/45">
              No Shopify image
            </div>
          )}
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs uppercase tracking-[0.2em] text-ink/45">{product.category}</p>
            <p className="text-[11px] uppercase tracking-[0.2em] text-ink/38">{product.mood}</p>
          </div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-display text-lg font-bold uppercase leading-tight tracking-[0.08em] text-ink">
                {product.name}
              </h3>
              <p className="mt-2 text-sm leading-6 text-ink/65">{product.tagline}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.18em] text-ink/45">
                {product.artDirection}
              </p>
            </div>
            <p className="whitespace-nowrap text-sm font-semibold uppercase tracking-[0.14em] text-ink">
              {formatMoney(product.price, product.currency)}
            </p>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-ink/10 pt-4">
          <p className="text-xs uppercase tracking-[0.2em] text-ink/45">
            {product.sizes.join(" / ")}
          </p>
          <Link
            href={`/products/${product.handle}`}
            className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-ink"
          >
            View
            <span aria-hidden>↗</span>
          </Link>
        </div>
      </div>
    </article>
  );
}

function formatMoney(amount, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency
  }).format(Number(amount));
}

function getSurfaceClass(theme) {
  return {
    focus: "surface-focus",
    peace: "surface-peace",
    discipline: "surface-discipline",
    manifest: "surface-manifest",
    stillness: "surface-stillness",
    growth: "surface-growth"
  }[theme] ?? "bg-mist";
}
