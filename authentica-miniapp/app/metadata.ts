import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentica | Verification Marketplace",
  description: "AI Content verification marketplace using World chain for payments and NFT certification",
  manifest: "/manifest.json",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: "cover"
  },
  themeColor: "#4F46E5",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Authentica"
  },
  formatDetection: {
    telephone: false
  },
  openGraph: {
    type: "website",
    siteName: "Authentica",
    title: "Authentica | Verification Marketplace",
    description: "AI Content verification marketplace using World chain for payments and NFT certification"
  }
};

export default metadata; 