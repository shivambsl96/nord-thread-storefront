"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/components/cart-provider";
import { CartStatus } from "@/components/cart-status";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/catalogue", label: "Catalogue" },
  { href: "/collections", label: "Collections" },
  { href: "/about", label: "About" }
];

export function SiteHeader() {
  const pathname = usePathname();
  const { setIsDrawerOpen } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    if (isMenuOpen) {
      return;
    }

    function handleScroll() {
      const currentScrollY = window.scrollY;
      const isScrollingDown = currentScrollY > lastScrollY.current;
      const hasMovedEnough = Math.abs(currentScrollY - lastScrollY.current) > 8;

      if (hasMovedEnough) {
        setIsHeaderHidden(isScrollingDown && currentScrollY > 96);
        lastScrollY.current = currentScrollY;
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMenuOpen]);

  function openCartFromMenu() {
    setIsMenuOpen(false);
    setIsDrawerOpen(true);
  }

  function toggleMenu() {
    setIsHeaderHidden(false);
    setIsMenuOpen((isOpen) => !isOpen);
  }

  return (
    <header
      className={`sticky top-0 z-50 border-b border-ink/10 bg-paper/90 backdrop-blur transition duration-300 lg:translate-y-0 ${
        isHeaderHidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8 lg:py-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center bg-accent font-display text-base font-bold uppercase tracking-[0.2em] text-ink lg:h-11 lg:w-11 lg:text-lg">
            NT
          </span>
          <div>
            <p className="font-display text-base font-bold uppercase tracking-[0.16em] text-ink lg:text-lg">
              Nord Threads
            </p>
            <p className="hidden text-xs uppercase tracking-[0.24em] text-ink/55 sm:block">
              Mindful Wardrobe
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <nav className="hidden flex-wrap items-center justify-end gap-2 text-sm uppercase tracking-[0.16em] text-ink/70 lg:flex">
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
          <button
            type="button"
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            onClick={toggleMenu}
            className="inline-flex h-11 w-11 items-center justify-center border border-ink/10 bg-white text-ink transition hover:border-ink/25 lg:hidden"
          >
            <span className="grid gap-1.5">
              <span
                className={`block h-px w-5 bg-ink transition ${
                  isMenuOpen ? "translate-y-[3px] rotate-45" : ""
                }`}
              />
              <span
                className={`block h-px w-5 bg-ink transition ${
                  isMenuOpen ? "-translate-y-[3px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      <div
        className={`overflow-hidden border-t border-ink/10 bg-paper/95 transition-all duration-300 lg:hidden ${
          isMenuOpen ? "max-h-[calc(100vh-68px)] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="mx-auto grid max-w-7xl gap-2 px-4 py-5 sm:px-6">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center justify-between border px-4 py-4 font-display text-xl font-bold uppercase tracking-[0.12em] transition ${
                  isActive
                    ? "border-ink bg-white text-ink shadow-[inset_0_-3px_0_#ffcf3f]"
                    : "border-ink/10 bg-white/70 text-ink hover:border-ink/30"
                }`}
              >
                {item.label}
                <span className="text-sm">-&gt;</span>
              </Link>
            );
          })}
          <button
            type="button"
            onClick={openCartFromMenu}
            className="flex items-center justify-between border border-ink/10 bg-white/70 px-4 py-4 text-left font-display text-xl font-bold uppercase tracking-[0.12em] text-ink transition hover:border-ink/30"
          >
            Cart
            <span className="text-sm">-&gt;</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
