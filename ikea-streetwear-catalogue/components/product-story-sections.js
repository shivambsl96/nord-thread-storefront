export function ProductStorySections({ product }) {
  const sections = [
    {
      label: "Fabric",
      value: product.fabricDetails
    },
    {
      label: "Fit",
      value: product.fitDetails
    },
    {
      label: "Care",
      value: product.careInstructions
    },
    {
      label: "Intent",
      value: product.designIntention || product.designInspiration
    }
  ].filter((section, index, allSections) => {
    const value = normalizeText(section.value);
    return value && allSections.findIndex((item) => normalizeText(item.value) === value) === index;
  });

  if (!sections.length) {
    return (
      <section className="border-t border-ink/10 pt-5">
        <div className="text-sm leading-7 text-ink/60">
          More details soon.
        </div>
      </section>
    );
  }

  return (
    <section className="border-t border-ink/10 pt-5">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-coral">
        Product details
      </p>
      <div className="mt-4 divide-y divide-ink/10 border-y border-ink/10">
        {sections.map((section) => (
          <article key={section.label} className="grid gap-2 py-4 sm:grid-cols-[120px,1fr]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">
              {section.label}
            </p>
            <p className="text-sm leading-7 text-ink/68">{section.value}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function normalizeText(value = "") {
  return String(value).replace(/\s+/g, " ").trim().toLowerCase();
}
