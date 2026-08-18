import type { Metadata, Viewport } from "next";
import { Inter, Source_Serif_4, JetBrains_Mono } from "next/font/google";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from "@/lib/brand";
import { getSiteUrl } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: getSiteUrl(),
    siteName: SITE_NAME,
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0B1F33",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN">
      <body
        className={`${inter.variable} ${sourceSerif.variable} ${jetbrainsMono.variable} min-h-dvh font-sans antialiased`}
      >
        <JsonLd />
        <div className="flex min-h-dvh w-full max-w-[100vw] flex-col overflow-x-hidden bg-background">
          <SiteHeader />
          <main className="w-full flex-1">
            <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
              {children}
            </div>
          </main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
