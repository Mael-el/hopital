"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { PublicPageTracker } from "@/components/public/page-tracker";

/**
 * Affiche l'en-tête / le pied de page du site public sur toutes les pages
 * sauf l'espace d'administration, qui possède son propre habillage.
 */
export function Chrome({
  header,
  footer,
  mobileBar,
  children,
}: {
  header: ReactNode;
  footer: ReactNode;
  mobileBar?: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return <>{children}</>;
  }

  return (
    <>
      <PublicPageTracker />
      {/* Lien d'évitement pour la navigation au clavier */}
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-brand-800 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Aller au contenu
      </a>
      {header}
      <main id="contenu" className="flex-1">
        {children}
      </main>
      {footer}
      {mobileBar && (
        <>
          {/* Espace réservé pour que la barre mobile fixe ne masque rien */}
          <div aria-hidden="true" className="h-16 xl:hidden" />
          {mobileBar}
        </>
      )}
    </>
  );
}
