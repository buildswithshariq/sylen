import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SproutProvider from "@/components/sprout/SproutProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "EcoPilot — Your Personal Carbon Reduction Coach",
  description:
    "Calculate, understand, and reduce your carbon footprint with actionable, personalized recommendations.",
  keywords: [
    "carbon footprint",
    "sustainability",
    "climate",
    "eco",
    "carbon calculator",
    "AI coach",
  ],
  authors: [{ name: "EcoPilot" }],
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col font-sans bg-off-white text-stone-900 antialiased">
        <Navbar />
        <main className="flex-grow flex flex-col">
          {children}
        </main>
        <Footer />
        <SproutProvider />
      </body>
    </html>
  );
}

