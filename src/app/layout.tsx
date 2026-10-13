import type { Metadata, Viewport } from "next";
import { Dancing_Script, Inter, Playfair_Display } from "next/font/google";
import { birthday } from "@/config/birthday";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  style: ["normal", "italic"],
  display: "swap",
});
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const dancing = Dancing_Script({ subsets: ["latin"], variable: "--font-dancing", display: "swap" });

const { meta } = birthday;

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  openGraph: {
    title: meta.title,
    description: meta.description,
    type: "website",
    ...(meta.ogImage ? { images: [{ url: meta.ogImage, width: 1200, height: 630 }] } : {}),
  },
  twitter: {
    card: meta.ogImage ? "summary_large_image" : "summary",
    title: meta.title,
    description: meta.description,
  },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: birthday.theme.plum,
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} ${dancing.variable}`}>
      <body className="grain">
        <noscript>
          <style>{`[data-intro]{display:none!important}body{overflow:auto!important}main *{opacity:1!important;transform:none!important;filter:none!important;clip-path:none!important}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
