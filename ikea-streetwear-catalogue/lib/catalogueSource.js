import {
  getCollectionByHandle as getShopifyCollectionByHandle,
  getCollections as getShopifyCollections,
  getProductByHandle as getShopifyProductByHandle,
  getProducts as getShopifyProducts
} from "@/lib/shopify";

const SHOPIFY_SOURCE = "shopify";

export function getCatalogueSourceName() {
  return process.env.CATALOGUE_SOURCE || SHOPIFY_SOURCE;
}

export async function getCatalogueProducts({ first = 48 } = {}) {
  switch (getCatalogueSourceName()) {
    case SHOPIFY_SOURCE:
    default:
      return getShopifyProducts({ first });
  }
}

export async function getCatalogueProductByHandle(handle) {
  switch (getCatalogueSourceName()) {
    case SHOPIFY_SOURCE:
    default:
      return getShopifyProductByHandle(handle);
  }
}

export async function getCatalogueCollections({ first = 24 } = {}) {
  switch (getCatalogueSourceName()) {
    case SHOPIFY_SOURCE:
    default:
      return getShopifyCollections({ first });
  }
}

export async function getCatalogueCollectionByHandle(handle, options = {}) {
  switch (getCatalogueSourceName()) {
    case SHOPIFY_SOURCE:
    default:
      return getShopifyCollectionByHandle(handle, options);
  }
}
