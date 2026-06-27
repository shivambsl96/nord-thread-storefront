import Image from "next/image";
import Link from "next/link";

export function ProductCard({ product, priority = false, compact = false }) {
  return (
    <Link
      href={`/products/${product.handle}`}
      className="group flex h-full flex-col border border-ink/10 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-card"
    >
      <article className="flex h-full flex-col">
        <div className={`relative block overflow-hidden ${getSurfaceClass(product.backgroundTheme)}`}>
          <div className="absolute left-5 top-5 z-10 bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-ink backdrop-blur-sm">
            {product.collection}
          </div>
          <div className={`relative ${compact ? "aspect-[4/5]" : "aspect-[4/5] xl:aspect-[3/4]"}`}>
            {product.image ? (
              <Image
                src={product.image}
                alt={product.imageAlt || product.name}
                fill
                priority={priority}
                className="p-7 object-contain transition duration-700 group-hover:scale-[1.025]"
                unoptimized
              />
            ) : (
              <div className="flex h-full items-center justify-center px-6 text-center text-xs uppercase tracking-[0.18em] text-ink/45">
                Image soon
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-4 p-5">
          <div className="space-y-2">
            <div className={compact ? "hidden" : "flex items-center justify-between gap-3"}>
              <p className="text-xs uppercase tracking-[0.2em] text-ink/45">{product.category}</p>
              <p className="hidden text-[11px] uppercase tracking-[0.2em] text-ink/38 sm:block">{product.mood}</p>
            </div>
            <div>
              <h3 className="line-clamp-3 font-display text-lg font-bold uppercase leading-tight tracking-[0.08em] text-ink">
                {product.name}
              </h3>
              <p className="mt-3 text-sm font-semibold uppercase tracking-[0.14em] text-ink">
                {formatMoney(product.price, product.currency)}
              </p>
              {compact ? null : (
                <>
                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-ink/65">{product.tagline}</p>
                  <p className="mt-2 hidden text-xs uppercase tracking-[0.18em] text-ink/45 sm:line-clamp-1 sm:block">
                    {product.artDirection}
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="mt-auto flex items-center justify-between gap-3 border-t border-ink/10 pt-4">
            <p className={`text-xs uppercase tracking-[0.2em] text-ink/45 ${compact ? "hidden" : ""}`}>
              {product.sizes.join(" / ")}
            </p>
            <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-ink">
              View
              <span aria-hidden>↗</span>
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

function formatMoney(amount, currency = "INR") {
  return new Intl.NumberFormat(currency === "INR" ? "en-IN" : "en-US", {
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
