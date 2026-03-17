import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Sora } from "next/font/google";
import "./globals.css";

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
  title: "Flutter Init",
  description: "Scaffolds your entire Flutter app with your preferred state management, routing, and utilities.",
  alternates: {
    canonical: "/",
  },
  keywords: ["Flutter", "Scaffolding", "Boilerplate", "Clean Architecture", "MVVM", "Project Generator", "Dart", "Development Tools"],
  authors: [{ name: "Arjun544", url: "https://github.com/Arjun544" }],
  openGraph: {
    title: "Flutter Init",
    description: "Scaffolds your entire Flutter app with your preferred state management, routing, and utilities.",
    url: "https://flutterinit.com",
    siteName: "Flutter Init",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Flutter Init - Professional Scaffolding",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Flutter Init",
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "Flutter Init",
              "operatingSystem": "Windows, macOS, Linux",
              "applicationCategory": "DeveloperApplication",
              "description": "High-performance scaffolding engine for Flutter apps.",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "author": {
                "@type": "Person",
                "name": "Arjun544"
              }
            })
          }}
        />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
