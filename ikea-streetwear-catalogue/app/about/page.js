import { SectionHeading } from "@/components/section-heading";

const principles = [
  "Product-first layout with quiet emotional storytelling",
  "Scandinavian whitespace and disciplined grid structure",
  "Flexible components prepared for Shopify cart and storefront work",
  "Minimal symbolism and mindful language without fake spirituality"
];

export const metadata = {
  title: "About | Nord Thread",
  description: "About the Nord Thread brand and design approach."
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <SectionHeading
        eyebrow="About the brand"
        title="Catalogue-minded self-improvement"
        description="Nord Thread imagines premium T-shirt merchandising through an IKEA-like lens, then softens it into a calmer lifestyle brand built around attention, emotional clarity, and daily intention."
      />

      <div className="mt-10 grid gap-5 lg:grid-cols-[1fr,1fr]">
        <section className="border border-ink/10 bg-white p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-coral">
            Positioning
          </p>
          <p className="mt-4 text-base leading-8 text-ink/68">
            The brand sits between premium streetwear, modern wellness, and introspective
            self-improvement. The interface stays bold, bright, and grid-led, but the
            emotional tone is calmer and more intelligent than standard ecommerce.
          </p>
        </section>

        <section className="border border-ink/10 bg-paper p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-coral">
            Principles
          </p>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-ink/68">
            {principles.map((principle) => (
              <li key={principle} className="border border-ink/10 bg-white px-4 py-3">
                {principle}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
