const principles = [
  {
    title: "Positivity Over Negativity",
    text: "Energy matters. The way you think, speak, and move through life shapes your reality over time."
  },
  {
    title: "Trust the Process",
    text: "Manifestation is not instant. Growth takes time. We believe in consistency, patience, and showing up."
  },
  {
    title: "Simplicity with Meaning",
    text: "Minimal design should still carry intention. Clean, wearable, timeless pieces with a deeper idea underneath."
  },
  {
    title: "Authentic Expression",
    text: "What you wear should feel personal. It should reflect your mindset, identity, and energy, not just trends."
  },
  {
    title: "Conscious Creation",
    text: "Through print-on-demand, we aim to reduce unnecessary waste by creating products only when they are ordered."
  },
  {
    title: "Community First",
    text: "More than customers, we want a community of people who think positively, grow continuously, and create better culture together."
  }
];

const communityPillars = [
  "positivity",
  "self-belief",
  "creativity",
  "conscious living",
  "modern spirituality",
  "personal growth"
];

export const metadata = {
  title: "About | Nord Thread",
  description: "About Nord Thread, a minimal streetwear brand built around mindset, intention, and positive culture."
};

export default function AboutPage() {
  return (
    <div className="bg-paper">
      <section className="catalogue-shell soft-pattern border-b border-ink/10">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr,1.1fr] lg:px-8 lg:py-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-coral">
              About the brand
            </p>
            <h1 className="mt-5 max-w-3xl font-display text-4xl font-bold uppercase leading-[0.92] tracking-[0.07em] text-ink sm:text-5xl lg:text-6xl">
              Mindset first.
              <br />
              Clothing second.
            </h1>
          </div>

          <div className="max-w-2xl space-y-5 text-base leading-8 text-ink/72 lg:pt-10">
            <p>
              We created this brand with a simple intention: to bring more positivity into everyday life.
            </p>
            <p>
              In a world surrounded by negativity, pressure, comparison, and noise, we wanted to build something calming,
              meaningful, and uplifting. More than clothing, this brand represents a mindset: believing in yourself,
              trusting the process, and choosing positive energy even during uncertain times.
            </p>
            <p>
              This brand is for people building their future quietly, patiently, and intentionally.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.42fr,1fr] lg:px-8 lg:py-16">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-coral">
            Origin
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold uppercase leading-tight tracking-[0.07em] text-ink">
            Not magic.
            <br />
            A way of moving.
          </h2>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <article className="border-t border-ink/10 pt-5">
            <p className="text-sm leading-8 text-ink/72">
              The idea was deeply personal. Over the years, I have experienced how manifestation, intention, and positive
              thinking can slowly shape reality. Not instantly, not magically, but gradually through consistency, belief,
              and mindset.
            </p>
          </article>
          <article className="border-t border-ink/10 pt-5">
            <p className="text-sm leading-8 text-ink/72">
              Many of the things I once imagined for myself are becoming real step by step, and that journey became the
              inspiration behind this brand.
            </p>
          </article>
        </div>
      </section>

      <section className="border-y border-ink/10 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.42fr,1fr] lg:px-8 lg:py-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-coral">
              Positioning
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold uppercase leading-tight tracking-[0.07em] text-ink">
              Minimal in appearance.
              <br />
              Powerful in message.
            </h2>
          </div>

          <div>
            <p className="max-w-3xl text-base leading-8 text-ink/72">
              We position ourselves at the intersection of modern streetwear, minimal design, and positive culture.
              Our aesthetic is clean, elevated, and understated, designed for everyday wear while carrying deeper meaning
              beneath the surface.
            </p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {communityPillars.map((pillar) => (
                <div
                  key={pillar}
                  className="border border-ink/10 bg-paper px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-ink/62"
                >
                  {pillar}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-coral">
              Principles
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold uppercase tracking-[0.07em] text-ink">
              What we stand for
            </h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-ink/60">
            Timeless pieces, intentional energy, and a quieter kind of self-belief.
          </p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {principles.map((principle) => (
            <article key={principle.title} className="soft-pattern border border-ink/10 bg-white p-5">
              <div className="h-1.5 w-16 bg-accent" />
              <h3 className="mt-5 font-display text-xl font-bold uppercase tracking-[0.08em] text-ink">
                {principle.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-ink/68">{principle.text}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
