import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { ProductDetailClient } from "@/components/product-detail-client";
import { ProductStorySections } from "@/components/product-story-sections";
import { getProductByHandle, getRelatedProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { handle } = await params;
  const product = await getProductByHandle(handle);

  if (!product) {
    return { title: "Product not found | Nord Thread" };
  }

  return {
    title: `${product.name} | Nord Thread`,
    description: product.description
  };
}

export default async function ProductDetailPage({ params }) {
  const { handle } = await params;
  const product = await getProductByHandle(handle);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product);

  return (
    <div className="bg-paper">
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <Link
          href="/catalogue"
          className="text-xs font-semibold uppercase tracking-[0.22em] text-ink/55"
        >
          Back to catalogue
        </Link>

        <ProductDetailClient product={product} />

        <ProductStorySections product={product} />

        <section className="mt-14">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-coral">
                Related styles
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold uppercase tracking-[0.08em] text-ink">
                More in this state
              </h2>
            </div>
          </div>
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </section>
      </section>
    </div>
  );
}
