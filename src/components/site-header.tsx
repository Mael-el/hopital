"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon } from "./icons";
import { Logo } from "./logo";
import { SearchDialog } from "@/components/public/search-dialog";

const NAV_LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/a-propos", label: "À propos" },
  { href: "/services", label: "Services" },
  { href: "/medecins", label: "Médecins" },
  { href: "/actualites", label: "Actualités" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader({
  phone,
  emergencyPhone,
  email,
  facebook,
  whatsapp,
}: {
  phone: string;
  emergencyPhone: string;
  email: string;
  facebook: string;
  whatsapp: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  /* Ferme le menu mobile à chaque changement de page (ajustement au rendu) */
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-sand-300 bg-white shadow-[0_1px_8px_rgba(9,42,64,0.06)]">
      {/* Bandeau utilitaire */}
      <div className="hidden bg-brand-950 text-brand-100/85 lg:block">
        <div className="container-page flex h-10 items-center justify-between text-[0.72rem] tracking-wide">
          <p className="flex items-center gap-2">
            <Icon name="map" className="h-3.5 w-3.5 text-brand-300" />
            Yêvié, Route de Zinvié — Abomey-Calavi, Atlantique (Bénin)
          </p>
          <div className="flex items-center gap-6">
            <a
              href={facebook}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="transition hover:text-white"
            >
              <Icon name="facebook" className="h-3.5 w-3.5" />
            </a>
            <a
              href={whatsapp}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className="transition hover:text-white"
            >
              <Icon name="whatsapp" className="h-3.5 w-3.5" />
            </a>
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-1.5 transition hover:text-white"
            >
              <Icon name="mail" className="h-3.5 w-3.5 text-brand-300" />
              {email}
            </a>
            <a
              href={`tel:${phone.replace(/\s/g, "")}`}
              className="flex items-center gap-1.5 transition hover:text-white"
            >
              <Icon name="phone" className="h-3.5 w-3.5 text-brand-300" />
              {phone}
            </a>
            <a
              href={`tel:${emergencyPhone.replace(/\s/g, "")}`}
              className="flex items-center gap-1.5 font-semibold text-cross-300 transition hover:text-cross-200"
            >
              <Icon name="ambulance" className="h-3.5 w-3.5" />
              Urgences 24h/24 — {emergencyPhone}
            </a>
          </div>
        </div>
      </div>

      {/* Navigation principale */}
      <div className="container-page flex h-[4.5rem] items-center justify-between gap-6">
        <Logo />

        <nav
          className="hidden items-stretch self-stretch lg:flex"
          aria-label="Navigation principale"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative flex items-center px-3.5 text-[0.83rem] font-medium tracking-wide transition-colors ${
                isActive(link.href)
                  ? "text-brand-800 after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:bg-cross-600"
                  : "text-slate-600 hover:text-brand-800"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <SearchDialog />
          <Link href="/triage" className="btn btn-ghost hidden xl:inline-flex">
            <Icon name="stethoscope" className="h-4 w-4" />
            Orientation
          </Link>
          <Link
            href="/consultation"
            className="btn btn-outline hidden xl:inline-flex"
          >
            <Icon name="calendar" className="h-4 w-4" />
            Consultation
          </Link>
          <Link href="/dons" className="btn btn-accent">
            <Icon name="hand-heart" className="h-4 w-4" />
            <span className="hidden sm:inline">Faire un don</span>
            <span className="sm:hidden">Don</span>
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Ouvrir le menu"
            aria-expanded={open}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-sand-300 text-brand-800 lg:hidden"
          >
            <Icon name={open ? "close" : "menu"} className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {open && (
        <div className="border-t border-sand-200 bg-white lg:hidden">
          <nav className="container-page py-2" aria-label="Menu mobile">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center justify-between border-b border-sand-100 py-3.5 text-[0.95rem] font-medium ${
                  isActive(link.href) ? "text-brand-800" : "text-slate-700"
                }`}
              >
                {link.label}
                <Icon
                  name="arrow-right"
                  className="h-4 w-4 text-sand-400"
                />
              </Link>
            ))}
            <Link
              href="/consultation"
              className="flex items-center gap-2 py-3.5 text-[0.95rem] font-semibold text-brand-700"
            >
              <Icon name="calendar" className="h-4 w-4" />
              Demander une consultation
            </Link>
            <Link
              href="/triage"
              className="flex items-center gap-2 py-3.5 text-[0.95rem] font-semibold text-brand-700"
            >
              <Icon name="stethoscope" className="h-4 w-4" />
              Quel service consulter ?
            </Link>
            <a
              href={`tel:${phone.replace(/\s/g, "")}`}
              className="flex items-center gap-2 pb-3 text-[0.95rem] font-semibold text-cross-600"
            >
              <Icon name="phone" className="h-4 w-4" />
              {phone}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
