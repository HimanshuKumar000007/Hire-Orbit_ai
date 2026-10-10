"use client";

import React, { useEffect, useRef } from "react";

interface AdSenseAdProps {
  client?: string;
  slot?: string;
  format?: "auto" | "fluid" | "rectangle" | "horizontal" | "vertical";
  responsive?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Standard AdSense Display / In-Article Ad Component.
 * Conforms to Google AdSense responsive and fixed ad requirements.
 */
export function AdSenseAd({
  client = "ca-pub-7428853562205065",
  slot,
  format = "auto",
  responsive = true,
  className = "",
  style = { display: "block" },
}: AdSenseAdProps) {
  const adRef = useRef<HTMLModElement | null>(null);
  const isLoaded = useRef(false);

  useEffect(() => {
    try {
      if (typeof window !== "undefined" && !isLoaded.current) {
        // @ts-expect-error - adsbygoogle is dynamically populated by AdSense script
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        isLoaded.current = true;
      }
    } catch (err) {
      // Catch already pushed / ad blocker errors gracefully
      console.debug("AdSense push notice:", err);
    }
  }, []);

  // During local development or if slot is pending, render graceful container
  if (!slot) {
    return null;
  }

  return (
    <div className={`adsense-container overflow-hidden my-6 text-center ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={style}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
    </div>
  );
}
