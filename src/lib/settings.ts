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
  addressLine1: "BP 40, Zinvié",
  addressLine2: "Yêvié, Route de Zinvié — Commune d'Abomey-Calavi",
  addressLine3: "Département de l'Atlantique — République du Bénin",
  phone: "+229 01 95 88 68 53",
  phoneSecondary: "+229 01 55 28 18 91",
  phoneEmergency: "+229 01 95 96 84 00",
  email: "hlacroixdezinvie@yahoo.com",
  emailSecondary: "hlacroixsecretariat@yahoo.com",
  emailEconomat: "hlacroixzinvie@yahoo.com",
  ifu: "6200900134806",
  ifuIssueDate: "10 février 2009",
  webTv: "Hlacroix TV",
  website: "http://hlacroix-zinvie.net/",
  websiteSecondary: "",
  facebook: "https://www.facebook.com/@hlacroixzinvie/",
  whatsapp: "https://wa.me/2290195886853",
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
      value: "+229 01 95 88 68 53",
      detail: "Du lundi au vendredi, 8h00 – 16h00",
    },
    {
      label: "Urgences (24h/24)",
      value: "+229 01 95 96 84 00",
      detail: "Adultes et enfants — 7j/7 et 24h/24",
    },
    {
      label: "Téléphone",
      value: "+229 01 55 28 18 91",
      detail: "Accueil de l'hôpital",
    },
  ] as ContactChannel[],

  /* -------------------------- Réseaux & sites web ------------------------ */
  socialLinks: [
    {
      platform: "facebook",
      label: "Hôpital La Croix Zinvié",
      url: "https://www.facebook.com/@hlacroixzinvie/",
    },
    {
      platform: "whatsapp",
      label: "WhatsApp",
      url: "https://wa.me/2290195886853",
    },
    {
      platform: "globe",
      label: "Site Web de l'hôpital",
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
      label: "Site Web de l'hôpital",
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
  emailEconomat: string;
  ifu: string;
  ifuIssueDate: string;
  webTv: string;
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
