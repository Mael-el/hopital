import { requireUser } from "@/lib/auth";
import { getHomePage } from "@/lib/content";
import { AdminHeader, Field, SubmitButton, TextArea } from "@/components/admin/ui";
import { updateHomePage } from "../../actions";

export const dynamic = "force-dynamic";

export default async function AdminHomeContentPage() {
  await requireUser(["admin", "content"]);
  const page = await getHomePage();

  const data = (page.data ?? {}) as {
    heroKicker?: string;
    heroTitle?: string;
    heroText?: string;
    stats?: { value: string; label: string }[];
    pillars?: { title: string; text: string }[];
  };

  const stats = data.stats ?? [
    { value: "", label: "" },
    { value: "", label: "" },
    { value: "", label: "" },
    { value: "", label: "" },
  ];
  const pillars = data.pillars ?? [
    { title: "", text: "" },
    { title: "", text: "" },
    { title: "", text: "" },
  ];

  return (
    <div>
      <AdminHeader
        title="Contenu · Page d'accueil"
        description="Modifiez les textes de présentation, les chiffres clés et les points forts affichés sur la page d'accueil."
      />

      <form action={updateHomePage} className="space-y-6">
        <section className="rounded-[3px] border border-slate-200 bg-white p-6">
          <h2 className="font-bold text-slate-800">Bandeau principal</h2>
          <div className="mt-4 grid gap-4">
            <Field
              label="Titre de la page"
              name="title"
              defaultValue={page.title}
              required
            />
            <Field
              label="Accroche (sous-titre)"
              name="subtitle"
              defaultValue={page.subtitle}
            />
            <Field
              label="Sur-titre du bandeau"
              name="heroKicker"
              defaultValue={data.heroKicker ?? ""}
            />
            <Field
              label="Titre du bandeau"
              name="heroTitle"
              defaultValue={data.heroTitle ?? ""}
            />
            <TextArea
              label="Texte d'introduction"
              name="heroText"
              defaultValue={data.heroText ?? ""}
              rows={4}
            />
            <TextArea
              label="Présentation de l'hôpital (accueil)"
              name="body"
              defaultValue={page.body}
              rows={8}
            />
          </div>
        </section>

        <section className="rounded-[3px] border border-slate-200 bg-white p-6">
          <h2 className="font-bold text-slate-800">Chiffres clés</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="space-y-3 rounded-[3px] border border-slate-100 p-3">
                <Field
                  label={`Valeur ${index + 1}`}
                  name={`stat${index + 1}Value`}
                  defaultValue={stat.value}
                />
                <Field
                  label={`Légende ${index + 1}`}
                  name={`stat${index + 1}Label`}
                  defaultValue={stat.label}
                />
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[3px] border border-slate-200 bg-white p-6">
          <h2 className="font-bold text-slate-800">Points forts</h2>
          <div className="mt-4 space-y-4">
            {pillars.map((pillar, index) => (
              <div key={index} className="space-y-3 rounded-[3px] border border-slate-100 p-3">
                <Field
                  label={`Titre ${index + 1}`}
                  name={`pillar${index + 1}Title`}
                  defaultValue={pillar.title}
                />
                <TextArea
                  label={`Texte ${index + 1}`}
                  name={`pillar${index + 1}Text`}
                  defaultValue={pillar.text}
                  rows={3}
                />
              </div>
            ))}
          </div>
        </section>

        <div className="flex items-center gap-3">
          <SubmitButton label="Enregistrer l'accueil" />
          <a href="/" target="_blank" className="text-sm font-semibold text-brand-700 underline">
            Voir la page en ligne
          </a>
        </div>
      </form>
    </div>
  );
}
