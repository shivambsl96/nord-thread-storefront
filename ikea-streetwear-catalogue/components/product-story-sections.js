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
    }
  ].filter((section, index, allSections) => {
    const value = normalizeText(section.value);
    return value && allSections.findIndex((item) => normalizeText(item.value) === value) === index;
  });

  if (!sections.length) return null;

  return (
    <section>
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-coral">
        Product notes
      </p>
      <div className="mt-4 grid gap-5">
        {sections.map((section) => (
          <article key={section.label} className="space-y-3 border-t border-ink/8 pt-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">
              {section.label}
            </p>
            <p className="text-sm leading-7 text-ink/76">
              {section.value}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

function normalizeText(value = "") {
  return String(value).replace(/\s+/g, " ").trim().toLowerCase();
}
