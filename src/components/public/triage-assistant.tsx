"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Icon, type IconName } from "@/components/icons";

type Motif = {
  id: string;
  label: string;
  icon: IconName;
  serviceSlug: string;
  serviceName: string;
  symptoms: string[];
};

const MOTIFS: Motif[] = [
  {
    id: "douleurs",
    label: "Douleurs, fièvre ou symptômes généraux",
    icon: "stethoscope",
    serviceSlug: "medecine-generale",
    serviceName: "Médecine générale",
    symptoms: [
      "Fièvre",
      "Douleur abdominale",
      "Maux de tête",
      "Toux ou gêne respiratoire",
      "Fatigue persistante",
    ],
  },
  {
    id: "femme_enfant",
    label: "Grossesse, accouchement ou suivi de l'enfant",
    icon: "baby",
    serviceSlug: "gynecologie-obstetrique",
    serviceName: "Gynécologie-obstétrique",
    symptoms: [
      "Retard de règles",
      "Suivi de grossesse",
      "Douleur pelvienne",
      "Fièvre de l'enfant",
      "Vaccination de l'enfant",
    ],
  },
  {
    id: "accident",
    label: "Accident, blessure ou douleur aiguë",
    icon: "ambulance",
    serviceSlug: "urgences",
    serviceName: "Urgences",
    symptoms: [
      "Chute ou accident",
      "Plaie ouverte",
      "Fracture ou entorse",
      "Brûlure",
      "Traumatisme crânien",
    ],
  },
  {
    id: "chrono",
    label: "Maladie chronique ou suivi régulier",
    icon: "activity",
    serviceSlug: "medecine-generale",
    serviceName: "Médecine générale",
    symptoms: [
      "Hypertension",
      "Diabète",
      "Asthme",
      "Suivi de traitement",
      "Certificat médical",
    ],
  },
  {
    id: "bilan",
    label: "Bilan, analyses ou examen spécialisée",
    icon: "microscope",
    serviceSlug: "laboratoire",
    serviceName: "Laboratoire & analyses",
    symptoms: [
      "Analyse de sang",
      "Examen d'urine",
      "Test de grossesse",
      "Dépistage",
      "Certificat",
    ],
  },
  {
    id: "specialiste",
    label: "Trouble de la vue, ORL ou cardiaque",
    icon: "eye",
    serviceSlug: "ophtalmologie",
    serviceName: "Ophtalmologie",
    symptoms: [
      "Vue floue",
      "Douleur oculaire",
      "Perte de vision",
      "Maux de tête",
      "Vertiges",
    ],
  },
];

const DURATIONS = [
  { id: "jour", label: "Moins de 24 heures" },
  { id: "semaine", label: "1 à 7 jours" },
  { id: "mois", label: "Plus d'une semaine" },
  { id: "long", label: "Plus d'un mois" },
];

const GRAVITIES = [
  { id: "leger", label: "Léger", note: "Gênant mais supportable" },
  { id: "modere", label: "Modéré", note: "Dort mal ou gêne les activités" },
  { id: "fort", label: "Fort", note: "Douleur intense, fièvre élevée" },
  { id: "critique", label: "Très fort / critique", note: "Difficulté à respirer, perte de connaissance" },
];

const PROFILES = [
  { id: "aucun", label: "Aucune situation particulière" },
  { id: "enceinte", label: "Patiente enceinte" },
  { id: "enfant", label: "Enfant de moins de 5 ans" },
  { id: "personne_agee", label: "Personne de plus de 70 ans" },
  { id: "immunodepresse", label: "Maladie chronique / immunodépression" },
];

type Outcome = {
  level: "critique" | "urgent" | "semaine" | "programme";
  title: string;
  message: string;
  serviceSlug: string;
  serviceName: string;
  hours: string;
  color: string;
  border: string;
  badge: string;
};

export function TriageAssistant() {
  const [step, setStep] = useState(0);
  const [motif, setMotif] = useState<Motif | null>(null);
  const [symptom, setSymptom] = useState("");
  const [duration, setDuration] = useState("");
  const [gravity, setGravity] = useState("");
  const [profile, setProfile] = useState("");

  const outcome = useMemo<Outcome | null>(() => {
    if (!motif || !gravity) return null;

    const critical =
      gravity === "critique" ||
      (motif.id === "accident" && gravity !== "leger") ||
      (profile === "enceinte" && symptom === "Douleur pelvienne") ||
      (profile === "enfant" && gravity === "fort");

    const urgent =
      !critical &&
      (gravity === "fort" ||
        duration === "jour" ||
        (motif.id === "accident" && gravity === "modere"));

    const week = !critical && !urgent && gravity === "modere";
    const programme = !critical && !urgent && !week;

    if (critical) {
      return {
        level: "critique",
        title: "Passez aux urgences immédiatement",
        message:
          "Votre situation nécessite une prise en charge urgente. Rendez-vous directement au service des urgences de l'hôpital, ou appelez le SAMU. Ne restez pas seul(e) et évitez tout déplacement en transports personnels si la douleur est intense.",
        serviceSlug: "urgences",
        serviceName: "Urgences",
        hours: "En permanence — 24h/24 et 7j/7",
        color: "bg-cross-50 text-cross-700",
        border: "border-cross-300",
        badge: "Urgence",
      };
    }

    if (urgent) {
      return {
        level: "urgent",
        title: "Consultez dans les 24 à 48 heures",
        message:
          "Vos symptômes justifient une consultation rapide. Passez au service de consultations ou appelez l'accueil pour connaître la disponibilité du médecin. En cas d'aggravation, rejoignez immédiatement les urgences.",
        serviceSlug: motif.serviceSlug,
        serviceName: motif.serviceName,
        hours:
          motif.id === "accident"
            ? "En permanence — 24h/24 et 7j/7"
            : "Lundi – Vendredi : 8h00 – 16h00",
        color: "bg-amber-50 text-amber-800",
        border: "border-amber-300",
        badge: "Rapidement",
      };
    }

    if (week) {
      return {
        level: "semaine",
        title: "Une consultation dans la semaine est indiquée",
        message:
          "Votre situation peut être prise en charge en consultation programmée. Envoyez votre demande : l'hôpital vous rappellera pour fixer un rendez-vous à votre convenance.",
        serviceSlug: motif.serviceSlug,
        serviceName: motif.serviceName,
        hours: "Lundi – Vendredi : 8h00 – 16h00",
        color: "bg-brand-50 text-brand-800",
        border: "border-brand-300",
        badge: "Sous 7 jours",
      };
    }

    return {
      level: "programme",
      title: "Un rendez-vous programmé convient",
      message:
      "Votre demande peut être planifiée sereinement. Choisissez une consultation de spécialité (sur rendez-vous) ou une consultation générale, et l'hôpital vous rappellera pour convenir de la date.",
      serviceSlug: motif.serviceSlug,
      serviceName: motif.serviceName,
      hours: "Lundi – Vendredi : 8h00 – 16h00",
      color: "bg-slate-100 text-slate-700",
      border: "border-slate-300",
      badge: "Programmé",
    };
  }, [motif, symptom, duration, gravity, profile]);

  const stepTitle = [
    "Quel est le motif principal de votre venue ?",
    "Quel symptôme vous amène aujourd'hui ?",
    "Depuis combien de temps ?",
    "Quel est le niveau d'intensité ?",
    "Une situation particulière ?",
  ][step];

  const motifSummary = motif ? (
    <span className="text-brand-800">{motif.label}</span>
  ) : (
    <span className="text-slate-400">Non renseigné</span>
  );

  const consultationHref = outcome
    ? `/consultation?service=${outcome.serviceSlug}&motif=${encodeURIComponent(
        `${symptom || motif?.label} — depuis ${
          DURATIONS.find((d) => d.id === duration)?.label.toLowerCase() ?? "quelques jours"
        }${
          profile !== "aucun"
            ? ` — patient : ${PROFILES.find((p) => p.id === profile)?.label.toLowerCase()}`
            : ""
        }`,
      )}`
    : "/consultation";

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
      {/* Colonne formulaire */}
      <div className="border border-sand-200 bg-white">
        <div className="border-b border-sand-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-cross-600">
              Étape {step + 1} sur 5
            </p>
            <p className="text-xs text-slate-500">{motifSummary}</p>
          </div>
          <div className="mt-3 flex gap-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <span
                key={index}
                className={`h-1 flex-1 rounded-full ${
                  index <= step ? "bg-brand-700" : "bg-sand-200"
                }`}
              />
            ))}
          </div>
          <h2 className="mt-4 font-serif text-xl font-bold text-brand-900">
            {stepTitle}
          </h2>
        </div>

        <div className="px-6 py-6">
          {step === 0 && (
            <div className="grid gap-2.5">
              {MOTIFS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setMotif(item);
                    setSymptom("");
                    setStep(1);
                  }}
                  className={`flex items-center gap-3 border px-4 py-3 text-left text-sm transition ${
                    motif?.id === item.id
                      ? "border-brand-600 bg-brand-50 font-medium text-brand-900"
                      : "border-sand-200 text-slate-700 hover:border-brand-400"
                  }`}
                >
                  <Icon name={item.icon} className="h-4 w-4 text-brand-700" />
                  {item.label}
                </button>
              ))}
            </div>
          )}

          {step === 1 && (
            <div className="grid gap-2.5">
              {motif?.symptoms.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setSymptom(item);
                    setStep(2);
                  }}
                  className={`border px-4 py-3 text-left text-sm transition ${
                    symptom === item
                      ? "border-brand-600 bg-brand-50 font-medium text-brand-900"
                      : "border-sand-200 text-slate-700 hover:border-brand-400"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-2.5">
              {DURATIONS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setDuration(item.id);
                    setStep(3);
                  }}
                  className={`border px-4 py-3 text-left text-sm transition ${
                    duration === item.id
                      ? "border-brand-600 bg-brand-50 font-medium text-brand-900"
                      : "border-sand-200 text-slate-700 hover:border-brand-400"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="grid gap-2.5">
              {GRAVITIES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setGravity(item.id);
                    setStep(4);
                  }}
                  className={`border px-4 py-3 text-left transition ${
                    gravity === item.id
                      ? "border-brand-600 bg-brand-50 text-brand-900"
                      : "border-sand-200 hover:border-brand-400"
                  }`}
                >
                  <span className="block text-sm font-medium">{item.label}</span>
                  <span className="mt-0.5 block text-xs text-slate-500">
                    {item.note}
                  </span>
                </button>
              ))}
            </div>
          )}

          {step === 4 && (
            <div className="grid gap-2.5">
              {PROFILES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setProfile(item.id)}
                  className={`border px-4 py-3 text-left text-sm transition ${
                    profile === item.id
                      ? "border-brand-600 bg-brand-50 font-medium text-brand-900"
                      : "border-sand-200 text-slate-700 hover:border-brand-400"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-sand-200 bg-sand-50 px-6 py-4">
          <button
            type="button"
            disabled={step === 0}
            onClick={() => setStep((value) => Math.max(0, value - 1))}
            className="btn btn-ghost disabled:opacity-40"
          >
            Précédent
          </button>
          {step < 4 ? (
            <button
              type="button"
              disabled={
                (step === 0 && !motif) ||
                (step === 1 && !symptom) ||
                (step === 2 && !duration) ||
                (step === 3 && !gravity)
              }
              onClick={() => setStep((value) => Math.min(4, value + 1))}
              className="btn btn-primary disabled:opacity-40"
            >
              Continuer
              <Icon name="arrow-right" className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setStep(0);
                setMotif(null);
                setSymptom("");
                setDuration("");
                setGravity("");
                setProfile("");
              }}
              className="btn btn-ghost"
            >
              Recommencer
            </button>
          )}
        </div>
      </div>

      {/* Colonne résultat */}
      <div>
        {outcome ? (
          <div className={`border ${outcome.border} bg-white p-6`}>
            <span
              className={`badge ${outcome.color}`}
            >
              <Icon
                name={outcome.level === "critique" ? "ambulance" : "check"}
                className="h-3 w-3"
              />
              {outcome.badge}
            </span>
            <h3 className="mt-4 font-serif text-xl font-bold text-brand-900">
              {outcome.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              {outcome.message}
            </p>

            <dl className="mt-6 space-y-3 border-t border-sand-200 pt-5 text-sm">
              <div className="flex gap-3">
                <Icon name="hospital" className="mt-0.5 h-4 w-4 text-brand-700" />
                <div>
                  <dt className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-slate-500">
                    Service recommandé
                  </dt>
                  <dd className="font-medium text-slate-800">
                    {outcome.serviceName}
                  </dd>
                </div>
              </div>
              <div className="flex gap-3">
                <Icon name="clock" className="mt-0.5 h-4 w-4 text-brand-700" />
                <div>
                  <dt className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-slate-500">
                    Horaires
                  </dt>
                  <dd className="font-medium text-slate-800">{outcome.hours}</dd>
                </div>
              </div>
            </dl>

            <div className="mt-6 flex flex-col gap-2.5">
              {outcome.level === "critique" ? (
                <a href="tel:+2290195968400" className="btn btn-accent w-full">
                  <Icon name="phone" className="h-4 w-4" />
                  Appeler les urgences : +229 01 95 96 84 00
                </a>
              ) : (
                <Link href={consultationHref} className="btn btn-primary w-full">
                  <Icon name="calendar" className="h-4 w-4" />
                  Demander une consultation dans ce service
                </Link>
              )}
              <a href="tel:+2290195968400" className="btn btn-ghost w-full">
                <Icon name="phone" className="h-4 w-4" />
                Appeler l&rsquo;accueil
              </a>
            </div>

            <p className="mt-5 border-t border-sand-200 pt-4 text-xs leading-relaxed text-slate-500">
              Cette orientation ne remplace pas l&apos;avis d&apos;un professionnel de
              santé. En cas de doute ou d&apos;aggravation, consultez sans
              attendre.
            </p>
          </div>
        ) : (
          <div className="border border-dashed border-sand-300 bg-sand-50 p-8 text-center">
            <Icon name="stethoscope" className="mx-auto h-8 w-8 text-sand-400" />
            <p className="mt-4 font-serif text-lg font-bold text-brand-900">
              Votre orientation apparaîtra ici
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Répondez aux cinq questions pour savoir quel service consulter et
              dans quel délai. Ce service gratuit ne remplace pas une
              consultation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
