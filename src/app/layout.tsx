import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SproutProvider from "@/components/sprout/SproutProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PWAInstallPrompt from "@/components/layout/PWAInstallPrompt";
import FramerMotionProvider from "@/components/layout/FramerMotionProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const viewport = {
  themeColor: '#059669',
};

export const metadata: Metadata = {
  title: "Sylen 🌱",
  description:
    "AI-powered sustainability insights helping people understand, track, and reduce their carbon footprint.",
  openGraph: {
    title: "Sylen 🌱",
    description: "AI-powered sustainability insights helping people understand, track, and reduce their carbon footprint.",
    siteName: "Sylen",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sylen 🌱",
    description: "AI-powered sustainability insights helping people understand, track, and reduce their carbon footprint.",
  },
  keywords: [
    "carbon footprint",
    "sustainability",
    "climate",
    "eco",
    "carbon calculator",
    "AI coach",
  ],
  authors: [{ name: "Sylen" }],
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
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col font-sans bg-off-white text-stone-900 antialiased">
        <FramerMotionProvider>
          <Navbar />
          <main className="flex-grow flex flex-col">
            {children}
          </main>
          <Footer />
          <SproutProvider />
          <PWAInstallPrompt />
        </FramerMotionProvider>
      </body>
    </html>
  );
}

