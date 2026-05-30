import "./globals.css";
import { CartDrawer } from "@/components/cart-drawer";
import { CartProvider } from "@/components/cart-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata = {
  title: "Nord Threads | Wear the Mood",
  description: "Soft chaos. Clean fits. Made for quiet wins."
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
