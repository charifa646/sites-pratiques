"use client";

import { useEffect, useState } from "react";

/** Returns true on small screens. `null` until mounted (avoids SSR mismatch). */
export function useIsMobile(query = "(max-width: 767px)"): boolean | null {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);

  return isMobile;
}
