"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "@/components/icons";

export type AdminNavItem = {
  href: string;
  label: string;
  icon: IconName;
  badge?: number;
};

export function AdminNav({ items }: { items: AdminNavItem[] }) {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {items.map((item) => {
        const active =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
              active
                ? "bg-brand-700 text-white "
                : "text-slate-600 hover:bg-slate-100 hover:text-brand-800"
            }`}
          >
            <Icon name={item.icon} className="h-4.5 w-4.5 shrink-0" />
            <span className="flex-1">{item.label}</span>
            {typeof item.badge === "number" && item.badge > 0 && (
              <span
                className={`rounded-full px-2 py-0.5 text-[0.7rem] font-bold ${
                  active ? "bg-white/20 text-white" : "bg-cross-100 text-cross-700"
                }`}
              >
                {item.badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
