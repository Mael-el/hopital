import { Icon, type IconName } from "@/components/icons";

export const EMERGENCY_NUMBERS: {
  label: string;
  number: string;
  tel: string;
  note: string;
  icon: IconName;
}[] = [
  {
    label: "Urgences — Hôpital La Croix",
    number: "+229 97 21 48 39",
    tel: "+22997214839",
    note: "24h/24 · 7j/7 ·Adultes & enfants",
    icon: "ambulance",
  },
  {
    label: "SAMU",
    number: "114",
    tel: "114",
    note: "Ambulance médicale — Bénin",
    icon: "ambulance",
  },
  {
    label: "Police",
    number: "166",
    tel: "166",
    note: "Urgences policières",
    icon: "shield",
  },
  {
    label: "Gendarmerie",
    number: "128",
    tel: "128",
    note: "Urgences gendarmerie",
    icon: "shield",
  },
  {
    label: "Protection civile",
    number: "118",
    tel: "118",
    note: "Secours & interventions d'urgence",
    icon: "users",
  },
];

export function whatsappLink(message: string): string {
  return `https://wa.me/22997214839?text=${encodeURIComponent(message)}`;
}

export function EmergencyPanel({
  variant = "dark",
}: {
  variant?: "dark" | "light";
}) {
  const dark = variant === "dark";

  return (
    <section
      className={
        dark
          ? "border-t-4 border-cross-600 bg-brand-950 py-14 text-white"
          : "border border-sand-200 bg-white py-12"
      }
    >
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p
              className={
                dark
                  ? "text-[0.68rem] font-bold uppercase tracking-[0.22em] text-cross-300"
                  : "section-label"
              }
            >
              En cas d&apos;urgence
            </p>
            <h2
              className={
                dark
                  ? "mt-5 font-serif text-2xl font-bold text-white sm:text-[1.9rem]"
                  : "section-title mt-5"
              }
            >
              Numéros d&apos;alerte et premiers secours
            </h2>
          </div>
          <p
            className={
              dark
                ? "max-w-md text-sm leading-relaxed text-brand-100/75"
                : "max-w-md text-sm leading-relaxed text-slate-600"
            }
          >
            Le service des urgences de l&apos;hôpital « La Croix » de Zinvié
            est assuré en permanence. En cas d&apos;urgence vitale, appelez le{" "}
            <strong className={dark ? "text-white" : "text-brand-800"}>
              97 21 48 39
            </strong>{" "}
            ou rapprochez-vous directement du service.
          </p>
        </div>

        <div
          className={`mt-9 grid gap-px sm:grid-cols-2 lg:grid-cols-5 ${
            dark ? "bg-white/10" : "bg-sand-200"
          }`}
        >
          {EMERGENCY_NUMBERS.map((item) => (
            <a
              key={item.number}
              href={`tel:${item.tel.replace(/\s/g, "")}`}
              className={`group flex flex-col px-5 py-6 transition ${
                dark
                  ? "bg-brand-950 hover:bg-brand-900"
                  : "bg-white hover:bg-brand-50"
              }`}
            >
              <Icon
                name={item.icon}
                className={`h-5 w-5 ${dark ? "text-cross-300" : "text-cross-600"}`}
              />
              <span
                className={`mt-4 text-[0.65rem] font-bold uppercase tracking-[0.12em] ${
                  dark ? "text-brand-200/70" : "text-slate-500"
                }`}
              >
                {item.label}
              </span>
              <span
                className={`mt-1 font-serif text-2xl font-bold ${
                  dark ? "text-white" : "text-brand-900"
                }`}
              >
                {item.number}
              </span>
              <span
                className={`mt-1.5 text-xs leading-relaxed ${
                  dark ? "text-brand-200/60" : "text-slate-500"
                }`}
              >
                {item.note}
              </span>
            </a>
          ))}
        </div>

        <div
          className={`mt-8 grid gap-4 md:grid-cols-3 ${
            dark ? "" : "border-t border-sand-200 pt-8"
          }`}
        >
          {[
            {
              title: "Gardez la personne allongée",
              text: "En cas de malaise, allongez la personne, desserrez ses vêtements et assurez la respiration.",
            },
            {
              title: "Notez l'heure et les symptômes",
              text: "Indiquez aux secours depuis quand et dans quel état se trouve la personne.",
            },
            {
              title: "Ne donnez rien à manger",
              text: "Sauf indication contraire, ne donnez ni aliment ni boisson à une personne inconsciente.",
            },
          ].map((tip) => (
            <div
              key={tip.title}
              className={
                dark
                  ? "border-l-2 border-cross-500 bg-white/5 p-5"
                  : "border-l-2 border-brand-300 bg-sand-50 p-5"
              }
            >
              <h3
                className={`font-serif text-base font-bold ${
                  dark ? "text-white" : "text-brand-900"
                }`}
              >
                {tip.title}
              </h3>
              <p
                className={`mt-1.5 text-sm leading-relaxed ${
                  dark ? "text-brand-100/70" : "text-slate-600"
                }`}
              >
                {tip.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
