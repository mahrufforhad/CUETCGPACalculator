import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toast";
import Footer from "@/components/Footer";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CUET CGPA Calculator - Accurate Grade Calculation for CUET Students",
  description: "Calculate, track, and plan your CGPA at Chittagong University of Engineering & Technology with our precise calculator supporting all 13 departments.",
  authors: [
    {
      name: "Hovered",
      url: "https://hoveredhq.com",
    },
  ],
  keywords: [
    "CUET CGPA Calculator",
    "Chittagong University of Engineering & Technology",
    "CGPA Calculator",
    "CUET Students",
    "Grade Calculation",
    "Academic Planning",
    "CGPA Tracking",
    "CUET Departments",
    "Student Tools",
    "Education",
    "Academic Performance",
    "CGPA Management",
    "University Tools",
    "Student Resources",
    "CUET",
    "Engineering"
  ],
  openGraph: {
    title: "CUET CGPA Calculator",
    description: "Calculate, track, and plan your CGPA at Chittagong University of Engineering & Technology with our precise calculator supporting all 13 departments.",
    url: "https://cuetcgcalc.hoveredhq.com",
    siteName: "CUET CGPA Calculator",
    images: [
      {
        url: "https://i.postimg.cc/BZ2nTY41/cuetcgcalc-og-image.png",
        width: 600,
        height: 315,
        alt: "CUET CGPA Calculator OG Image",
      },
    ]
  },
  appleWebApp: {
    capable: true,
    title: "CUET CGPA Calculator",
    statusBarStyle: "black-translucent",
  },
  themeColor: "#2563eb",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
    shortcut: "/logo.png",
  },
  manifest: "/manifest.json"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex flex-col min-h-screen">
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
        <Toaster />
        <PWAInstallPrompt />
      </body>
    </html>
  );
}
