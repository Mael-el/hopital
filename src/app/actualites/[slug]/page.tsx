import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumb, PageHero } from "@/components/breadcrumb";
import { Icon } from "@/components/icons";
import { getNewsBySlug, getPublishedNews } from "@/lib/content";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await getNewsBySlug(slug);
  if (!item) return { title: "Actualité introuvable" };
  return { title: item.title, description: item.excerpt };
}

export default async function NewsArticlePage({ params }: Props) {
  const { slug } = await params;
  const item = await getNewsBySlug(slug);
  if (!item) notFound();

  const others = (await getPublishedNews(4)).filter((entry) => entry.id !== item.id);

  return (
    <>
      <PageHero
        eyebrow={item.category}
        title={item.title}
        breadcrumb={[
          { label: "Actualités", href: "/actualites" },
          { label: item.category },
        ]}
      />

      <article className="container-page py-14 lg:py-16">
        <div className="mx-auto max-w-3xl">
          <div className="flex flex-wrap items-center gap-5 border-b border-slate-200 pb-6 text-sm text-slate-500">
            <span className="flex items-center gap-2">
              <Icon name="calendar" className="h-4 w-4 text-brand-600" />
              {formatDate(item.publishedAt)}
            </span>
            <span className="flex items-center gap-2">
              <Icon name="users" className="h-4 w-4 text-brand-600" />
              {item.author}
            </span>
          </div>

          <p className="mt-8 text-lg font-medium leading-relaxed text-brand-900">
            {item.excerpt}
          </p>

          <div className="prose-hospital mt-6 text-slate-600">
            {item.content.split("\n\n").map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-10 rounded-xl bg-brand-50 p-6">
            <p className="text-sm leading-relaxed text-brand-900">
              Pour toute information sur cette actualité, contactez l&apos;accueil
              de l&apos;hôpital « La Croix » de Zinvié au{" "}
              <strong>+229 97 21 48 39</strong> ou par email à{" "}
              <strong>hlacroixdezinvie@yahoo.com</strong>.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href="/contact" className="btn btn-primary">
                Nous contacter
              </Link>
              <Link href="/consultation" className="btn btn-ghost">
                Demander une consultation
              </Link>
            </div>
          </div>

          <div className="mt-10 border-t border-slate-200 pt-6">
            <Breadcrumb
              items={[
                { label: "Actualités", href: "/actualites" },
                { label: item.title },
              ]}
            />
          </div>
        </div>

        {others.length > 0 && (
          <div className="mx-auto mt-16 max-w-5xl">
            <h2 className="text-lg font-bold text-brand-900">
              À lire également
            </h2>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {others.slice(0, 3).map((entry) => (
                <Link
                  key={entry.id}
                  href={`/actualites/${entry.slug}`}
                  className="card group p-5 transition hover:border-brand-300 "
                >
                  <span className="badge bg-brand-50 text-brand-700">
                    {entry.category}
                  </span>
                  <h3 className="mt-3 font-semibold leading-snug text-brand-900 group-hover:text-brand-700">
                    {entry.title}
                  </h3>
                  <p className="mt-2 text-xs text-slate-500">
                    {formatDate(entry.publishedAt)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </>
  );
}
