import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ─── Site-wide Metadata ────────────────────────────────────────────────────────
// metadataBase is required so that relative OG image URLs resolve correctly
// in production. Set NEXT_PUBLIC_SITE_URL in your environment.
export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  title: {
    default: "CrowdFund — Empower Ideas Through Community",
    template: "%s | CrowdFund",
  },
  description:
    "A crowdfunding platform where creators bring ideas to life and supporters fund the future. Browse campaigns, back projects, and make an impact.",
  keywords: [
    "crowdfunding",
    "fundraising",
    "campaigns",
    "startup funding",
    "community funding",
    "creative projects",
  ],
  authors: [{ name: "CrowdFund Team" }],
  creator: "CrowdFund",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    siteName: "CrowdFund",
    title: "CrowdFund — Empower Ideas Through Community",
    description:
      "Browse campaigns, back the projects you believe in, and help creators bring their ideas to life.",
    images: [
      {
        url: "/og-image.png", // place a 1200×630 image at public/og-image.png
        width: 1200,
        height: 630,
        alt: "CrowdFund — Empower Ideas Through Community",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CrowdFund — Empower Ideas Through Community",
    description:
      "Browse campaigns, back the projects you believe in, and help creators bring their ideas to life.",
    images: ["/og-image.png"],
    creator: "@crowdfund",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cf-cream text-cf-dark">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
