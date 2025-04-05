"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";

const navItems = [
  {
    path: "/",
    label: "Home",
    icon: () => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22 22L2 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M2 11L10.1259 4.49931C11.2216 3.62279 12.7784 3.62279 13.8741 4.49931L22 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M15.5 5.5V3.5C15.5 3.22386 15.7239 3 16 3H18.5C18.7761 3 19 3.22386 19 3.5V8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M4 22V9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M20 22V9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M15 22V17C15 15.5858 15 14.8787 14.5607 14.4393C14.1213 14 13.4142 14 12 14C10.5858 14 9.87868 14 9.43934 14.4393C9 14.8787 9 15.5858 9 17V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    path: "/providers",
    label: "Providers",
    icon: () => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    path: "/profile",
    label: "Profile",
    icon: () => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="9" r="3" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M17.9691 20C17.81 17.1085 16.9247 15 11.9999 15C7.07521 15 6.18991 17.1085 6.03076 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
];

export default function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();
  
  return (
    <nav className="mobile-bottom-nav">
      {navItems.map((item) => {
        const isActive = pathname === item.path;
        
        return (
          <button
            key={item.path}
            className={`mobile-bottom-nav-item ${isActive ? "active" : ""}`}
            onClick={() => router.push(item.path)}
          >
            <motion.div
              whileTap={{ scale: 0.9 }}
              className="relative"
            >
              <div className={isActive ? "text-primary" : "text-gray-500"}>
                <item.icon />
              </div>
              
              {isActive && (
                <motion.div
                  layoutId="navigation-indicator"
                  className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </motion.div>
            <span className="text-xs mt-1">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
} 