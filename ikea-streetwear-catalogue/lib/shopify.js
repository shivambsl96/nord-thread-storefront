import {
  metafieldsToContentMap,
  parseProductDescription,
  resolveProductContent
} from "@/lib/productContent";

const DEFAULT_API_VERSION = "2025-01";

const PRODUCT_CARD_FRAGMENT = `
  fragment ProductCard on Product {
    id
    handle
    title
    description
    descriptionHtml
    productType
    tags
    metafields(identifiers: [
      { namespace: "custom", key: "fabric_details" }
      { namespace: "custom", key: "fit_details" }
      { namespace: "custom", key: "design_inspiration" }
      { namespace: "custom", key: "care_instructions" }
      { namespace: "custom", key: "design_intention" }
      { namespace: "custom", key: "mood_intention" }
    ]) {
      namespace
      key
      value
      type
    }
    availableForSale
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      url
      altText
      width
      height
    }
    images(first: 8) {
      edges {
        node {
          url
          altText
          width
          height
        }
      }
    }
    options {
      id
      name
      values
    }
    variants(first: 100) {
      edges {
        node {
          id
          title
          availableForSale
          quantityAvailable
          selectedOptions {
            name
            value
          }
          price {
            amount
            currencyCode
          }
          image {
            url
            altText
          }
        }
      }
    }
    collections(first: 3) {
      edges {
        node {
          id
          handle
          title
        }
      }
    }
  }
`;

const COLLECTION_FRAGMENT = `
  fragment CollectionFields on Collection {
    id
    handle
    title
    description
    image {
      url
      altText
      width
      height
    }
  }
`;

export async function shopifyFetch({ query, variables = {}, cache = "no-store", tags = [] }) {
  const domain = normalizeStoreDomain(process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN);
  const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  const apiVersion = process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION || DEFAULT_API_VERSION;

  if (!domain || !token) {
    return { data: null, errors: [{ message: "Shopify Storefront API env vars are not configured." }] };
  }

  if (token.startsWith("shpat_")) {
    return {
      data: null,
      errors: [
        {
          message:
            "NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN must be a Storefront API token, not an Admin API token."
        }
      ]
    };
  }

  const endpoint = `https://${domain}/api/${apiVersion}/graphql.json`;

  let response;

  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token
      },
      body: JSON.stringify({ query, variables }),
      cache,
      next: cache === "no-store" ? undefined : tags.length ? { tags } : undefined
    });
  } catch (error) {
    return { data: null, errors: [{ message: error.message }] };
  }

  const body = await response.json();

  if (!response.ok || body.errors) {
    return {
      data: null,
      errors:
        body.errors ?? [
          { message: `Shopify Storefront API request failed with ${response.status}` }
        ]
    };
  }

  return body;
}

export async function getProducts({ first = 24 } = {}) {
  const query = `
    ${PRODUCT_CARD_FRAGMENT}
    query Products($first: Int!) {
      products(first: $first, sortKey: CREATED_AT, reverse: true) {
        edges {
          node {
            ...ProductCard
          }
        }
      }
    }
  `;

  const response = await shopifyFetch({
    query,
    variables: { first },
    cache: "no-store",
    tags: ["products"]
  });

  return toEdges(response.data?.products).map(normalizeProduct);
}

export async function getProductByHandle(handle) {
  const query = `
    ${PRODUCT_CARD_FRAGMENT}
    query ProductByHandle($handle: String!) {
      product(handle: $handle) {
        ...ProductCard
      }
    }
  `;

  const response = await shopifyFetch({
    query,
    variables: { handle },
    cache: "no-store",
    tags: ["products", `product:${handle}`]
  });

  return response.data?.product ? normalizeProduct(response.data.product) : null;
}

export async function getCollections({ first = 12 } = {}) {
  const query = `
    ${COLLECTION_FRAGMENT}
    query Collections($first: Int!) {
      collections(first: $first, sortKey: TITLE) {
        edges {
          node {
            ...CollectionFields
          }
        }
      }
    }
  `;

  const response = await shopifyFetch({
    query,
    variables: { first },
    cache: "no-store",
    tags: ["collections"]
  });

  return toEdges(response.data?.collections).map(normalizeCollection);
}

export async function getCollectionByHandle(handle, { productsFirst = 24 } = {}) {
  const query = `
    ${COLLECTION_FRAGMENT}
    ${PRODUCT_CARD_FRAGMENT}
    query CollectionByHandle($handle: String!, $productsFirst: Int!) {
      collection(handle: $handle) {
        ...CollectionFields
        products(first: $productsFirst) {
          edges {
            node {
              ...ProductCard
            }
          }
        }
      }
    }
  `;

  const response = await shopifyFetch({
    query,
    variables: { handle, productsFirst },
    cache: "no-store",
    tags: ["collections", `collection:${handle}`]
  });

  if (!response.data?.collection) {
    return null;
  }

  return {
    ...normalizeCollection(response.data.collection),
    products: toEdges(response.data.collection.products).map(normalizeProduct)
  };
}

export async function createCart(lines = []) {
  const query = `
    ${CART_FRAGMENT}
    mutation CartCreate($input: CartInput!) {
      cartCreate(input: $input) {
        cart {
          ...CartFields
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const response = await shopifyFetch({
    query,
    variables: { input: { lines } },
    cache: "no-store"
  });

  assertNoResponseErrors(response.errors);
  assertNoUserErrors(response.data?.cartCreate?.userErrors);
  return normalizeCart(response.data?.cartCreate?.cart);
}

export async function getCart(cartId) {
  if (!cartId) {
    return null;
  }

  const query = `
    ${CART_FRAGMENT}
    query Cart($cartId: ID!) {
      cart(id: $cartId) {
        ...CartFields
      }
    }
  `;

  const response = await shopifyFetch({
    query,
    variables: { cartId },
    cache: "no-store"
  });

  assertNoResponseErrors(response.errors);
  return normalizeCart(response.data?.cart);
}

export async function addCartLines(cartId, lines) {
  const query = `
    ${CART_FRAGMENT}
    mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          ...CartFields
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const response = await shopifyFetch({
    query,
    variables: { cartId, lines },
    cache: "no-store"
  });

  assertNoResponseErrors(response.errors);
  assertNoUserErrors(response.data?.cartLinesAdd?.userErrors);
  return normalizeCart(response.data?.cartLinesAdd?.cart);
}

export async function updateCartLines(cartId, lines) {
  const query = `
    ${CART_FRAGMENT}
    mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          ...CartFields
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const response = await shopifyFetch({
    query,
    variables: { cartId, lines },
    cache: "no-store"
  });

  assertNoResponseErrors(response.errors);
  assertNoUserErrors(response.data?.cartLinesUpdate?.userErrors);
  return normalizeCart(response.data?.cartLinesUpdate?.cart);
}

export async function removeCartLines(cartId, lineIds) {
  const query = `
    ${CART_FRAGMENT}
    mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          ...CartFields
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const response = await shopifyFetch({
    query,
    variables: { cartId, lineIds },
    cache: "no-store"
  });

  assertNoResponseErrors(response.errors);
  assertNoUserErrors(response.data?.cartLinesRemove?.userErrors);
  return normalizeCart(response.data?.cartLinesRemove?.cart);
}

const CART_FRAGMENT = `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
      totalAmount {
        amount
        currencyCode
      }
    }
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
          merchandise {
            ... on ProductVariant {
              id
              title
              availableForSale
              selectedOptions {
                name
                value
              }
              image {
                url
                altText
              }
              price {
                amount
                currencyCode
              }
              product {
                id
                handle
                title
                productType
                featuredImage {
                  url
                  altText
                }
                collections(first: 1) {
                  edges {
                    node {
                      handle
                      title
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

function normalizeProduct(product) {
  const variants = toEdges(product.variants).map(normalizeVariant);
  const parsedDescription = parseProductDescription(product.description);
  const contentMetafields = metafieldsToContentMap(product.metafields ?? []);
  const collections = toEdges(product.collections).map((collection) => ({
    id: collection.id,
    handle: collection.handle,
    title: collection.title
  }));
  const primaryCollection = collections[0] ?? null;
  const images = toEdges(product.images).map(normalizeImage);
  const featuredImage = normalizeImage(product.featuredImage) ?? images[0] ?? null;
  const colorOption = findOption(product.options, "Color");
  const sizeOption = findOption(product.options, "Size");
  const price = Number(product.priceRange?.minVariantPrice?.amount ?? variants[0]?.price ?? 0);

  return {
    id: product.id,
    handle: product.handle,
    slug: product.handle,
    name: product.title,
    title: product.title,
    tagline:
      firstSentence(parsedDescription.summary) || product.productType || "Mindful wardrobe piece",
    category: product.productType || "T-Shirt",
    collection: primaryCollection?.title || "Mindful Wardrobe",
    collectionHandle: primaryCollection?.handle || null,
    collectionReferences: collections,
    price,
    currency: product.priceRange?.minVariantPrice?.currencyCode || variants[0]?.currency || "USD",
    colors: colorOption?.values ?? uniqueSelectedOptionValues(variants, "Color"),
    sizes: sizeOption?.values ?? uniqueSelectedOptionValues(variants, "Size"),
    options: product.options ?? [],
    variants,
    availableForSale: product.availableForSale,
    fit: tagValue(product.tags, "fit") || "Shopify variant fit",
    material: tagValue(product.tags, "material") || "See Shopify product details",
    description: parsedDescription.summary || "Product details are managed in Shopify.",
    fullDescription: product.description || "",
    descriptionHtml: product.descriptionHtml,
    details: detailsFromTags(product.tags),
    tags: product.tags ?? [],
    fabricDetails:
      resolveProductContent({
        parsedSections: parsedDescription.sections,
        metafields: contentMetafields,
        tags: product.tags,
        key: "fabricDetails",
        tagPrefix: "fabric",
        fallback: "Fabric details will be managed with Shopify metafields."
      }),
    fitDetails:
      resolveProductContent({
        parsedSections: parsedDescription.sections,
        metafields: contentMetafields,
        tags: product.tags,
        key: "fitDetails",
        tagPrefix: "fitDetail",
        fallback: "Fit notes will be managed with Shopify metafields."
      }),
    designInspiration:
      resolveProductContent({
        parsedSections: parsedDescription.sections,
        metafields: contentMetafields,
        tags: product.tags,
        key: "designInspiration",
        tagPrefix: "inspiration",
        fallback: "Design inspiration will be managed with Shopify metafields."
      }),
    careInstructions:
      resolveProductContent({
        parsedSections: parsedDescription.sections,
        metafields: contentMetafields,
        tags: product.tags,
        key: "careInstructions",
        tagPrefix: "care",
        fallback: "Care instructions will be managed with Shopify metafields."
      }),
    designIntention:
      resolveProductContent({
        parsedSections: parsedDescription.sections,
        metafields: contentMetafields,
        tags: product.tags,
        key: "designIntention",
        tagPrefix: "intention",
        fallback:
          tagValue(product.tags, "mood") ||
          "Mood and intention will be managed with Shopify metafields."
      }),
    image: featuredImage?.url || "",
    imageAlt: featuredImage?.altText || product.title,
    images,
    accent: "accent",
    mood: tagValue(product.tags, "mood") || primaryCollection?.title || "Mindful wardrobe",
    artDirection: tagValue(product.tags, "art") || product.productType || "Shopify product",
    backgroundTheme: themeFromText(primaryCollection?.title || product.title)
  };
}

function normalizeVariant(variant) {
  const selectedOptions = variant.selectedOptions ?? [];

  return {
    id: variant.id,
    storefrontId: variant.id,
    title: variant.title,
    availableForSale: variant.availableForSale,
    quantityAvailable: variant.quantityAvailable,
    selectedOptions,
    color: selectedOptions.find((option) => option.name.toLowerCase() === "color")?.value,
    size: selectedOptions.find((option) => option.name.toLowerCase() === "size")?.value,
    price: Number(variant.price?.amount ?? 0),
    currency: variant.price?.currencyCode || "USD",
    image: normalizeImage(variant.image)
  };
}

function normalizeCollection(collection) {
  return {
    id: collection.id,
    handle: collection.handle,
    name: collection.title,
    title: collection.title,
    description: collection.description || "A Shopify collection for the mindful wardrobe.",
    image: normalizeImage(collection.image),
    accentClass: accentClassFromText(collection.title),
    surfaceClass: surfaceClassFromText(collection.title),
    mood: collection.description || "A considered edit from the Shopify catalogue.",
    symbol: collection.title
  };
}

function normalizeCart(cart) {
  if (!cart) {
    return null;
  }

  const lines = toEdges(cart.lines).map((line) => {
    const merchandise = line.merchandise;
    const collection = toEdges(merchandise.product?.collections)[0];
    const variant = normalizeVariant(merchandise);
    const image = normalizeImage(merchandise.image) ?? normalizeImage(merchandise.product?.featuredImage);

    return {
      id: line.id,
      quantity: line.quantity,
      cost: {
        totalAmount: Number(line.cost?.totalAmount?.amount ?? 0),
        currency: line.cost?.totalAmount?.currencyCode || variant.currency
      },
      merchandiseId: merchandise.id,
      variant: {
        ...variant,
        image
      },
      product: {
        id: merchandise.product.id,
        handle: merchandise.product.handle,
        name: merchandise.product.title,
        title: merchandise.product.title,
        category: merchandise.product.productType || "T-Shirt",
        collection: collection?.title || "Mindful Wardrobe",
        collectionHandle: collection?.handle || null,
        image: image?.url || "",
        imageAlt: image?.altText || merchandise.product.title,
        price: variant.price,
        currency: variant.currency
      }
    };
  });

  return {
    id: cart.id,
    checkoutUrl: cart.checkoutUrl,
    totalQuantity: cart.totalQuantity,
    lines,
    items: lines,
    subtotal: Number(cart.cost?.subtotalAmount?.amount ?? 0),
    total: Number(cart.cost?.totalAmount?.amount ?? 0),
    currency: cart.cost?.subtotalAmount?.currencyCode || "USD"
  };
}

function toEdges(connection) {
  return connection?.edges?.map((edge) => edge.node) ?? [];
}

function normalizeImage(image) {
  if (!image) {
    return null;
  }

  return {
    url: image.url,
    altText: image.altText,
    width: image.width,
    height: image.height
  };
}

function findOption(options = [], name) {
  return options.find((option) => option.name.toLowerCase() === name.toLowerCase());
}

function uniqueSelectedOptionValues(variants, name) {
  return [
    ...new Set(
      variants
        .map((variant) =>
          variant.selectedOptions.find((option) => option.name.toLowerCase() === name.toLowerCase())
            ?.value
        )
        .filter(Boolean)
    )
  ];
}

function firstSentence(text = "") {
  return text.split(".")[0]?.trim();
}

function tagValue(tags = [], prefix) {
  const tag = tags.find((item) => item.toLowerCase().startsWith(`${prefix}:`));
  return tag?.split(":").slice(1).join(":").trim();
}

function detailsFromTags(tags = []) {
  const detailTags = tags
    .filter((tag) => tag.toLowerCase().startsWith("detail:"))
    .map((tag) => tag.split(":").slice(1).join(":").trim());

  return detailTags.length
    ? detailTags
    : ["Managed in Shopify", "Availability synced from Storefront API"];
}

function themeFromText(text = "") {
  const normalized = text.toLowerCase();

  if (normalized.includes("peace")) return "peace";
  if (normalized.includes("discipline")) return "discipline";
  if (normalized.includes("manifest")) return "manifest";
  if (normalized.includes("stillness")) return "stillness";
  if (normalized.includes("growth")) return "growth";
  return "focus";
}

function surfaceClassFromText(text = "") {
  return `surface-${themeFromText(text)}`;
}

function accentClassFromText(text = "") {
  const theme = themeFromText(text);

  if (theme === "peace" || theme === "stillness") return "bg-sky";
  if (theme === "discipline" || theme === "growth") return "bg-coral";
  return "bg-accent";
}

function assertNoUserErrors(errors = []) {
  if (errors.length) {
    throw new Error(errors.map((error) => error.message).join(", "));
  }
}

function assertNoResponseErrors(errors = []) {
  if (errors.length) {
    throw new Error(errors.map((error) => error.message).join(", "));
  }
}

function normalizeStoreDomain(domain = "") {
  return domain.replace(/^https?:\/\//, "").replace(/\/$/, "");
}
