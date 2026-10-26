"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Affiche l'en-tête / le pied de page du site public sur toutes les pages
 * sauf l'espace d'administration, qui possède son propre habillage.
 */
export function Chrome({
  header,
  footer,
  children,
}: {
  header: ReactNode;
  footer: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return <>{children}</>;
  }

  return (
    <>
      {header}
      {children}
      {footer}
    </>
  );
}
