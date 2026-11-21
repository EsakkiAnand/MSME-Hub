import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "-apple-system", "sans-serif"],
  adjustFontFallback: true,
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8f9fb" },
    { media: "(prefers-color-scheme: dark)", color: "#151516" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://msme.francisxavier.ac.in"),
  title: "FXEC MSME Hub | Industry-Academia Collaboration Platform",
  description:
    "Official institutional platform connecting verified MSMEs, academic departments, student project teams, and industry experts at Francis Xavier Engineering College.",
  keywords: [
    "MSME",
    "Francis Xavier Engineering College",
    "FXEC",
    "Industry Academia Collaboration",
    "Open Source Capstone",
    "Engineering Projects",
  ],
  authors: [{ name: "Francis Xavier Engineering College" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://msme.francisxavier.ac.in",
    siteName: "FXEC MSME Hub",
    title: "FXEC MSME Hub | Industry-Academia Collaboration Platform",
    description:
      "A centralized platform connecting micro, small, and medium enterprises with multidisciplinary engineering talent.",
    images: [
      {
        url: "/msme-logo.webp",
        width: 678,
        height: 649,
        alt: "FXEC MSME Hub",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FXEC MSME Hub | Industry-Academia Collaboration Platform",
    description:
      "Official institutional platform connecting verified MSMEs with engineering talent.",
    images: ["/msme-logo.webp"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} font-sans h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <TooltipProvider>
          {children}
          <Toaster />
        </TooltipProvider>
      </body>
    </html>
  );
}
