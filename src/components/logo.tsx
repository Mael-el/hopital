import Image from "next/image";
import Link from "next/link";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" aria-label="Hôpital La Croix de Zinvié — Accueil" className="group flex items-center gap-1.5 sm:gap-3">
      <Image
        src="/images/logo.jpeg"
        alt="Logo de l'Hôpital La Croix de Zinvié"
        width={228}
        height={220}
        priority
        className="h-9 w-9 shrink-0 rounded-lg object-contain sm:h-11 sm:w-11"
      />
      {!compact && (
        <span className="leading-tight">
          <span className="block whitespace-nowrap font-serif text-[0.875rem] font-bold text-brand-900 sm:text-xl">
            Hôpital La Croix
          </span>
          <span className="mt-0.5 block whitespace-nowrap text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-cross-600">
            de Zinvié
          </span>
        </span>
      )}
    </Link>
  );
}
