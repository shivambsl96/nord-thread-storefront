import Image from "next/image";

export function ProductVisualStage({ product }) {
  const secondaryImages = product.images?.slice(1, 4) ?? [];

  return (
    <div className="group sticky top-24">
      <div className="soft-pattern border border-ink/10 bg-white p-4">
        <div className="relative overflow-hidden border border-ink/10 bg-mist [perspective:1200px]">
          <div className="absolute inset-6 border border-ink/10" />
          <div className="relative aspect-[4/5] transition duration-700 ease-out [transform-style:preserve-3d] group-hover:[transform:rotateY(-7deg)_rotateX(4deg)_translateY(-6px)]">
            <div className="absolute inset-8 bg-white/55 shadow-[0_28px_70px_rgba(17,17,17,0.16)] [transform:translateZ(-28px)]" />
            {product.image ? (
              <Image
                src={product.image}
                alt={product.imageAlt || product.name}
                fill
                priority
                className="p-8 object-contain drop-shadow-[0_24px_32px_rgba(17,17,17,0.14)]"
                unoptimized
              />
            ) : (
              <div className="flex h-full items-center justify-center px-6 text-center text-sm uppercase tracking-[0.18em] text-ink/45">
                Shopify product image
              </div>
            )}
          </div>
        </div>
      </div>

      {secondaryImages.length ? (
        <div className="mt-4 grid grid-cols-3 gap-3">
          {secondaryImages.map((image) => (
            <div key={image.url} className="relative aspect-square border border-ink/10 bg-white">
              <Image
                src={image.url}
                alt={image.altText || product.name}
                fill
                className="p-3 object-contain"
                unoptimized
              />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
