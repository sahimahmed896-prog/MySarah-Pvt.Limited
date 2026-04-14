import type { Metadata } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import Footer from "@/components/layout/Footer";
import I18nProvider from "@/components/layout/I18nProvider";
import Navbar from "@/components/layout/Navbar";
import Analytics from "@/components/shared/Analytics";
import WhatsAppButton from "@/components/shared/WhatsAppButton";
import { seo } from "@/lib/constants";
import "./globals.css";
import "leaflet/dist/leaflet.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  keywords: seo.keywords,
  openGraph: {
    title: seo.title,
    description: seo.description,
    type: "website",
    locale: "en_IN",
    siteName: "Mysarah Modern Tech",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${playfair.variable}`}>
      <body>
        <I18nProvider>
          <Analytics />
          <Navbar />
          {children}
          <Footer />
          <WhatsAppButton />
        </I18nProvider>
      </body>
    </html>
  );
}
