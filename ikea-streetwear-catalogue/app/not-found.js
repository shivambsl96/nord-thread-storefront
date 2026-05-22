import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-coral">
        Missing product
      </p>
      <h1 className="mt-4 font-display text-5xl font-bold uppercase tracking-[0.08em] text-ink">
        Page not found
      </h1>
      <p className="mt-5 text-base leading-7 text-ink/65">
        The product or page you requested does not exist in the current catalogue.
      </p>
      <Link
        href="/catalogue"
        className="mt-8 inline-flex border border-ink bg-white px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-ink shadow-[inset_0_-4px_0_#ffcf3f] transition hover:bg-paper"
      >
        Return to catalogue
      </Link>
    </div>
  );
}
