import Link from "next/link";
import { desc } from "drizzle-orm";

import {
  AdminHeader,
  Checkbox,
  EmptyState,
  Field,
  StatusBadge,
  SubmitButton,
  TextArea,
} from "@/components/admin/ui";
import { Icon } from "@/components/icons";
import { db } from "@/db";
import { news } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { formatDate } from "@/lib/format";
import { deleteNews, saveNews } from "../actions";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ modifier?: string; nouveau?: string }> };

function toDateInput(date: Date | null): string {
  if (!date) return "";
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
}

export default async function AdminNewsPage({ searchParams }: Props) {
  await requireUser(["admin", "content"]);
  const { modifier, nouveau } = await searchParams;

  const all = await db.select().from(news).orderBy(desc(news.publishedAt));
  const editing = modifier
    ? all.find((item) => String(item.id) === modifier) ?? null
    : null;
  const showForm = Boolean(nouveau) || Boolean(editing);

  return (
    <div>
      <AdminHeader
        title="Actualités"
        description="Publiez les actualités de l'hôpital. Les trois dernières apparaissent sur la page d'accueil."
        action={
          <Link href="/admin/actualites?nouveau=1" className="btn btn-primary">
            <Icon name="sparkles" className="h-4 w-4" />
            Publier une actualité
          </Link>
        }
      />

      {showForm && (
        <form
          action={saveNews}
          className="mb-8 rounded-lg border border-brand-200 bg-white p-6"
        >
          {editing && <input type="hidden" name="id" value={editing.id} />}
          <h2 className="font-bold text-slate-800">
            {editing ? "Modifier l'actualité" : "Nouvelle actualité"}
          </h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Field
                label="Titre"
                name="title"
                defaultValue={editing?.title ?? ""}
                required
              />
            </div>
            <Field
              label="Identifiant (URL)"
              name="slug"
              defaultValue={editing?.slug ?? ""}
              hint="Laissez vide pour un identifiant automatique."
            />
            <Field
              label="Catégorie"
              name="category"
              defaultValue={editing?.category ?? "Actualité"}
            />
            <Field
              label="Date de publication"
              name="publishedAt"
              type="date"
              defaultValue={toDateInput(editing?.publishedAt ?? null)}
            />
            <Field
              label="Auteur"
              name="author"
              defaultValue={editing?.author ?? "Hôpital La Croix de Zinvié"}
            />
          </div>

          <div className="mt-4 grid gap-4">
            <TextArea
              label="Extrait (affiché sur la liste)"
              name="excerpt"
              defaultValue={editing?.excerpt ?? ""}
              rows={3}
              required
            />
            <TextArea
              label="Contenu de l'article"
              name="content"
              defaultValue={editing?.content ?? ""}
              rows={12}
              required
            />
          </div>

          <div className="mt-4">
            <Checkbox
              label="Publier immédiatement"
              name="published"
              defaultChecked={editing?.published ?? true}
            />
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <SubmitButton label={editing ? "Enregistrer" : "Publier"} />
            <Link href="/admin/actualites" className="btn btn-ghost">
              Annuler
            </Link>
          </div>
        </form>
      )}

      {all.length === 0 ? (
        <EmptyState
          title="Aucune actualité"
          text="Publiez la première actualité de l'hôpital."
          icon="sparkles"
        />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Actualité</th>
                <th className="px-4 py-3">Catégorie</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {all.map((item) => (
                <tr key={item.id} className="align-top">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-800">{item.title}</p>
                    <p className="mt-0.5 max-w-xl text-xs text-slate-500">
                      {item.excerpt}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600">{item.category}</td>
                  <td className="px-4 py-3 text-xs text-slate-600">
                    {formatDate(item.publishedAt)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={item.published ? "published" : "unpublished"} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/actualites?modifier=${item.id}`}
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-brand-400 hover:text-brand-700"
                      >
                        Modifier
                      </Link>
                      {item.published && (
                        <a
                          href={`/actualites/${item.slug}`}
                          target="_blank"
                          className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-brand-400 hover:text-brand-700"
                        >
                          Voir
                        </a>
                      )}
                      <form action={deleteNews}>
                        <input type="hidden" name="id" value={item.id} />
                        <button
                          type="submit"
                          className="rounded-lg border border-cross-200 px-3 py-1.5 text-xs font-semibold text-cross-700 hover:bg-cross-50"
                        >
                          Supprimer
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
