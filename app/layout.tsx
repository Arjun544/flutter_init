import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Sora } from "next/font/google";
import { Analytics } from "@vercel/analytics/next"
import "./globals.css";
import JsonLd from "./components/JsonLd";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://flutterinit.com"),
  title: "FlutterInit",
  description: "Scaffolds your entire Flutter app with your preferred state management, routing, and utilities.",
  alternates: {
    canonical: "https://flutterinit.com",
  },
  keywords: ["FlutterInit", "Flutter Project Generator", "Flutter", "Scaffolding", "Boilerplate", "Clean Architecture", "MVVM", "Project Generator", "Dart", "Development Tools"],
  authors: [{ name: "Arjun Mahar", url: "https://github.com/Arjun544" }],
  openGraph: {
    title: "FlutterInit",
    description: "Scaffolds your entire Flutter app with your preferred state management, routing, and utilities.",
    url: "https://flutterinit.com",
    siteName: "FlutterInit",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "FlutterInit - Professional Scaffolding",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FlutterInit",
    description: "Scaffolds your entire Flutter app with your preferred state management, routing, and utilities.",
    images: ["/og-image.png"],
    creator: "@Arjun544",
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


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={sora.variable}>
      <head>
        <JsonLd />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
