import Link from "next/link";
import { Icon } from "./icons";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-1.5 sm:gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-800 text-white transition-colors group-hover:bg-cross-600 sm:h-11 sm:w-11">
        <Icon name="cross" className="h-5 w-5" strokeWidth={2.2} />
      </span>
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
