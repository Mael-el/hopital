"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export function PublicPageTracker() {
  const pathname = usePathname();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || lastTrackedPath.current === pathname) return;
    lastTrackedPath.current = pathname;

    void fetch("/api/analytics", {
      method: "POST",
      credentials: "omit",
      cache: "no-store",
      keepalive: true,
      referrerPolicy: "no-referrer",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname }),
    })
      .then((response) => {
        if (!response.ok) {
          console.error("Le comptage des visites a échoué.", response.status);
        }
      })
      .catch((error: unknown) => {
        console.error("Le comptage des visites a échoué.", error);
      });
  }, [pathname]);

  return null;
}
