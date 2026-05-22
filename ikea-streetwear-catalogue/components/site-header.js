"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CartStatus } from "@/components/cart-status";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/catalogue", label: "Catalogue" },
  { href: "/collections", label: "Collections" },
  { href: "/about", label: "About" }
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center bg-accent font-display text-lg font-bold uppercase tracking-[0.2em] text-ink">
            NT
          </span>
          <div>
            <p className="font-display text-lg font-bold uppercase tracking-[0.16em] text-ink">
              Nord Thread
            </p>
            <p className="text-xs uppercase tracking-[0.24em] text-ink/55">
              Mindful Wardrobe
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <nav className="flex flex-wrap items-center justify-end gap-2 text-sm uppercase tracking-[0.16em] text-ink/70">
            {navItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full border px-3 py-2 transition ${
                    isActive
                      ? "border-ink/15 bg-white text-ink shadow-[inset_0_-2px_0_#ffcf3f]"
                      : "border-transparent hover:border-ink/10 hover:bg-white hover:text-ink"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <CartStatus />
        </div>
      </div>
    </header>
  );
}
