import { CatalogueClient } from "@/components/catalogue-client";
import { SectionHeading } from "@/components/section-heading";
import { getCatalogueFilters, getProducts } from "@/lib/products";

export const metadata = {
  title: "Catalogue | Nord Threads",
  description: "Browse the full Nord Threads product catalogue."
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
        description="Find your fit. Pick your mood."
      />

      <div className="mt-10">
        <CatalogueClient products={products} filters={filters} />
      </div>
    </div>
  );
}
