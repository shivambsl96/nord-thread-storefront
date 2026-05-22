import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { ProductConfigurator } from "@/components/product-configurator";
import { getProductBySlug, getProducts, getRelatedProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ slug: product.handle }));
}

export async function generateMetadata({ params }) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    return { title: "Product not found | Nord Thread" };
  }

  return {
    title: `${product.name} | Nord Thread`,
    description: product.description
  };
}

export default async function ProductDetailPage({ params }) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <Link
        href="/catalogue"
        className="text-xs font-semibold uppercase tracking-[0.22em] text-ink/55"
      >
        Back to catalogue
      </Link>

      <section className="mt-5 grid gap-8 lg:grid-cols-[1fr,1fr]">
        <div className={`soft-pattern ${getSurfaceClass(product.backgroundTheme)} border border-ink/10`}>
          <div className="relative aspect-[4/5]">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.imageAlt || product.name}
                fill
                className="p-8 object-contain"
                priority
                unoptimized
              />
            ) : (
              <div className="flex h-full items-center justify-center px-6 text-center text-sm uppercase tracking-[0.18em] text-ink/45">
                No Shopify image
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-coral">
              {product.collection}
            </p>
            <h1 className="mt-3 font-display text-3xl font-bold uppercase leading-tight tracking-[0.08em] text-ink sm:text-4xl">
              {product.name}
            </h1>
            <p className="mt-3 text-xs uppercase tracking-[0.2em] text-ink/45">
              {product.mood} / {product.artDirection}
            </p>
            <p className="mt-4 max-w-xl text-base leading-7 text-ink/65">
              {product.description}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <InfoCard label="Collection" value={product.collection} />
            <InfoCard label="Material" value={product.material} />
            <InfoCard label="Fit" value={product.fit} />
          </div>

          <ProductConfigurator product={product} />

          <div className="border border-ink/10 bg-paper p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-coral">
              Product notes
            </p>
            <ul className="mt-4 grid gap-3 text-sm leading-6 text-ink/68 sm:grid-cols-2">
              {product.details.map((detail) => (
                <li key={detail} className="border border-ink/10 bg-white px-4 py-3">
                  {detail}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

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
    </div>
  );
}

function getSurfaceClass(theme) {
  return {
    focus: "surface-focus",
    peace: "surface-peace",
    discipline: "surface-discipline",
    manifest: "surface-manifest",
    stillness: "surface-stillness",
    growth: "surface-growth"
  }[theme] ?? "bg-mist";
}

function InfoCard({ label, value }) {
  return (
    <div className="border border-ink/10 bg-paper p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-ink/45">{label}</p>
      <p className="mt-2 text-sm font-semibold uppercase tracking-[0.14em] text-ink">{value}</p>
    </div>
  );
}
