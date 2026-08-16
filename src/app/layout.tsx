import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Providers } from "./providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Prime Bite — Naručivanje obroka za firme",
    template: "%s · Prime Bite",
  },
  description:
    "Prime Bite povezuje firme, zaposlene i restorane u jednu platformu za naručivanje dnevnih obroka — budžeti, nedeljni meniji, praćenje narudžbina i dostave na jednom mestu.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sr" className={`${inter.variable} dark`} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
