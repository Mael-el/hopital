import type { Metadata } from "next";
import Link from "next/link";

import { PageHero } from "@/components/breadcrumb";
import { Icon } from "@/components/icons";
import { getPublishedNews } from "@/lib/content";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Actualités",
  description:
"Les actualités de l'hôpital « La Croix » de Zinvié : campagnes de chirurgie, dons de sang, partenariats et vie de l'établissement.",
};

export default async function NewsListPage() {
  const items = await getPublishedNews();
  const [featured, ...rest] = items;

  return (
    <>
      <PageHero
        eyebrow="Vie de l'hôpital"
        title="Actualités"
        subtitle="Campagnes de chirurgie, dons de sang, partenariats, programmes de santé :?styleActualités de l'hôpital « La Croix » de Zinvié."
        breadcrumb={[{ label: "Actualités" }]}
      />

      <section className="container-page py-14 lg:py-16">
        {featured && (
          <article className="card overflow-hidden lg:grid lg:grid-cols-2">
            <div className="flex flex-col justify-center bg-brand-900 p-8 text-white sm:p-10">
              <span className="badge w-fit bg-white/10 text-brand-100">
                {featured.category}
              </span>
              <h2 className="mt-4 text-2xl font-bold leading-tight sm:text-3xl">
                {featured.title}
              </h2>
              <p className="mt-3 flex items-center gap-2 text-sm text-brand-100/75">
                <Icon name="calendar" className="h-4 w-4" />
                {formatDate(featured.publishedAt)}
              </p>
              <p className="mt-5 leading-relaxed text-brand-100/85">
                {featured.excerpt}
              </p>
              <Link
                href={`/actualites/${featured.slug}`}
                className="btn btn-accent mt-7 w-fit"
              >
                Lire l&apos;article
                <Icon name="arrow-right" className="h-4 w-4" />
              </Link>
            </div>
            <div className="p-8 sm:p-10">
              <p className="section-label">
                À la une
              </p>
              <p className="mt-4 leading-relaxed text-slate-600">
                {featured.content.split("\n\n")[0]}
              </p>
            </div>
          </article>
        )}

        {rest.length > 0 && (
          <>
            <h2 className="mt-14 text-xl font-bold tracking-tight text-brand-900 sm:text-2xl">
              Toutes les publications
            </h2>
            <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {rest.map((item) => (
                <article
                  key={item.id}
                  className="card flex flex-col overflow-hidden transition "
                >
                  <div className="flex items-center justify-between gap-3 bg-brand-50 px-6 py-4">
                    <span className="badge bg-white text-brand-700">
                      {item.category}
                    </span>
                    <span className="text-xs text-slate-500">
                      {formatDate(item.publishedAt)}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-lg font-bold leading-snug text-brand-900">
                      <Link
                        href={`/actualites/${item.slug}`}
                        className="hover:text-brand-700"
                      >
                        {item.title}
                      </Link>
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">
                      {item.excerpt}
                    </p>
                    <Link
                      href={`/actualites/${item.slug}`}
                      className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700"
                    >
                      Lire la suite
                      <Icon name="arrow-right" className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </section>
    </>
  );
}
