const SHOPIFY_CHECKOUT_HOST = "nordthreads.myshopify.com";

export function proxy(request) {
  const checkoutUrl = new URL(request.url);
  checkoutUrl.hostname = SHOPIFY_CHECKOUT_HOST;
  checkoutUrl.protocol = "https:";
  checkoutUrl.port = "";

  return Response.redirect(checkoutUrl, 307);
}

export const config = {
  matcher: ["/cart/c/:path*", "/checkout/:path*", "/checkouts/:path*"]
};
