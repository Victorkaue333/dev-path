"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { trackEvent } from "../track";

/**
 * Registra PAGE_VIEW a cada mudança de rota pública. Não envia query string nem referrer.
 * Montado no layout público; é no-op se NEXT_PUBLIC_ANALYTICS_ENABLED != "true".
 */
export function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    trackEvent({ type: "PAGE_VIEW", path: pathname });
  }, [pathname]);

  return null;
}
