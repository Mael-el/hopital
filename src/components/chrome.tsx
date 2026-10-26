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
      {/* Lien d'évitement pour la navigation au clavier */}
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-[3px] focus:bg-brand-800 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Aller au contenu
      </a>
      {header}
      <main id="contenu" className="flex-1">
        {children}
      </main>
      {footer}
    </>
  );
}
