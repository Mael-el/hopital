import Link from "next/link";
import { Icon } from "./icons";

export type Crumb = { label: string; href?: string };

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Fil d'Ariane" className="text-xs">
      <ol className="flex flex-wrap items-center gap-2 text-brand-200/70">
        <li>
          <Link href="/" className="transition hover:text-white">
            Accueil
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center gap-2">
            <Icon name="arrow-right" className="h-3 w-3 rotate-180 text-brand-300/60" />
            {item.href ? (
              <Link href={item.href} className="transition hover:text-white">
                {item.label}
              </Link>
            ) : (
              <span className="font-medium text-white">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PageHero({
  title,
  subtitle,
  eyebrow,
  breadcrumb,
  children,
}: {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  breadcrumb?: Crumb[];
  children?: React.ReactNode;
}) {
  return (
    <section className="page-hero-surface border-t-4 border-cross-600 text-white">
      <div className="container-page py-12 sm:py-16">
        {breadcrumb && (
          <div className="mb-7">
            <Breadcrumb items={breadcrumb} />
          </div>
        )}
        <div className="max-w-3xl">
          {eyebrow && (
            <p className="mb-4 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-cross-300">
              {eyebrow}
            </p>
          )}
          <h1 className="font-serif text-3xl font-bold leading-[1.15] tracking-tight text-white sm:text-4xl lg:text-[2.85rem]">
            {title}
          </h1>
          {subtitle && (
            <>
              <div className="mt-6 h-px w-16 bg-cross-500" />
              <p className="mt-6 max-w-2xl text-[0.98rem] leading-relaxed text-brand-100/80">
                {subtitle}
              </p>
            </>
          )}
          {children && <div className="mt-8">{children}</div>}
        </div>
      </div>
    </section>
  );
}
