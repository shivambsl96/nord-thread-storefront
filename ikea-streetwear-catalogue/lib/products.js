import {
  applyCollectionStory,
  createPlaceholderCollection,
  getCollectionStory,
  mergeCollectionsWithPlaceholders
} from "@/lib/collectionStories";
import {
  getCatalogueCollectionByHandle,
  getCatalogueCollections,
  getCatalogueProductByHandle,
  getCatalogueProducts
} from "@/lib/catalogueSource";

export async function getProducts() {
  return getCatalogueProducts({ first: 48 });
}

export async function getFeaturedProducts(limit = 4) {
  const products = await getCatalogueProducts({ first: limit });
  return products.slice(0, limit);
}

export async function getProductByHandle(handle) {
  return getCatalogueProductByHandle(handle);
}

export async function getRelatedProducts(product, limit = 3) {
  if (product.collectionHandle) {
    const collection = await getCatalogueCollectionByHandle(product.collectionHandle, {
      productsFirst: limit + 1
    });

    return (collection?.products ?? [])
      .filter((item) => item.handle !== product.handle)
      .slice(0, limit);
  }

  const products = await getCatalogueProducts({ first: 12 });

  return products
    .filter(
      (item) =>
        item.handle !== product.handle &&
        (item.collection === product.collection || item.category === product.category)
    )
    .slice(0, limit);
}

export function getCatalogueFilters(products) {
  const categories = [...new Set(products.map((product) => product.category).filter(Boolean))];
  const sizes = [...new Set(products.flatMap((product) => product.sizes ?? []))];
  const colors = [...new Set(products.flatMap((product) => product.colors ?? []))];
  const collections = [
    ...new Set(products.map((product) => product.collection).filter(Boolean))
  ];

  return { categories, sizes, colors, collections };
}

export async function getCollections() {
  const collections = await getCatalogueCollections({ first: 24 });
  return mergeCollectionsWithPlaceholders(collections);
}

export async function getCollectionByHandle(handle) {
  const collection = await getCatalogueCollectionByHandle(handle);
  const story = getCollectionStory(handle) ?? getCollectionStory(collection?.title);

  if (collection && story) {
    return applyCollectionStory(collection);
  }

  const placeholderStory = getCollectionStory(handle);
  return placeholderStory ? createPlaceholderCollection(placeholderStory) : null;
}

export async function getProductsByCollection(collectionHandle) {
  const collection = await getCatalogueCollectionByHandle(collectionHandle);
  return collection?.products ?? [];
}
