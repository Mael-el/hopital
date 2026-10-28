import { AdminHeader, Field, SubmitButton, TextArea } from "@/components/admin/ui";
import { requireUser } from "@/lib/auth";
import { getAboutPage, getHospitalValues, getTimeline } from "@/lib/content";
import {
  deleteHospitalValue,
  deleteTimelineEntry,
  saveHospitalValue,
  saveTimelineEntry,
  updateAboutPage,
} from "../../actions";

export const dynamic = "force-dynamic";

export default async function AdminAboutContentPage() {
  await requireUser(["admin", "content"]);
  const [page, timeline, values] = await Promise.all([
    getAboutPage(),
    getTimeline(),
    getHospitalValues(),
  ]);

  const data = (page.data ?? {}) as {
    missionTitle?: string;
    missionText?: string;
    visionTitle?: string;
    visionText?: string;
    storyIntro?: string;
    partnershipText?: string;
    directions?: { name: string; role: string; text: string }[];
  };

  const directions = data.directions ?? [
    { name: "", role: "", text: "" },
    { name: "", role: "", text: "" },
    { name: "", role: "", text: "" },
  ];

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Contenu · À propos"
        description="Modifiez l'histoire, la mission, les valeurs et la direction de l'hôpital."
      />

      <form action={updateAboutPage} className="space-y-6">
        <section className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="font-bold text-slate-800">Page « À propos »</h2>
          <div className="mt-4 grid gap-4">
            <Field label="Titre" name="title" defaultValue={page.title} required />
            <Field label="Accroche" name="subtitle" defaultValue={page.subtitle} />
            <TextArea
              label="Texte d'introduction"
              name="body"
              defaultValue={page.body}
              rows={4}
            />
            <TextArea
              label="Récit de l'histoire"
              name="storyIntro"
              defaultValue={data.storyIntro ?? ""}
              rows={8}
            />
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h2 className="font-bold text-slate-800">Mission</h2>
            <div className="mt-4 grid gap-4">
              <Field
                label="Titre"
                name="missionTitle"
                defaultValue={data.missionTitle ?? ""}
              />
              <TextArea
                label="Texte"
                name="missionText"
                defaultValue={data.missionText ?? ""}
                rows={6}
              />
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h2 className="font-bold text-slate-800">Vision</h2>
            <div className="mt-4 grid gap-4">
              <Field
                label="Titre"
                name="visionTitle"
                defaultValue={data.visionTitle ?? ""}
              />
              <TextArea
                label="Texte"
                name="visionText"
                defaultValue={data.visionText ?? ""}
                rows={6}
              />
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="font-bold text-slate-800">Direction</h2>
          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            {directions.map((direction, index) => (
              <div key={index} className="space-y-3 rounded-lg border border-slate-100 p-3">
                <Field
                  label={`Nom ${index + 1}`}
                  name={`direction${index + 1}Name`}
                  defaultValue={direction.name}
                />
                <Field
                  label={`Fonction ${index + 1}`}
                  name={`direction${index + 1}Role`}
                  defaultValue={direction.role}
                />
                <TextArea
                  label={`Présentation ${index + 1}`}
                  name={`direction${index + 1}Text`}
                  defaultValue={direction.text}
                  rows={3}
                />
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="font-bold text-slate-800">Partenariats</h2>
          <div className="mt-4">
            <TextArea
              label="Texte sur la collaboration et les partenaires"
              name="partnershipText"
              defaultValue={data.partnershipText ?? ""}
              rows={4}
            />
          </div>
        </section>

        <SubmitButton label="Enregistrer la page À propos" />
      </form>

      {/* Frise chronologique */}
      <section className="rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="font-bold text-slate-800">Frise chronologique</h2>
        <p className="mt-1 text-sm text-slate-600">
          Les étapes de l&apos;histoire de l&apos;hôpital, de 1972 à aujourd&apos;hui.
        </p>

        <div className="mt-5 space-y-3">
          {timeline.map((entry) => (
            <div
              key={entry.id}
              className="rounded-lg border border-slate-200 p-4"
            >
              <form action={saveTimelineEntry} className="grid gap-3">
                <input type="hidden" name="id" value={entry.id} />
                <div className="grid gap-3 sm:grid-cols-4">
                  <Field label="Année" name="year" defaultValue={entry.year} />
                  <div className="sm:col-span-2">
                    <Field label="Titre" name="title" defaultValue={entry.title} />
                  </div>
                  <Field
                    label="Ordre"
                    name="order"
                    type="number"
                    defaultValue={String(entry.order)}
                  />
                </div>
                <TextArea
                  label="Description"
                  name="description"
                  defaultValue={entry.description}
                  rows={3}
                />
                <div className="flex gap-2">
                  <SubmitButton label="Mettre à jour" />
                </div>
              </form>
              <form action={deleteTimelineEntry} className="mt-2">
                <input type="hidden" name="id" value={entry.id} />
                <button
                  type="submit"
                  className="text-xs font-semibold text-cross-600 hover:underline"
                >
                  Supprimer cette étape
                </button>
              </form>
            </div>
          ))}
        </div>

        <form
          action={saveTimelineEntry}
          className="mt-5 grid gap-3 rounded-lg bg-slate-50 p-4"
        >
          <p className="text-sm font-semibold text-slate-700">
            Ajouter une étape
          </p>
          <div className="grid gap-3 sm:grid-cols-4">
            <Field label="Année" name="year" required />
            <div className="sm:col-span-2">
              <Field label="Titre" name="title" required />
            </div>
            <Field label="Ordre" name="order" type="number" defaultValue="99" />
          </div>
          <TextArea label="Description" name="description" rows={3} required />
          <div>
            <SubmitButton label="Ajouter l'étape" />
          </div>
        </form>
      </section>

      {/* Valeurs */}
      <section className="rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="font-bold text-slate-800">Valeurs de l&rsquo;hôpital</h2>
        <div className="mt-5 space-y-3">
          {values.map((value) => (
            <div key={value.id} className="rounded-lg border border-slate-200 p-4">
              <form action={saveHospitalValue} className="grid gap-3">
                <input type="hidden" name="id" value={value.id} />
                <div className="grid gap-3 sm:grid-cols-3">
                  <Field label="Titre" name="title" defaultValue={value.title} />
                  <Field label="Icône" name="icon" defaultValue={value.icon} />
                  <Field
                    label="Ordre"
                    name="order"
                    type="number"
                    defaultValue={String(value.order)}
                  />
                </div>
                <TextArea
                  label="Description"
                  name="description"
                  defaultValue={value.description}
                  rows={3}
                />
                <div>
                  <SubmitButton label="Mettre à jour" />
                </div>
              </form>
              <form action={deleteHospitalValue} className="mt-2">
                <input type="hidden" name="id" value={value.id} />
                <button
                  type="submit"
                  className="text-xs font-semibold text-cross-600 hover:underline"
                >
                  Supprimer cette valeur
                </button>
              </form>
            </div>
          ))}
        </div>

        <form
          action={saveHospitalValue}
          className="mt-5 grid gap-3 rounded-lg bg-slate-50 p-4"
        >
          <p className="text-sm font-semibold text-slate-700">Ajouter une valeur</p>
          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="Titre" name="title" required />
            <Field label="Icône" name="icon" defaultValue="heart" />
            <Field label="Ordre" name="order" type="number" defaultValue="99" />
          </div>
          <TextArea label="Description" name="description" rows={3} required />
          <div>
            <SubmitButton label="Ajouter la valeur" />
          </div>
        </form>
      </section>
    </div>
  );
}
