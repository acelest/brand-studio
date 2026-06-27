import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://brand-studio-mbs.vercel.app"),
  title: "Brand Studio - MyBestSim",
  description:
    "Upload an image or video and instantly apply a professional brand identity. Export PNG or MP4 with your brand kit.",
  keywords: ["branding", "brand studio", "watermark", "logo overlay", "export"],
  openGraph: {
    title: "Brand Studio - MyBestSim",
    description: "Upload an image and instantly apply a professional brand identity.",
    images: [
      {
        url: "/mbs-og.jpg",
        secureUrl: "/mbs-og.jpg",
        width: 1200,
        height: 1199,
        type: "image/jpeg",
        alt: "Brand Studio - MyBestSim",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Brand Studio - MyBestSim",
    description: "Upload an image and instantly apply a professional brand identity.",
    images: ["/mbs-og.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <TooltipProvider delayDuration={300}>
          {children}
        </TooltipProvider>
        <Analytics />
      </body>
    </html>
  );
}
