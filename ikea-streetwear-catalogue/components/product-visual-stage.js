import Image from "next/image";

export function ProductVisualStage({ product }) {
  const images = product.images?.length
    ? product.images
    : product.image
      ? [{ url: product.image, altText: product.imageAlt }]
      : [];
  const heroImage = images[0];

  return (
    <div className="border border-ink/10 bg-white p-4">
      <div className="relative mx-auto aspect-[4/5] max-h-[620px] max-w-[520px] overflow-hidden bg-mist">
        {heroImage?.url ? (
          <Image
            src={heroImage.url}
            alt={heroImage.altText || product.name}
            fill
            priority
            className="p-8 object-contain"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center px-6 text-center text-sm uppercase tracking-[0.18em] text-ink/45">
            Shopify product image
          </div>
        )}
      </div>

      <div className="-mx-4 mt-4 overflow-x-auto px-4 pb-1">
        <div className="flex min-w-max gap-3">
          {images.slice(0, 8).map((image, index) => (
            <div
              key={`${image.url}-${index}`}
              className="relative h-28 w-24 shrink-0 border border-ink/10 bg-paper sm:h-32 sm:w-28"
            >
              <Image
                src={image.url}
                alt={image.altText || product.name}
                fill
                className="p-3 object-contain"
                unoptimized
              />
            </div>
          ))}
          {!images.length ? (
            <div className="flex h-28 w-24 shrink-0 items-center justify-center border border-dashed border-ink/15 bg-paper px-3 text-center text-[10px] uppercase tracking-[0.16em] text-ink/38 sm:h-32 sm:w-28">
              Image slot
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
