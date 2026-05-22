import "./globals.css";
import { CartDrawer } from "@/components/cart-drawer";
import { CartProvider } from "@/components/cart-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata = {
  title: "Nord Thread | Mindful Wardrobe Catalogue",
  description:
    "A calm Scandinavian catalogue experience for premium self-improvement T-shirt collections."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-paper font-sans text-ink antialiased">
        <CartProvider>
          <div className="min-h-screen">
            <SiteHeader />
            <main>{children}</main>
            <SiteFooter />
            <CartDrawer />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
