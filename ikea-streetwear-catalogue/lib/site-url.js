export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.nordthreads.com";

export function sitePath(path = "/") {
  const safePath = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl}${safePath}`;
}
