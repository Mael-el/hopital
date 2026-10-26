import Link from "next/link";
import { asc } from "drizzle-orm";

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
import { faqs } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { deleteFaq, saveFaq } from "../actions";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ modifier?: string; nouveau?: string }> };

export default async function AdminFaqPage({ searchParams }: Props) {
  await requireUser(["admin", "content"]);
  const { modifier, nouveau } = await searchParams;

  const all = await db.select().from(faqs).orderBy(asc(faqs.order));
  const editing = modifier
    ? all.find((faq) => String(faq.id) === modifier) ?? null
    : null;
  const showForm = Boolean(nouveau) || Boolean(editing);

  return (
    <div>
      <AdminHeader
        title="Questions fréquentes"
        description="Ajoutez les questions que les patients et visiteurs posent le plus souvent."
        action={
          <Link href="/admin/faq?nouveau=1" className="btn btn-primary">
            <Icon name="tag" className="h-4 w-4" />
            Ajouter une question
          </Link>
        }
      />

      {showForm && (
        <form
          action={saveFaq}
          className="mb-8 rounded-[3px] border border-brand-200 bg-white p-6"
        >
          {editing && <input type="hidden" name="id" value={editing.id} />}
          <h2 className="font-bold text-slate-800">
            {editing ? "Modifier la question" : "Nouvelle question"}
          </h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <Field
                label="Question"
                name="question"
                defaultValue={editing?.question ?? ""}
                required
              />
            </div>
            <Field
              label="Catégorie"
              name="category"
              defaultValue={editing?.category ?? "Général"}
            />
          </div>
          <div className="mt-4">
            <TextArea
              label="Réponse"
              name="answer"
              defaultValue={editing?.answer ?? ""}
              rows={6}
              required
            />
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field
              label="Ordre d'affichage"
              name="order"
              type="number"
              defaultValue={String(editing?.order ?? all.length + 1)}
            />
            <div className="flex items-end">
              <Checkbox
                label="Publier sur le site"
                name="published"
                defaultChecked={editing?.published ?? true}
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <SubmitButton label={editing ? "Enregistrer" : "Ajouter"} />
            <Link href="/admin/faq" className="btn btn-ghost">
              Annuler
            </Link>
          </div>
        </form>
      )}

      {all.length === 0 ? (
        <EmptyState
          title="Aucune question"
          text="Ajoutez la première question fréquente."
          icon="tag"
        />
      ) : (
        <div className="space-y-3">
          {all.map((faq) => (
            <div key={faq.id} className="rounded-[3px] border border-slate-200 bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-slate-800">{faq.question}</p>
                  <p className="mt-1 max-w-3xl text-sm text-slate-600">{faq.answer}</p>
                  <p className="mt-2 text-xs text-slate-400">{faq.category}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={faq.published ? "published" : "unpublished"} />
                  <Link
                    href={`/admin/faq?modifier=${faq.id}`}
                    className="rounded-[3px] border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-brand-400 hover:text-brand-700"
                  >
                    Modifier
                  </Link>
                  <form action={deleteFaq}>
                    <input type="hidden" name="id" value={faq.id} />
                    <button
                      type="submit"
                      className="rounded-[3px] border border-cross-200 px-3 py-1.5 text-xs font-semibold text-cross-700 hover:bg-cross-50"
                    >
                      Supprimer
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
