import "./globals.css";
import "./animations.css";
import cx from "classnames";
import { sfPro, inter } from "./fonts";
import Footer from "@/components/layout/footer";
import { Suspense } from "react";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import Navbar from "@/components/layout/navbar";

export const metadata = {
  title: "Authentica - Verifying AI-Generated Content",
  description:
    "Authentica is a platform for verifying AI-generated content and providing watermarking solutions.",
  metadataBase: new URL("https://authentica.vercel.app"),
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cx(sfPro.variable, inter.variable, "bg-white")}>
        {/* Improved background implementation with better consistency */}
        <div className="fixed inset-0 w-full h-full z-[-2] overflow-hidden">
          {/* Base layer - solid color for consistency */}
          <div className="absolute inset-0 bg-white" />
          
          {/* Main gradient background with improved positioning */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white via-blue-50 to-cyan-100" />
          
          {/* Subtle texture overlay - reduced opacity for smoother appearance */}
          <div className="absolute inset-0 opacity-[0.015] bg-[url('/noise-texture.svg')]" />
          
          {/* Repositioned decorative elements to avoid navbar inconsistency */}
          <div className="absolute top-[25%] right-[15%] w-[40vw] h-[40vw] max-w-3xl max-h-3xl rounded-full bg-indigo-100 blur-[100px] opacity-[0.15] z-0" />
          <div className="absolute bottom-[20%] left-[10%] w-[35vw] h-[35vw] max-w-2xl max-h-2xl rounded-full bg-blue-100 blur-[80px] opacity-[0.15] z-0" />
          <div className="absolute top-[60%] right-[5%] w-[25vw] h-[25vw] max-w-xl max-h-xl rounded-full bg-cyan-100 blur-[60px] opacity-[0.15] z-0" />
          
          {/* Enhanced navbar transition gradient */}
          <div className="absolute top-0 left-0 right-0 h-[120px] bg-gradient-to-b from-white to-transparent opacity-90 z-0" />
          
          {/* Improved gradient overlay for smoother transitions */}
          <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-transparent opacity-40" />
          
          {/* Adjusted radial gradient for better blending */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.8)_0%,transparent_70%)] opacity-50" />
        </div>
        
        <Suspense fallback="...">
          <Navbar />
        </Suspense>
        <main className="flex min-h-screen w-full flex-col items-center justify-center py-32 relative z-[1]">
          {children}
        </main>
        <Footer />
        <VercelAnalytics />
      </body>
    </html>
  );
}
