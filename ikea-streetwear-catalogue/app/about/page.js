import { SectionHeading } from "@/components/section-heading";

const principles = [
  "Product first. Always.",
  "Clean grid. Clear space.",
  "Low noise. High intent.",
  "No fake deep stuff."
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
        title="Soft chaos. Clean fits."
        description="Premium tees for better days. Simple as that."
      />

      <div className="mt-10 grid gap-5 lg:grid-cols-[1fr,1fr]">
        <section className="border border-ink/10 bg-white p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-coral">
            Positioning
          </p>
          <p className="mt-4 text-base leading-8 text-ink/68">
            Wear the mood. Keep it lowkey. Feel good. Look clean.
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
