"use client";

import Image from "next/image";

export function ProductVisualStage({ product, images: visibleImages, selectedImageUrl, onSelectImage }) {
  const images = visibleImages?.length
    ? visibleImages
    : product.images?.length
      ? product.images
    : product.image
      ? [{ url: product.image, altText: product.imageAlt }]
      : [];
  const selectedIndex = Math.max(
    0,
    images.findIndex((image) => image.url === selectedImageUrl)
  );
  const heroImage =
    images[selectedIndex] ??
    images.find((image) => image.url === product.image) ??
    images[0];

  function selectOffset(offset) {
    if (!images.length) {
      return;
    }

    const currentIndex = selectedIndex >= 0 ? selectedIndex : 0;
    const nextIndex = (currentIndex + offset + images.length) % images.length;
    onSelectImage(images[nextIndex].url);
  }

  return (
    <div className="border border-ink/10 bg-white p-4">
      <div className="relative mx-auto aspect-[4/5] max-h-[560px] max-w-[500px] overflow-hidden bg-mist">
        {heroImage?.url ? (
          <Image
            src={heroImage.url}
            alt={heroImage.altText || product.name}
            fill
            priority
            className="p-6 object-contain transition duration-500 ease-out sm:p-8"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center px-6 text-center text-sm uppercase tracking-[0.18em] text-ink/45">
            Product image
          </div>
        )}

        {images.length > 1 ? (
          <div className="absolute inset-x-3 top-1/2 flex -translate-y-1/2 justify-between">
            <button
              type="button"
              onClick={() => selectOffset(-1)}
              className="border border-ink/10 bg-white/88 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-ink shadow-sm backdrop-blur transition hover:bg-white"
              aria-label="Previous product image"
            >
              Prev
            </button>
            <button
              type="button"
              onClick={() => selectOffset(1)}
              className="border border-ink/10 bg-white/88 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-ink shadow-sm backdrop-blur transition hover:bg-white"
              aria-label="Next product image"
            >
              Next
            </button>
          </div>
        ) : null}
      </div>

      <div className="-mx-4 mt-4 overflow-x-auto px-4 pb-1">
        <div className="flex min-w-max gap-3">
          {images.map((image, index) => (
            <button
              key={`${image.url}-${index}`}
              type="button"
              onClick={() => onSelectImage(image.url)}
              className={`relative h-24 w-20 shrink-0 border bg-paper transition sm:h-28 sm:w-24 ${
                heroImage?.url === image.url
                  ? "border-ink shadow-[inset_0_-3px_0_#ffcf3f]"
                  : "border-ink/10 hover:border-ink/45"
              }`}
              aria-label={`Show product image ${index + 1}`}
            >
              <Image
                src={image.url}
                alt={image.altText || product.name}
                fill
                className="p-3 object-contain"
                unoptimized
              />
            </button>
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
