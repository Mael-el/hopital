import { eq } from "drizzle-orm";
import { db } from "@/db";
import { siteSettings } from "@/db/schema";

export type ContactChannel = {
  label: string;
  value: string;
  detail: string;
};

export type SocialLink = {
  platform: string;
  label: string;
  url: string;
};

export type WebLink = {
  label: string;
  url: string;
};

export type StaffStat = {
  value: string;
  label: string;
};

export const DEFAULT_SETTINGS = {
  hospitalName: "Hôpital La Croix de Zinvié",
  legalName:
    "Centre de Santé à Vocation Humanitaire « La Croix » de Zinvié — Formation sanitaire des Religieux Camilliens",
  shortName: "La Croix de Zinvié",
  tagline:
    "Soins de qualité à coût abordable, dans l'esprit du service et de la solidarité.",
  presentation:
    "Nous sommes une structure sanitaire créée en 1974 par les Religieux Camilliens, dans le but d'offrir des soins à la population de Zinvié et ses environs. Structure confessionnelle, l'hôpital répond aux normes et offre des soins de qualité à un coût très abordable dans toutes ses dimensions : morale, spirituelle et physique.",
  addressLine1: "Yêvié, Route de Zinvié",
  addressLine2: "Commune d'Abomey-Calavi — Département de l'Atlantique, Bénin",
  addressLine3: "Code postal RN31 — 40 km de Cotonou, à 1 h de l'aéroport",
  phone: "+229 97 21 48 39",
  phoneSecondary: "+229 95 88 68 53",
  phoneEmergency: "+229 64 90 73 73",
  email: "hlacroixdezinvie@yahoo.com",
  emailSecondary: "hlacroxdezinvie@yahoo.com",
  emailDirection: "pmariusyabi@yahoo.it",
  emailLaboratory: "hounk.bru@gmail.com",
  website: "http://hopitallacroixzinvie.bj/",
  websiteSecondary: "http://hlacroix-zinvie.net/",
  facebook: "https://www.facebook.com/@hlacroixzinvie/",
  whatsapp: "https://wa.me/22997214839",
  mapEmbed:
    "https://www.google.com/maps?q=6.598807,2.363823&z=14&output=embed",
  mapLink:
    "https://www.google.com/maps/search/?api=1&query=6.598807,2.363823",
  mapCoordinates: "6.598807, 2.363823",
  plusCode: "H9W6+6P — RN31, Zinvié",
  openingHours: "Lundi – Vendredi : 8h00 – 16h00",
  emergencyHours: "Urgences : 24h/24 et 7j/7",
  saturdayHours: "Samedi : campagne de don de sang et urgences",
  beds: "100 lits",
  staffCount: "250 personnes",
  founded: "1974",
  populationBasin: "Bassin de population d'environ 1 million d'habitants",
  donationMethods: [
    {
      name: "MTN Mobile Money",
      detail: "Composez *133# puis validez la demande de paiement affichée.",
    },
    {
      name: "Moov Money",
      detail: "Validez la notification de paiement reçue sur votre téléphone.",
    },
    {
      name: "Carte bancaire",
      detail: "Visa et Mastercard acceptés via la page de paiement sécurisée.",
    },
  ],
  fedapayEnabled: true,
  archiveRetentionMonths: 24,

  /* ------------------- Développeur & maintenance technique ---------------- */
  developerName: "Ismail AGOHOUNDJE",
  developerRole: "Développeur & maintenance technique",
  developerEmail: "ismailagohoundje14@gmail.com",
  developerPhone: "01 61 79 19 67",
  developerNote:
    "Conception, développement et maintenance du site web de l'hôpital « La Croix » de Zinvié. Pour toute évolution, correction ou mise à jour du back-office.",

  /* --------------------------- Canaux de contact -------------------------- */
  contactChannels: [
    {
      label: "Standard & accueil",
      value: "+229 97 21 48 39",
      detail: "Du lundi au vendredi, 8h00 – 16h00",
    },
    {
      label: "Urgences (24h/24)",
      value: "+229 64 90 73 73",
      detail: "Adultes et enfants — 7j/7 et 24h/24",
    },
    {
      label: "Direction de l'hôpital",
      value: "+229 64 71 44 74",
      detail: "Père Marius Yabi — Directeur de l'hôpital",
    },
    {
      label: "Banque du sang & laboratoire",
      value: "+229 94 03 85 01",
      detail: "Père Bruno Hounkonnou — campagnes de don de sang",
    },
    {
      label: "Mobile & WhatsApp",
      value: "+229 95 88 68 53",
      detail: "Écoute, messages et demandes d'information",
    },
    {
      label: "Fax",
      value: "+229 64 90 73 73",
      detail: "Courriers administratifs et rapports",
    },
  ] as ContactChannel[],

  /* -------------------------- Réseaux & sites web ------------------------ */
  socialLinks: [
    {
      platform: "facebook",
      label: "Facebook",
      url: "https://www.facebook.com/@hlacroixzinvie/",
    },
    {
      platform: "whatsapp",
      label: "WhatsApp",
      url: "https://wa.me/22997214839",
    },
    {
      platform: "globe",
      label: "Site officiel",
      url: "http://hopitallacroixzinvie.bj/",
    },
    {
      platform: "globe",
      label: "Site secondaire",
      url: "http://hlacroix-zinvie.net/",
    },
    {
      platform: "users",
      label: "Fiche AMCES",
      url: "https://amces-benin.org/membres/hopital-la-croix-de-zinvie/",
    },
  ] as SocialLink[],

  webLinks: [
    {
      label: "Site officiel de l'hôpital",
      url: "http://hopitallacroixzinvie.bj/",
    },
    {
      label: "Présentation de l'hôpital (hlacroix-zinvie.net)",
      url: "http://hlacroix-zinvie.net/",
    },
    {
      label: "Fiche membre AMCES",
      url: "https://amces-benin.org/membres/hopital-la-croix-de-zinvie/",
    },
  ] as WebLink[],

  /* ---------------------------- Effectif réel ---------------------------- */
  staffStats: [
    { value: "250", label: "Personnes au total" },
    { value: "12", label: "Médecins permanents" },
    { value: "6+", label: "Médecins itinérants" },
    { value: "130", label: "Personnel médical" },
    { value: "13", label: "Sages-femmes & accoucheuses" },
    { value: "47", label: "Personnel administratif" },
  ] as StaffStat[],
} as const;

export type SiteSettings = {
  hospitalName: string;
  legalName: string;
  shortName: string;
  tagline: string;
  presentation: string;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  phone: string;
  phoneSecondary: string;
  phoneEmergency: string;
  email: string;
  emailSecondary: string;
  emailDirection: string;
  emailLaboratory: string;
  website: string;
  websiteSecondary: string;
  facebook: string;
  whatsapp: string;
  mapEmbed: string;
  mapLink: string;
  mapCoordinates: string;
  plusCode: string;
  openingHours: string;
  emergencyHours: string;
  saturdayHours: string;
  beds: string;
  staffCount: string;
  founded: string;
  populationBasin: string;
  donationMethods: { name: string; detail: string }[];
  fedapayEnabled: boolean;
  archiveRetentionMonths: number;
  developerName: string;
  developerRole: string;
  developerEmail: string;
  developerPhone: string;
  developerNote: string;
  contactChannels: ContactChannel[];
  socialLinks: SocialLink[];
  webLinks: WebLink[];
  staffStats: StaffStat[];
};

function arrayOr<T>(value: unknown, fallback: T[]): T[] {
  return Array.isArray(value) && value.length > 0 ? (value as T[]) : fallback;
}

export async function getSettings(): Promise<SiteSettings> {
  const rows = await db
    .select()
    .from(siteSettings)
    .where(eq(siteSettings.key, "hospital"))
    .limit(1);

  const stored = (rows[0]?.value ?? {}) as Partial<SiteSettings>;

  return {
    ...(DEFAULT_SETTINGS as unknown as SiteSettings),
    ...stored,
    donationMethods: arrayOr(
      stored.donationMethods,
      [...DEFAULT_SETTINGS.donationMethods] as SiteSettings["donationMethods"],
    ),
    contactChannels: arrayOr(
      stored.contactChannels,
      [...DEFAULT_SETTINGS.contactChannels] as SiteSettings["contactChannels"],
    ),
    socialLinks: arrayOr(
      stored.socialLinks,
      [...DEFAULT_SETTINGS.socialLinks] as SiteSettings["socialLinks"],
    ),
    webLinks: arrayOr(
      stored.webLinks,
      [...DEFAULT_SETTINGS.webLinks] as SiteSettings["webLinks"],
    ),
    staffStats: arrayOr(
      stored.staffStats,
      [...DEFAULT_SETTINGS.staffStats] as SiteSettings["staffStats"],
    ),
  };
}

export async function saveSettings(patch: Partial<SiteSettings>): Promise<void> {
  const current = await getSettings();
  const next: SiteSettings = { ...current, ...patch };

  const existing = await db
    .select()
    .from(siteSettings)
    .where(eq(siteSettings.key, "hospital"))
    .limit(1);

  if (existing.length === 0) {
    await db.insert(siteSettings).values({
      key: "hospital",
      value: next as unknown as Record<string, unknown>,
    });
  } else {
    await db
      .update(siteSettings)
      .set({ value: next as unknown as Record<string, unknown> })
      .where(eq(siteSettings.key, "hospital"));
  }
}
