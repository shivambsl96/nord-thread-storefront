export function ProductStorySections({ product }) {
  const sections = [
    {
      label: "Product story",
      value: product.productStory
    },
    {
      label: "Fabric details",
      value: product.fabricDetails
    },
    {
      label: "Fit details",
      value: product.fitDetails
    },
    {
      label: "Design inspiration",
      value: product.designInspiration
    },
    {
      label: "Care instructions",
      value: product.careInstructions
    },
    {
      label: "Mood / intention",
      value: product.designIntention
    }
  ].filter((section, index, allSections) => {
    const value = normalizeText(section.value);
    return value && allSections.findIndex((item) => normalizeText(item.value) === value) === index;
  });

  if (!sections.length) {
    return (
      <section className="mt-12 border-y border-ink/10 bg-white py-8">
        <div className="border border-dashed border-ink/15 bg-paper p-5 text-sm leading-7 text-ink/60">
          Product details will appear here once Shopify descriptions or metafields are configured.
        </div>
      </section>
    );
  }

  return (
    <section className="mt-12 border-y border-ink/10 bg-white py-8">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sections.map((section) => (
          <article key={section.label} className="border border-ink/10 bg-paper p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-coral">
              {section.label}
            </p>
            <p className="mt-4 text-sm leading-7 text-ink/65">{section.value}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function normalizeText(value = "") {
  return String(value).replace(/\s+/g, " ").trim().toLowerCase();
}
