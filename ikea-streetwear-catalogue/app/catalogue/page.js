import { CatalogueClient } from "@/components/catalogue-client";
import { SectionHeading } from "@/components/section-heading";
import { getCatalogueFilters, getProducts } from "@/lib/products";

export const metadata = {
  title: "Catalogue | Nord Thread",
  description: "Browse the full Nord Thread product catalogue."
};

export const dynamic = "force-dynamic";

export default async function CataloguePage() {
  const products = await getProducts();
  const filters = getCatalogueFilters(products);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <SectionHeading
        eyebrow="All products"
        title="Catalogue"
        description="A mobile-first product grid with category, search, size, color, and price filters. Clean enough to feel premium, fast enough to browse like a catalogue."
      />

      <div className="mt-10">
        <CatalogueClient products={products} filters={filters} />
      </div>
    </div>
  );
}
