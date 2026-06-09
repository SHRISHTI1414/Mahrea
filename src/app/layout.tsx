import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import CartDrawer from "@/components/cart/CartDrawer";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Mahrea — Sparkle Everyday",
    template: "%s | Mahrea",
  },
  description:
    "Premium anti-tarnish jewellery designed for the everyday you, inspired by our roots. Shop rings, earrings, bracelets, pendants, anklets, and Indian ethnic jewellery.",
  keywords: ["jewellery", "rings", "earrings", "bracelets", "pendants", "anklets", "Indian ethnic jewellery", "anti-tarnish"],
  metadataBase: new URL("https://mahrea.in"),
  openGraph: {
    siteName: "Mahrea",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@mahrea_in",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <body>
        {children}
        <CartDrawer />
      </body>
    </html>
  );
}
