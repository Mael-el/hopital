import Link from "next/link";
import { Icon } from "./icons";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-3">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-800 text-white transition-colors group-hover:bg-cross-600">
        <Icon name="cross" className="h-5 w-5" strokeWidth={2.2} />
      </span>
      {!compact && (
        <span className="leading-tight">
          <span className="block font-serif text-[1.05rem] font-bold text-brand-900 sm:text-xl">
            Hôpital La Croix
          </span>
          <span className="mt-0.5 block text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-cross-600">
            de Zinvié
          </span>
        </span>
      )}
    </Link>
  );
}
