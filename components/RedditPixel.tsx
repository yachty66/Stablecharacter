"use client";

import Script from "next/script";
import { useEffect } from "react";

declare global {
  interface Window {
    rdt: any;
  }
}

export default function RedditPixel({ userEmail }: { userEmail?: string }) {
  useEffect(() => {
    // Create a function to handle initialization
    const initializePixel = () => {
      if (window.rdt) {
        if (userEmail) {
          window.rdt("init", "a2_gf0h0x8uep1k", {
            email: userEmail,
          });
        } else {
          window.rdt("init", "a2_gf0h0x8uep1k");
        }
        window.rdt("track", "PageVisit");
      }
    };

    // Try to initialize immediately if rdt is already loaded
    initializePixel();

    // Also set up a backup initialization after a short delay
    const timer = setTimeout(initializePixel, 2000);

    return () => clearTimeout(timer);
  }, [userEmail]);

  return (
    <Script
      id="reddit-pixel"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          !function(w,d){if(!w.rdt){var p=w.rdt=function(){p.sendEvent?p.sendEvent.apply(p,arguments):p.callQueue.push(arguments)};p.callQueue=[];var t=d.createElement("script");t.src="https://www.redditstatic.com/ads/pixel.js",t.async=!0;var s=d.getElementsByTagName("script")[0];s.parentNode.insertBefore(t,s)}}(window,document);
        `,
      }}
    />
  );
}
