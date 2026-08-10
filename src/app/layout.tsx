import type { Metadata } from "next";
import { Poppins, JetBrains_Mono } from "next/font/google";
import { AppSidebar } from "@/components/layout/AppSidebar";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "IndiaCalc — Indian Financial Calculators",
    template: "%s | IndiaCalc",
  },
  description:
    "Client-side SIP, EMI, FIRE, tax, and government scheme calculators built for India.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${poppins.variable} ${jetbrainsMono.variable} min-h-screen font-sans`}
      >
        <div className="flex min-h-screen">
          <AppSidebar />
          <main className="flex-1 overflow-x-hidden">
            <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
