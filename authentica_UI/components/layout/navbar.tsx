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
            ? "border-b border-gray-200 bg-white/50 backdrop-blur-xl"
            : "bg-white/0"
        } z-30 transition-all`}
      >
        <div className="mx-5 flex h-16 w-full max-w-screen-xl items-center justify-between">
          <Link href="/" className="flex items-center mt-1">
            <div className="relative w-[160px] h-[40px]">
              <object 
                data="/Authentica_SVG.svg" 
                type="image/svg+xml"
                className="w-full h-full"
                aria-label="Authentica logo"
              />
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
              className="flex items-center justify-center rounded-full border border-gray-300 bg-white px-5 py-1.5 text-sm font-medium text-gray-800 shadow-sm transition-colors hover:border-gray-800 h-[40px] mt-1"
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
    </>
  );
}
