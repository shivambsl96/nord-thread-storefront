import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-ink/10 bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <p className="font-display text-xl font-bold uppercase tracking-[0.16em] text-ink">
            Nord Threads
          </p>
          <p className="mt-3 max-w-sm text-sm leading-6 text-ink/65">
            Soft chaos. Clean fits. Made for quiet wins.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-ink">
            Browse
          </p>
          <div className="mt-3 flex flex-col gap-2 text-sm text-ink/65">
            <Link href="/catalogue">All Products</Link>
            <Link href="/collections">Collections</Link>
            <Link href="/about">About the Brand</Link>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-ink">
            Notes
          </p>
          <p className="mt-3 text-sm leading-6 text-ink/65">
            Low noise. High intent. Built for better days.
          </p>
        </div>
      </div>
    </footer>
  );
}
