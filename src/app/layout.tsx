import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Footer } from "@/components/layout/Footer/Footer";
import { Header } from "@/components/layout/Header/Header";
import { site } from "@/config/site";
import { getSiteChrome } from "@/lib/chrome";
import "./globals.css";

// Self-hosted variable fonts (SIL OFL, see src/fonts) — no build-time network fetch.
const montserrat = localFont({
  src: "../fonts/montserrat-latin-var.woff2",
  weight: "100 900",
  variable: "--font-montserrat",
  display: "swap",
});

const inter = localFont({
  src: "../fonts/inter-latin-var.woff2",
  weight: "100 900",
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Order My Print — Custom printing online in India",
    template: "%s · Order My Print",
  },
  description: site.description,
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: site.name,
    images: [{ url: "/images/hero.png", width: 1152, height: 928 }],
  },
};

export const viewport: Viewport = {
  themeColor: "#102848",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const chrome = await getSiteChrome();
  return (
    <html lang="en-IN" className={`${montserrat.variable} ${inter.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Header chrome={chrome} />
        <main id="main">{children}</main>
        <Footer chrome={chrome} />
      </body>
    </html>
  );
}
