export function ProductStorySections({ product }) {
  const sections = [
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
  ];

  return (
    <section className="mt-12 border-y border-ink/10 bg-white py-8">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {sections.map((section) => (
          <article key={section.label} className="border border-ink/10 bg-paper p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-coral">
              {section.label}
            </p>
            {/* Replace this fallback copy with Shopify metafields when content schema is ready. */}
            <p className="mt-4 text-sm leading-7 text-ink/65">{section.value}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
