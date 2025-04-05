"use client"; // Required for Next.js

import { MiniKit } from "@worldcoin/minikit-js";
import { ReactNode, useEffect } from "react";

// App ID from World Developer Portal
const APP_ID = 'authentica-verify-app';

export default function MiniKitProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Initialize MiniKit with our app ID
    if (typeof window !== 'undefined') {
      try {
        MiniKit.install(APP_ID);
        
        // Check if we're in the World App environment
        const isInWorldApp = MiniKit.isInstalled();
        console.log('Running in World App:', isInWorldApp);
        
        // Add global event listeners for World App events
        if (isInWorldApp) {
          console.log('Setting up World App event listeners');
          
          // Example: listen for visibility changes
          document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
              console.log('App came to foreground');
            } else {
              console.log('App went to background');
            }
          });
        }
      } catch (error) {
        console.error('Failed to initialize MiniKit:', error);
      }
    }
  }, []);

  return <>{children}</>;
}
