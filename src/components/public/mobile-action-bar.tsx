import Link from "next/link";

import { Icon } from "@/components/icons";

/**
 * Barre d'actions rapides affichée uniquement sur mobile :
 * appeler l'accueil, les urgences ou demander une consultation en un geste.
 */
export function MobileActionBar({
  phone,
  emergencyPhone,
}: {
  phone: string;
  emergencyPhone: string;
}) {
  const dial = (value: string) => `tel:${value.replace(/\s/g, "")}`;

  const itemClass =
    "flex flex-col items-center justify-center gap-1 py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.08em] transition-colors";

  return (
    <nav
      aria-label="Actions rapides"
      className="no-print fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-sand-300 bg-white/95 shadow-[0_-1px_8px_rgba(9,42,64,0.08)] backdrop-blur lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <a href={dial(phone)} className={`${itemClass} text-brand-800`}>
        <Icon name="phone" className="h-5 w-5" />
        Appeler
      </a>
      <a
        href={dial(emergencyPhone)}
        className={`${itemClass} border-x border-sand-200 text-cross-600`}
      >
        <Icon name="ambulance" className="h-5 w-5" />
        Urgences
      </a>
      <Link href="/consultation" className={`${itemClass} text-brand-800`}>
        <Icon name="calendar" className="h-5 w-5" />
        Consultation
      </Link>
    </nav>
  );
}
