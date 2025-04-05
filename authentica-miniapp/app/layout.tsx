import "./globals.css";
import "./animations.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import MiniKitProvider from "@/components/minikit-provider";
import MobileNav from "@/components/layout/mobile-nav";
import dynamic from "next/dynamic";
import NextAuthProvider from "@/components/next-auth-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Authentica | Verification Marketplace",
  description: "AI Content verification marketplace using World chain for payments and NFT certification",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const ErudaProvider = dynamic(
    () => import("../components/Eruda").then((c) => c.ErudaProvider),
    {
      ssr: false,
    }
  );
  
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthProvider>
          <ErudaProvider>
            <MiniKitProvider>
              {/* Enhanced background with better contrast */}
              <div className="fixed inset-0 w-full h-full z-[-2] overflow-hidden">
                {/* Base layer - solid color for consistency */}
                <div className="absolute inset-0 bg-white dark:bg-gray-900" />
                
                {/* Improved gradient background with better visibility */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 dark:from-indigo-950/50 dark:via-blue-950/50 dark:to-cyan-950/50 opacity-90" />
                
                {/* Subtle texture overlay */}
                <div className="absolute inset-0 opacity-[0.025] bg-[url('/noise-texture.svg')]" />
                
                {/* Decorative elements with improved opacity */}
                <div className="absolute top-[25%] right-[15%] w-[40vw] h-[40vw] max-w-3xl max-h-3xl rounded-full bg-indigo-300 dark:bg-indigo-800 blur-[100px] opacity-[0.3] z-0" />
                <div className="absolute bottom-[20%] left-[10%] w-[35vw] h-[35vw] max-w-2xl max-h-2xl rounded-full bg-blue-300 dark:bg-blue-800 blur-[80px] opacity-[0.3] z-0" />
                <div className="absolute top-[60%] right-[5%] w-[25vw] h-[25vw] max-w-xl max-h-xl rounded-full bg-cyan-300 dark:bg-cyan-800 blur-[60px] opacity-[0.3] z-0" />
                
                {/* World App header gradient overlay */}
                <div className="absolute top-0 left-0 right-0 h-[100px] bg-gradient-to-b from-white/80 dark:from-gray-900/80 to-transparent z-0"></div>
              </div>
              
              <main className="flex min-h-screen w-full flex-col items-center justify-start py-4 pt-[70px] pb-[80px] px-safe-left px-safe-right relative">
                {children}
              </main>
              
              <MobileNav />
            </MiniKitProvider>
          </ErudaProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
