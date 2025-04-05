"use client";

import Link from "next/link";
import Image from "next/image";
import useScroll from "@/lib/hooks/use-scroll";

export default function NavBar() {
  const scrolled = useScroll(50);

  return (
    <>
      <div
        className={`fixed top-0 flex w-full justify-center ${
          scrolled
            ? "border-b border-gray-200 bg-white/40 backdrop-blur-md"
            : "bg-transparent"
        } z-30 transition-all duration-300`}
      >
        <div className="mx-5 flex h-16 w-full max-w-screen-xl items-center justify-between">
          <Link href="/" className="flex items-center mt-1 relative">
            <div className="relative w-[160px] h-[40px]">
              <object 
                data="/Authentica_SVG.svg" 
                type="image/svg+xml"
                className="w-full h-full pointer-events-none"
                aria-label="Authentica logo"
              />
              <div className="absolute inset-0 cursor-pointer" aria-hidden="true"></div>
            </div>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link 
              href="/verification-marketplace"
              className="hidden sm:flex items-center text-gray-700 hover:text-gray-900 font-medium transition-colors"
            >
              Marketplace
            </Link>
            <a
              href="https://world.org"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center rounded-full border border-gray-300 bg-white/80 backdrop-blur-sm px-5 py-1.5 text-sm font-medium text-gray-800 shadow-sm transition-all duration-300 hover:border-gray-800 hover:bg-white h-[40px] mt-1"
            >
              <span className="mr-2">Try on</span>
              <Image 
                src="/world_logo.svg"
                alt="World logo"
                width={70}
                height={70}
                priority
              />
            </a>
          </div>
        </div>
      </div>
      
      {/* Additional transparent gradient to help transition */}
      <div className="fixed top-0 left-0 right-0 h-20 bg-gradient-to-b from-white/90 to-transparent pointer-events-none z-20" />
    </>
  );
}
