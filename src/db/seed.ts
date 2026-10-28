/**
 * Jeu de données initial de l'Hôpital La Croix de Zinvié.
 * Exécution : npx tsx src/db/seed.ts
 */
import "dotenv/config";
import { sql } from "drizzle-orm";
import bcrypt from "bcryptjs";

import { db, pool } from "@/db";
import {
  archives,
  consultationRequests,
  contactMessages,
  donationNeeds,
  donations,
  doctors,
  faqs,
  hospitalValues,
  news,
  pages,
  services,
  sessions,
  siteSettings,
  timelineEntries,
  users,
} from "@/db/schema";
import { DEFAULT_SETTINGS } from "@/lib/settings";

const HOURS_WEEK = "Lundi – Vendredi : 8h00 – 16h00";
const HOURS_24 = "En permanence — 24h/24 et 7j/7";
const HOURS_RD = "Sur rendez-vous (Lundi – Vendredi)";

function requiredSeedPassword(name: string): string {
  const password = process.env[name];
  if (!password || password.startsWith("CHANGE_ME_") || password.length < 16) {
    throw new Error(
      `${name} must be set to a password of at least 16 characters`,
    );
  }
  return password;
}

const SERVICES = [
  {
    slug: "medecine-generale",
    name: "Médecine générale",
    category: "principal",
    shortDescription:
"Consultations de médecine générale et de médecine interne : suivi durable, bien-être et soins de santé généraux.",
    description:
"Spécialité médicale prenant en charge le suivi durable, le bien-être et les soins de santé généraux. Le service assure le diagnostic, le traitement ambulatoire et le suivi des pathologies chroniques (hypertension, diabète, asthme), la prise en charge des infections courantes et l'orientation vers les autres spécialités de l'hôpital. Consultations sur place, CMPN (consultation médicale de pré-natalité) et suivi post-natal.",
    hours: HOURS_WEEK,
    location: "Bâtiment principal — Rez-de-chaussée",
    headName: "Dr Franck Ayodéhou Gandji (Directeur Sanitaire)",
    icon: "stethoscope",
    appointment: false,
    order: 1,
  },
  {
    slug: "ophtalmologie",
    name: "Ophtalmologie",
    category: "principal",
    shortDescription:
"Spécialité médicale chargée du suivi et du traitement des maladies de l'œil et de ses annexes.",
    description:
"Consultation ophtalmologique, examen de la vue, mesure de la pression intraoculaire, fond d'œil, diagnostic et traitement des affections oculaires (conjonctivite, cataracte, glaucome, kératite), prescription de lunettes et injections intra-oculaires. Mission de dépistage du daltonisme et de la rétinopathie diabétique dans le cadre du suivi des patients.",
    hours: "Mardi & Jeudi : 8h00 – 16h00",
    location: "Bâtiment principal — 1er étage",
    headName: "Service d'ophtalmologie",
    icon: "eye",
    appointment: true,
    order: 2,
  },
  {
    slug: "gynecologie-obstetrique",
    name: "Gynécologie-obstétrique",
    category: "principal",
    shortDescription:
"Maternité et gynécologie : suivi de grossesse, accouchements et prise en charge gynécologique.",
    description:
"Le service de maternité et de gynécologie assure le suivi de la grossesse (CPN), l'accueil des accouchements, les soins du nouveau-né, la pueperium, le dépistage du cancer du sein et du col de l'utérus, la planification familiale et le traitement des pathologies gynécologiques. Une crèche accueille les nouveau-nés dont les parents ne peuvent pas assurer la garde.",
    hours: HOURS_RD,
    location: "Pavillon Maternité",
    headName: "Service de maternité / gynécologie",
    icon: "baby",
    appointment: true,
    order: 3,
  },
  {
    slug: "chirurgie",
    name: "Chirurgie",
    category: "principal",
    shortDescription:
"Service qui s'occupe des affections dont le traitement nécessite une intervention chirurgicale.",
    description:
"Chirurgie générale, viscérale, abdominale, gynécologique et urologique, en urgence comme en programme. Le bloc opératoire dispose de salles actives en continu. L'hôpital accueille régulièrement des missions italiennes de chirurgie de la paroi abdominale, de chirurgie maxillo-faciale et de chirurgie plastique et reconstructrice, qui permettent des interventions à coût réduit (hernies, éventrations, kystes, goitre, fibromes de l'utérus, fentes labio-palatines).",
    hours: HOURS_RD,
    location: "Bloc opératoire",
    headName: "Service de chirurgie",
    icon: "activity",
    appointment: true,
    order: 4,
  },
  {
    slug: "oncologie",
    name: "Oncologie",
    category: "principal",
    shortDescription:
"Dépistage, chimiothérapie et soins de support des cancers, avec un service créé avec l'appui de l'AMCES.",
    description:
"Le service d'oncologie de l'hôpital « La Croix » de Zinvié a été créé dans le cadre du programme de renforcement des capacités des partenaires (AMCES), en lien avec l'unité de radiologie. Il assure le dépistage et le diagnostic des cancers, la chimiothérapie, les soins de support (douleur, nutrition, accompagnement psychologique) et le suivi des patients en rémission. Les campagnes de dépistage du cancer du sein et du col de l'utérus y sont organisées.",
    hours: "Lundi – Mercredi – Vendredi : 8h00 – 15h00",
    location: "Pavillon Oncologie",
    headName: "Service d'oncologie",
    icon: "shield",
    appointment: true,
    order: 5,
  },
  {
    slug: "tuberculose",
    name: "Tuberculose",
    category: "principal",
    shortDescription:
"Dépistage, traitement supervisé et accompagnement des patients tuberculeux.",
    description:
"Le service prend en charge le dépistage de la tuberculose (radiologie, laboratoire, test de Mantoux), le traitement-standard supervisé, le suivi des patients multi-résistants en lien avec le programme national, l'éducation thérapeutique et l'accompagnement social (nutrition, aide aux familles). Consultation dédiée et accueil des contacts dans le cadre du programme de lutte contre la tuberculose.",
    hours: "Lundi – Vendredi : 8h00 – 14h00",
    location: "Bâtiment principal — aile consultations",
    headName: "Service des maladies infectieuses",
    icon: "lungs",
    appointment: false,
    order: 6,
  },
  {
    slug: "ulcere-de-buruli",
    name: "Ulcère de Buruli",
    category: "principal",
    shortDescription:
"Soins des plaies, pansements et détection précoce de l'ulcère de Buruli.",
    description:
"L'ulcère de Buruli est une maladie tropicale qui touche particulièrement les zones humides du Plateau. Le service assure la détection précoce des lésions, les soins de plaie quotidiens, les pansements, la prise en charge des formes sévères et l'appui aux campagnes de santé publique de notification des cas dans les villages de l'arrondissement de Zinvié.",
    hours: HOURS_WEEK,
    location: "Service de soins infirmiers",
    headName: "Service des soins infirmiers",
    icon: "droplet",
    appointment: false,
    order: 7,
  },
  {
    slug: "urgences",
    name: "Urgences",
    category: "departement",
    shortDescription:
"Urgences adultes et pédiatriques, accueil et triage en permanence.",
    description:
"Le service d'urgence accueille les adultes et les enfants 24h/24 et 7j/7. Il réalise le triage, la réanimation, la petite chirurgie d'urgence, les soins de traumatologie et l'orientation vers le bloc opératoire ou vers un hôpital du CHU de Cotonou pour les situations les plus graves.",
    hours: HOURS_24,
    location: "Entrée principale",
    headName: "Équipe de garde",
    icon: "ambulance",
    appointment: false,
    order: 8,
  },
  {
    slug: "pediatrie",
    name: "Pédiatrie",
    category: "departement",
    shortDescription:
"Prise en charge des enfants de 0 à 15 ans : consultations, vaccinations, nutrition.",
    description:
"Consultations pédiatriques, suivi de croissance, vaccinations du calendrier national, prise en charge de la malnutrition (évaluation anthropométrique, advice nutritionnel, programme de récupération nutritionnelle),prise en charge des pathologies de l'enfant et hospitalisation pédiatrique.",
    hours: HOURS_WEEK,
    location: "Pavillon Pédiatrie",
    headName: "Service de pédiatrie",
    icon: "baby",
    appointment: false,
    order: 9,
  },
  {
    slug: "neonatologie",
    name: "Néonatologie",
    category: "departement",
    shortDescription:
"Soins intensifs du nouveau-né et prise en charge des prématurés.",
    description:
"Le service de néonatologie accueille les nouveau-nés, prématurés ou en détresse, avec une unité de soins intensifs, un « kangourou » (soin peau à peau), l'allaid maternel et le suivi post-natal des nourrissons.",
    hours: HOURS_24,
    location: "Pavillon Maternité",
    headName: "Service de néonatologie",
    icon: "heart",
    appointment: false,
    order: 10,
  },
  {
    slug: "kinesitherapie",
    name: "Kinésithérapie",
    category: "departement",
    shortDescription:
"Rééducation fonctionnelle : Shot, massages, récupération post-opératoire.",
    description:
"Séances de kinésithérapie, massage thérapeutique, physiothérapie respiratoire, rééducation post-opératoire (chirurgie orthopédique, abdominale, neurochirurgie) et prise en charge des douleurs chroniques. Le service accepte les rendez-vous de kinésithérapie en plus des urgences.",
    hours: "Lundi, Mercredi, Vendredi : 8h00 – 16h00",
    location: "Pavillon Kinésithérapie",
    headName: "Service de kinésithérapie",
    icon: "activity",
    appointment: true,
    order: 11,
  },
  {
    slug: "imagerie-medicale",
    name: "Imagerie médicale",
    category: "departement",
    shortDescription:
"Radiologie, échographie et imagerie de l'unité de radiologieeby de l'hôpital.",
    description:
"L'unité de radiologie de l'hôpital « La Croix » de Zinvié a été reinforce dans le cadre du programme de renforcement des capacités des partenaires. Elle assure la radiographie standard, l'échographie abdominale et obstétricale, la radiographie thoracique et le suivi des campaigns de dépistage. Un scanner est prévu dans le plan d'équipement de l'établissement.",
    hours: HOURS_WEEK,
    location: "Pavillon Imagerie",
    headName: "Service d'imagerie médicale",
    icon: "scan",
    appointment: false,
    order: 12,
  },
  {
    slug: "laboratoire",
    name: "Laboratoire & analyses",
    category: "departement",
    shortDescription:
"Analyses biologiques, banque du sang et sérologie.",
    description:
"Le laboratoire réalise les analyses hématologiques, biochimiques, parasitologiques et sérologiques (VIH, hépatites B et C, syphilis), les examens parasitologiques des selles et des urines, la glycémie et l'ECBU. Il abrite la banque du sang de l'hôpital, responsable des collectes et des campagnes de don de sang en lien avec l'Agence Nationale pour la Transfusion Sanguine (ANTS).",
    hours: HOURS_WEEK,
    location: "Bâtiment principal — Rez-de-chaussée",
    headName: "Père Bruno Serge HOUNKOUNNOU (Banque du sang)",
    icon: "microscope",
    appointment: false,
    order: 13,
  },
  {
    slug: "cardiologie",
    name: "Cardiologie",
    category: "departement",
    shortDescription:
"Spécialité médicale qui traite des troubles du cœur et de certaines parties du système circulatoire.",
    description:
"Consultation de cardiologie, ECG, échographie cardiaque, prise en charge de l'hypertension artérielle, de l'insuffisance cardiaque et des valvulopathies, suivi post-infarctus et éducation thérapeutique. Orientation vers les explorations spécialisées et la chirurgie cardiaque selon les cas.",
    hours: "Lundi – Jeudi : 8h00 – 14h00",
    location: "Bâtiment principal — 1er étage",
    headName: "Service de cardiologie",
    icon: "activity",
    appointment: true,
    order: 14,
  },
  {
    slug: "orl",
    name: "ORL",
    category: "departement",
    shortDescription:
"L'ORL est une spécialité médicale traitant les maladies de l'oreille, du nez et de la gorge.",
    description:
"Consultation ORL : otites, sinusites, rhinopharyngites récurrentes, troubles de l'audition, amygdalites, troubles de la déglutition et de la voix. Soins des plaies, petite chirurgie ORL et orientações vers la chirurgie maxillo-faciale lors des missions.",
    hours: "Mardi – Jeudi : 8h00 – 15h00",
    location: "Bâtiment principal — 1er étage",
    headName: "Service ORL",
    icon: "stethoscope",
    appointment: true,
    order: 15,
  },
  {
    slug: "urologie",
    name: "Urologie",
    category: "departement",
    shortDescription:
"Prise en charge des pathologies urinaires et génito-urinaires.",
    description:
"Consultation d'urologie, prise en charge des lithiases urinaires, des infections urinaires, des troubles prostatiques, du varicocèle et de l'hydrocèle), échographie et pose de sondes, petite chirurgie ambulatoire et suivi post-opératoire.",
    hours: "Mercredi : 8h00 – 15h00",
    location: "Pavillon Chirurgie",
    headName: "Service d'urologie",
    icon: "droplet",
    appointment: true,
    order: 16,
  },
  {
    slug: "reanimation",
    name: "Réanimation",
    category: "departement",
    shortDescription:
"Soins intensifs et surveillance continue des patients instables.",
    description:
"Unité de soins intensifs : ventilation assistée, monitorage, gestion des urgences cardiologiques, pemulihan post-opératoire et des états septiques. L'unité a été sécurisée et équipée dans le cadre du projet de développement de l'hôpital mené avec Medici in Africa, avec la formation du personnel anesthésiste.",
    hours: HOURS_24,
    location: "Bloc opératoire — Étage",
    headName: "Service de réanimation",
    icon: "activity",
    appointment: false,
    order: 17,
  },
  {
    slug: "traumatologie",
    name: "Traumatologie",
    category: "departement",
    shortDescription:
"Prise en charge des urgences traumatologiques : fractures, entorses, plaies.",
    description:
"Accueil des urgences traumatologiques (accidents de la route, chutes, blessures), réduction, immobilisation, pansements, suture, surveillance et casting et orientation vers la chirurgie orthopédique. Un ambulatoire d'orthopédie a été mis en place aux urgences.",
    hours: HOURS_24,
    location: "Urgences",
    headName: "Service de traumatologie",
    icon: "bone",
    appointment: false,
    order: 18,
  },
  {
    slug: "neurochirurgie",
    name: "Neurochirurgie",
    category: "departement",
    shortDescription:
"Chirurgie du système nerveux et traumatologie crânienne.",
    description:
"Prise en charge neurochirurgicale : traumatismes crâniens, hydrocéphalies, hernies discales, tumeurs du système nerveux. Évaluation neurochirurgicale, suivi post-opératoire et rééducation associée à la kinésithérapie.",
    hours: "Sur rendez-vous",
    location: "Pavillon Chirurgie",
    headName: "Service de neurochirurgie",
    icon: "brain",
    appointment: true,
    order: 19,
  },
  {
    slug: "anatomopathologie",
    name: "Anatomopathologie",
    category: "departement",
    shortDescription:
"Étude des tissus : biopsies, cytologie et comptes rendus anatomopathologiques.",
    description:
"Prélèvements et analyse des tissus, biopsies, cytologies, examen des pièces opératoires et validation des analyses d'oncologie en lien avec le service d'oncologie et les laboratoires de référence.",
    hours: "Lundi – Vendredi : 8h00 – 16h00",
    location: "Bâtiment principal — Sous-sol",
    headName: "Service d'anatomopathologie",
    icon: "microscope",
    appointment: false,
    order: 20,
  },
  {
    slug: "aumonerie",
    name: "Aumônerie",
    category: "departement",
    shortDescription:
"Accompagnement spirituel, écoute et prière des malades et de leurs familles.",
    description:
"Particularité de notre hôpital : la présence permanente d'une aumônerie assurée par les Religieux Camilliens. L'équipe accompagne les malades, les familles et le personnel, assure l'écoute, la prière, la préparation aux sacrements et le soutien des endeuillés. L'aumônerie est un service à part entière, reconnu par tous nos patients.",
    hours: "Tous les jours, y compris week-ends et jours fériés",
    location: "Chapelle de l'hôpital",
    headName: "Équipe de l'aumônerie",
    icon: "heart",
    appointment: false,
    order: 21,
  },
];

const DOCTORS = [
  {
    name: "Dr Franck Ayodéhou Gandji",
    kind: "medecin",
    specialty: "Médecine interne — Directeur Sanitaire",
    serviceSlug: "medecine-generale",
    role: "Directeur Sanitaire de l'hôpital",
    days: "Lundi, Mercredi, Vendredi",
    hours: "08h00 – 12h00",
    bio: "Directeur Sanitaire de l'Hôpital « La Croix » de Zinvié. Il coordonne le plateau technique et les activités de l'hôpital, et a supervisé l'organisation des missions de chirurgie à coût réduit et des campagnes de chirurgie maxillo-faciale et reconstructrice.",
    order: 1,
  },
  {
    name: "Sœur Monique Bourget, MD, CCFP, FCFP, PhD",
    kind: "medecin",
    specialty: "Médecine des soins palliatifs",
    serviceSlug: "medecine-generale",
    role: "Médecin des soins palliatifs",
    days: "Mardi, Jeudi",
    hours: "08h00 – 16h00",
    bio: "Médecin des soins palliatifs à l'Hôpital La Croix de Zinvié, Conseillère Santé Mondiale Bénin (Université d'Ottawa) et Coordinatrice nationale de la Pastorale de la Première Enfance (PPE) au Bénin. Accompagnement des patients et de leurs familles dans les fins de vie.",
    order: 2,
  },
  {
    name: "Père Bruno Serge HOUNKOUNNOU",
    kind: "medecin",
    specialty: "Santé publique — Banque du sang",
    serviceSlug: "laboratoire",
    role: "Responsable de la banque du sang et des campagnes de don de sang",
    days: "Samedi (campagnes) et sur rendez-vous",
    hours: "08h00 – 16h00",
    bio: "Responsable de la banque de sang et de l'organisation des campagnes de don de sang de l'hôpital, en collaboration avec l'Agence Nationale pour la Transfusion Sanguine (ANTS) et la Fondation Claudine Talon. Contact direct : +229 94 03 85 01 — hounk.bru@gmail.com",
    order: 3,
  },
  {
    name: "Équipe de chirurgie — consultation sur rendez-vous",
    kind: "equipe",
    specialty: "Chirurgie générale et viscérale",
    serviceSlug: "chirurgie",
    role: "Consultation de spécialité",
    days: "Lundi – Vendredi",
    hours: "08h00 – 16h00",
    bio: "Les rendez-vous en spécialité sont possibles en chirurgie, en complément des urgences. Diagnostic, programme opératoire et suivi post-opératoire sont assurés par l'équipe du bloc.",
    order: 4,
  },
  {
    name: "Équipe de kinésithérapie — consultation sur rendez-vous",
    kind: "equipe",
    specialty: "Kinésithérapie et rééducation fonctionnelle",
    serviceSlug: "kinesitherapie",
    role: "Consultation de spécialité",
    days: "Lundi, Mercredi, Vendredi",
    hours: "08h00 – 16h00",
    bio: "Prise en charge en kinésithérapie sur rendez-vous : rééducation post-opératoire, physiothérapie respiratoire, massages et soins de la douleur chronique.",
    order: 5,
  },
  {
    name: "Équipe d'ophtalmologie — consultation sur rendez-vous",
    kind: "equipe",
    specialty: "Ophtalmologie",
    serviceSlug: "ophtalmologie",
    role: "Consultation de spécialité",
    days: "Mardi, Jeudi",
    hours: "08h00 – 16h00",
    bio: "Examen de la vue, mesure de la pression intraoculaire, fond d'œil, diagnostic et traitement des affections oculaires, délivrance de lunettes.",
    order: 6,
  },
  {
    name: "Équipe de maternité et gynécologie",
    kind: "equipe",
    specialty: "Gynécologie-obstétrique",
    serviceSlug: "gynecologie-obstetrique",
    role: "Consultation de spécialité",
    days: "Lundi, Mercredi, Vendredi",
    hours: "08h00 – 16h00",
    bio: "Consultation prénatale, suivi de grossesse, accouchements, planning familial, dépistage du cancer du sein et du col de l'utérus.",
    order: 7,
  },
  {
    name: "Équipe d'oncologie",
    kind: "equipe",
    specialty: "Oncologie",
    serviceSlug: "oncologie",
    role: "Consultation de spécialité",
    days: "Lundi, Mercredi, Vendredi",
    hours: "08h00 – 15h00",
    bio: "Dépistage, chimiothérapie et soins de support. Un service créé dans le cadre du programme de renforcement des capacités des partenaires (AMCES), en lien avec l'unité de radiologie.",
    order: 8,
  },
  {
    name: "Équipe de cardiologie",
    kind: "equipe",
    specialty: "Cardiologie",
    serviceSlug: "cardiologie",
    role: "Consultation de spécialité",
    days: "Lundi – Jeudi",
    hours: "08h00 – 14h00",
    bio: "ECG, échographie cardiaque, prise en charge de l'hypertension, de l'insuffisance cardiaque et des valvulopathies.",
    order: 9,
  },
  {
    name: "Équipe ORL",
    kind: "equipe",
    specialty: "Oto-rhino-laryngologie",
    serviceSlug: "orl",
    role: "Consultation de spécialité",
    days: "Mardi, Jeudi",
    hours: "08h00 – 15h00",
    bio: "Pathologies de l'oreille, du nez et de la gorge, troubles de l'audition, soins de petite chirurgie ORL.",
    order: 10,
  },
];

const TIMELINE = [
  {
    year: "1972",
    title: "Arrivée des Religieux Camilliens",
    description:
"Les Religieux Camilliens (Serviteurs des Malades) s'installent dans l'arrondissement de Zinvié et identifier le besoin de santé de la population locale, jusqu'alors peu ou pas desservie.",
    order: 1,
  },
  {
    year: "1974",
    title: "Création de la structure sanitaire",
    description:
"Ouverture d'un dispensaire à Yêvié, sur la route de Zinvié, afin d'offrir des soins à la population de Zinvié et de ses environs. C'est l'année de référence de la création de notre structure sanitaire.",
    order: 2,
  },
  {
    year: "1980",
    title: "Transformation en hôpital — « La Croix » de Zinvié",
    description:
"Le dispensaire est transformé en hôpital et baptisé « LA CROIX » de Zinvié. L'établissement devient une structure confessionnelle répondant aux normes et offrant des soins de qualité à un coût très abordable.",
    order: 3,
  },
  {
    year: "Années 1990-2000",
    title: "Extension du plateau technique",
    description:
"Développement du bloc opératoire, du laboratoire, de la radiologie, de la maternité et du service de pédiatrie. Mise en place de l'hospitalisation et d'un service d'urgence permanent.",
    order: 4,
  },
  {
    year: "2010-2020",
    title: "Partenariats et coopération",
    description:
"Renforcement des capacités avec les partenaires (AMCES, Medici in Africa), missions de chirurgie italiennes à coût réduit, mise en service de l'unité de radiologie et du service d'oncologie, banque du sang et campagnes de don de sang avec l'ANTS.",
    order: 5,
  },
  {
    year: "Aujourd'hui",
    title: "Un hôpital de proximité reconnu",
    description:
"L'hôpital « La Croix » de Zinvié accueille chaque jour les populations de Zinvié, d'Abomey-Calavi et des communes voisines, avec une équipe de plus de 50 médecins, une capacité de 100 lits, une aumônerie et une disponibilité 24h/24 pour les urgences.",
    order: 6,
  },
];

const VALUES = [
  {
    title: "Soin centré sur l'humain",
    description:
"Nous nous efforçons de traiter chaque malade avec la même vertu que nous voudrions être traités nous-mêmes, dans toutes ses dimensions : morale, spirituelle et physique.",
    icon: "heart",
    order: 1,
  },
  {
    title: "Solidarité",
    description:
"Depuis 1974, l'hôpital est né de la solidarité : une structure qui reste accessible aux plus démunis et qui ne laisse personne de côté, comme le rappellent nos campagnes de chirurgie à coût réduit.",
    icon: "users",
    order: 2,
  },
];

const NEWS = [
  {
    slug: "mission-chirurgicale-italienne-maxillo-faciale",
    title:
"Mission italienne de chirurgie maxillo-faciale, plastique et reconstructrice",
    excerpt:
"L'hôpital « La Croix » de Zinvié a accueilli une mission italienne de chirurgie maxillo-faciale et de chirurgie plastique et reconstructrice, pour prendre en charge fentes labio-palatines, rétractions de cicatrices, tumeurs de la face et du cou, malformations congénitales et séquelles de brûlures.",
    content:
"L'hôpital « La Croix » de Zinvié a organisé une mission italienne de chirurgie maxillo-faciale, de chirurgie plastique et reconstructrice.\n\nCette mission, annoncée par communiqué du Directeur de l'hôpital, s'est déroulée du 22 février au 10 mars. Elle concernait les patients souffrants de fente labio-palatine (becs de lièvre, fente palatine), de rétractions de cicatrices, de tumeurs de la face et du cou, de malformations congénitales, de séquelles de brûlures, ainsi que les pathologies dermatologiques.\n\nLes consultations préalables se font tous les jours ouvrés à l'hôpital. Pour toute information, le numéro de téléphone de l'établissement reste joignable pendant les campagnes.",
    category: "Chirurgie",
    publishedAt: new Date("2024-11-25T09:00:00Z"),
    order: 1,
  },
  {
    slug: "campagne-chirurgie-generale-cout-reduit",
    title: "Campagne de chirurgie générale à coût réduit",
    excerpt:
"Une mission italienne de chirurgie générale a permis d'opérer les personnes souffrantes d'utérus polymyomateux, de kystes, d'éventrations, de goitre, de lipomes et de hernies (ombilicale, de la ligne blanche, inguino-scrotale), ainsi que des lithiases vésiculaires et des tumeurs digestives.",
    content:
"Le centre à vocation humanitaire « La Croix » de Zinvié a organisé une campagne de chirurgie générale assurée par une mission italienne.\n\nLes patients concernés souffraient d'utérus polymyomateux (fibromes de l'utérus), de kystes, d'éventrations, de goitre, de lipome, de hernie ombilicale, de hernie de la ligne blanche, de hernie inguino-scrotale, de lithiase vésiculaire, de tumeur du côlon, de fissures et fistules anales, de prolapsus rectal, et de bien d'autres maladies.\n\nCette opération est l'occasion, pour les patients, d'un diagnostic établi sur la base d'examens médicaux et de la détermination de l'opération la mieux adaptée à leur pathologie.",
    category: "Chirurgie",
    publishedAt: new Date("2023-05-11T08:00:00Z"),
    order: 2,
  },
  {
    slug: "campagne-don-de-sang-ants",
    title:
"Campagne de don de sang à Zinvié avec l'ANTS et la Fondation Claudine Talon",
    excerpt:
"En collaboration avec l'Agence Nationale pour la Transfusion Sanguine et la Fondation Claudine Talon, l'hôpital a organisé une campagne de don de sang mobilisant la population de Zinvié autour du mot d'ordre « Sang donné = vies sauvées ».",
    content:
"L'hôpital « La Croix » de Zinvié a organisé, en collaboration avec l'Agence Nationale pour la Transfusion Sanguine (ANTS) et la Fondation Claudine Talon, une campagne de don de sang.\n\nLa collecte a eu lieu dans l'enceinte de l'hôpital. Le responsable de la banque de sang et des campagnes de don de sang de l'établissement a mobilisé les citoyens autour du mot d'ordre « Sang donné = vies sauvées ».\n\nLa banque du sang de l'hôpital assure la disponibilité des produits sanguins pour les urgences, les interventions chirurgicales et les accouchements, y compris en période de campagne.",
    category: "Santé publique",
    publishedAt: new Date("2023-04-17T10:00:00Z"),
    order: 3,
  },
  {
    slug: "service-oncologie-radio-amces",
    title: "Service d'oncologie et unité de radiologie : le renforcement des capacités",
    excerpt:
"Dans le cadre de son programme de renforcement des capacités dans les hôpitaux partenaires, l'AMCES a contribué à l'équipement d'une unité de radiologie et à la création d'un service d'oncologie à l'hôpital « La Croix » de Zinvié.",
    content:
"L'AMCES (Association des Medicals et Chirurgiens Espagnols au Bénin) mène un programme de renforcement de capacités au sein des hôpitaux, qui a notamment permis la construction d'un bloc de laboratoire et la mise en place d'une unité de radiologie à l'hôpital « La Croix » de Zinvié.\n\nLe service d'oncologie de l'établissement, créé dans ce cadre, permet aujourd'hui le dépistage, la chimiothérapie et le suivi des patients. L'AMCES soutient également le développement de l'ozonothérapie dans plusieurs structures de santé du Bénin.",
    category: "Partenariats",
    publishedAt: new Date("2024-08-09T09:30:00Z"),
    order: 4,
  },
  {
    slug: "soutien-maternite-nouveaux-nes",
    title:
"Maternité : accompagnement des familles et accueil des nouveau-nés à la crèche",
    excerpt:
"Face à la fragilité de certaines mères et aux difficultés de prise en charge post-natale, l'hôpital renforce l'accompagnement : accueil des nouveau-nés à la crèche, suivi de la mère et orientation sociale vers les appuis disponibles.",
    content:
"La maternity de l'hôpital « La Croix » de Zinvié accueille chaque année de nombreuses accouchements, dont des grossesses multiples qui mettent les familles en difficulté.\n\nPour accompagner au mieux ces situations, l'hôpital dispose d'une crèche qui accueille les nouveau-nés dont les parents ne peuvent pas assurer la garde, et assure un suivi rapproché des nourrissons (poids, alimentation, vaccinations). Les mères bénéficient d'un accompagnement nursing et d'un repérage précoce des difficultés sociales, en lien avec les services d'aide sociale et les paroisses.",
    category: "Maternité",
    publishedAt: new Date("2026-01-14T09:00:00Z"),
    order: 5,
  },
  {
    slug: "lutte-malnutrition-enfants",
    title: "Enfants et malnutrition : le travail de l'équipe soignante au quotidien",
    excerpt:
"Dépistage de la malnutrition, advice nutritionnel, programme de récupération nutritionnelle et suivi de la croissance : la malnutrition des enfants reste un combat quotidien pour l'équipe de l'hôpital.",
    content:
"La malnutrition infantile touche de nombreux enfants de la zone de Zinvié. L'équipe de l'hôpital « La Croix » de Zinvié s'y oppose au quotidien.\n\nLe service de pédiatrie assure le dépistage à travers l'évaluation anthropométrique, ladvice nutritionnel aux parents et le programme de récupération nutritionnelle. Les consultations de suivi permettent de mesurer les progrès : périmètre brachial, poids, taille et courbe de croissance.\n\nCe travail de long terme repose sur la collaboration entre soignants, familles et relais communautaires des villages de l'arrondissement.",
    category: "Pédiatrie",
    publishedAt: new Date("2025-06-12T08:30:00Z"),
    order: 6,
  },
  {
    slug: "devenir-donateur-sang",
    title: "Vous pouvez donner votre sang : la campagne ordinaire repart",
    excerpt:
"Le centre de santé à vocation humanitaire ex hôpital « La Croix » de Zinvié relance sa campagne ordinaire de don de sang avec une caravane pour mobiliser les citoyens de la commune.",
    content:
"« Sang donné = vies sauvées » : c'est autour de ce mot d'ordre que l'hôpital « La Croix » de Zinvié veut relancer sa campagne ordinaire de don de sang.\n\nUne caravane est organisée pour mobiliser les citoyens de Zinvié et des communes environnantes. La collecte se fait au sein de l'hôpital, en lien avec l'Agence Nationale pour la Transfusion Sanguine.\n\nVous pouvez donner votre sang en venant directement au service de la banque du sang (bâtiment principal, rez-de-chaussée) ou en participant à la prochaine caravane. Toutes les informations sont disponibles au téléphone de l'hôpital.",
    category: "Santé publique",
    publishedAt: new Date("2023-04-10T09:00:00Z"),
    order: 7,
  },
];

const FAQS = [
  {
    question: "Quels sont les horaires d'ouverture de l'hôpital ?",
    answer:
"Les consultations ont lieu du lundi au vendredi de 8h00 à 16h00. Le service des urgences est assuré en permanence, 24h/24 et 7j/7, par l'équipe de garde. Les campagnes de don de sang ont lieu le samedi.",
    category: "Organisation",
    order: 1,
  },
  {
    question: "Comment prendre rendez-vous pour une consultation ?",
    answer:
"Vous pouvez envoyer une demande de consultation depuis la page « Demander une consultation » : il suffit de remplir votre nom, votre numéro de téléphone, le service souhaité, une date preferred et le motif de votre demande. L'hôpital vous rappellera pour fixer le rendez-vous. Les rendez-vous directs sont également possibles en chirurgie et en kinésithérapie.",
    category: "Consultation",
    order: 2,
  },
  {
    question: "Comment venir à l'hôpital « La Croix » de Zinvié ?",
    answer:
"L'hôpital est situé à Yêvié, sur la Route de Zinvié, dans la commune d'Abomey-Calavi, département de l'Atlantique, à environ 40 km de Cotonou. Depuis Cotonou,/prenez la route de Abomey-Calavi puis directions Yêvié et Zinvié. Un plan d'accès est disponible sur la page Contact.",
    category: "Accès",
    order: 3,
  },
  {
    question: "Quels sont les tarifs des consultations ?",
    answer:
"Les tarifs de l'hôpital sont volontairement accessibles : les soins sont proposés à un coût très abordable, conformément à la vocation conf esse de l'établissement. Les tarifs exacts des consultations et des actes sont affichés au secrétariat d'accueil et peuvent être communiqués par téléphone. Les campagnes de chirurgie à coût réduit permettent, quant à elles, des interventions à prix réduit.",
    category: "Tarifs",
    order: 4,
  },
  {
    question: "Quels moyens de paiement sont acceptés pour un don ?",
    answer:
"Les dons en ligne sont collectés via FedaPay, qui permet de payer par MTN Mobile Money, Moov Money ou carte bancaire (Visa / Mastercard). Le montant est libre de votre choix et un reçu est délivré par l'hôpital pour chaque don confirmé.",
    category: "Dons",
    order: 5,
  },
  {
    question: "L'hôpital dispose-t-il d'un service d'aumônerie ?",
    answer:
"Oui. La présence de l'aumônerie est une particularité de notre hôpital : elle s'occupe de l'accompagnement et de l'écoute des malades et de leurs familles, dans le respect de chacun. L'équipe est présente tous les jours, y compris les week-ends et les jours fériés.",
    category: "Soin",
    order: 6,
  },
  {
    question: "Comment puis-je aider l'hôpital autrement qu'avec un don ?",
    answer:
"Vous pouvez par exemple : participer aux campagnes de don de sang, signaler un patient qui a besoin d'une intervention chirurgicale à coût réduit, venir en tant que volontaire pour la crèche de la maternité, ou faire un don de matériel médical. Contactez-nous pour en savoir plus.",
    category: "Dons",
    order: 7,
  },
  {
    question: "Les données de mon formulaire de consultation sont-elles confidentielles ?",
    answer:
"Les informations transmises via le formulaire de consultation sont utilisées uniquement par l'hôpital pour vous recontacter et organiser la prise en charge. Merci de ne pas y inscrire d'informations médicales sensibles : nos équipes prendront connaissance de votre situation lors de la consultation.",
    category: "Données",
    order: 8,
  },
];

const DONATION_NEEDS = [
  {
    title: "Équipement du bloc opératoire",
    description:
"Compléter le plateau technique : respirateurs, monitoring, matériel d'anesthésie et de réanimation — un impératif pour sécuriser les interventions.",
    icon: "activity",
    targetAmount: 25_000_000,
    order: 1,
  },
  {
    title: "Scanner et imagerie",
    description:
"Installer un scanner à l'hôpital pour éviter les déplacements coûteux vers Cotonou et raccourcir le diagnostic des urgences.",
    icon: "scan",
    targetAmount: 60_000_000,
    order: 2,
  },
  {
    title: "Crèche et matemité",
    description:
"Soutenir la crèche du service de maternité, les laitages, les produits d'hygiène et le matériel de soins des nouveau-nés.",
    icon: "baby",
    targetAmount: 8_000_000,
    order: 3,
  },
  {
    title: "Banque du sang et campagnes",
    description:
"Financer l'équipement de la banque du sang, la conservation des produits sanguins et les campagnes de don de sang en zone rurale.",
    icon: "droplet",
    targetAmount: 12_000_000,
    order: 4,
  },
  {
    title: "Programmes de santé communautaire",
    description:
"Dépistage de l'ulcère de Buruli, de la tuberculose et de la malnutrition : matériel, carburant et indemnités pour les équipes mobiles.",
    icon: "users",
    targetAmount: 10_000_000,
    order: 5,
  },
];

async function main() {
  const contentOnly = process.argv.includes("--content-only");
  const accounts = contentOnly ? [] : [
    {
      username: process.env.SEED_ADMIN_USER ?? "direction",
      fullName: "Marius Yabi",
      email: "hlacroixdezinvie@yahoo.com",
      role: "admin" as const,
      password: requiredSeedPassword("SEED_ADMIN_PASSWORD"),
    },
    {
      username: process.env.SEED_CONTENT_USER ?? "contenus",
      fullName: "Service Communication",
      email: "communication@hlacroixzinvie.bj",
      role: "content" as const,
      password: requiredSeedPassword("SEED_CONTENT_PASSWORD"),
    },
    {
      username: process.env.SEED_REQUESTS_USER ?? "demandes",
      fullName: "Service Accueil & Dons",
      email: "accueil@hlacroixzinvie.bj",
      role: "requests" as const,
      password: requiredSeedPassword("SEED_REQUESTS_PASSWORD"),
    },
    {
      username: process.env.SEED_DEVELOPER_USER ?? "developpeur",
      fullName: "Ismail AGOHOUNDJE",
      email: "ismailagohoundje14@gmail.com",
      role: "developer" as const,
      password: requiredSeedPassword("SEED_DEVELOPER_PASSWORD"),
    },
  ];

  if (
    !contentOnly &&
    new Set(accounts.map((account) => account.password)).size !== accounts.length
  ) {
    throw new Error("Each seed account must have a different password");
  }

  console.log("→ Initialisation de la base de données…");
  if (contentOnly) {
    const existingContent = await db.execute<{ has_data: boolean }>(sql`
      SELECT (
        EXISTS (SELECT 1 FROM archives) OR
        EXISTS (SELECT 1 FROM contact_messages) OR
        EXISTS (SELECT 1 FROM donations) OR
        EXISTS (SELECT 1 FROM consultation_requests) OR
        EXISTS (SELECT 1 FROM donation_needs) OR
        EXISTS (SELECT 1 FROM faqs) OR
        EXISTS (SELECT 1 FROM news) OR
        EXISTS (SELECT 1 FROM doctors) OR
        EXISTS (SELECT 1 FROM services) OR
        EXISTS (SELECT 1 FROM timeline_entries) OR
        EXISTS (SELECT 1 FROM hospital_values) OR
        EXISTS (SELECT 1 FROM pages) OR
        EXISTS (SELECT 1 FROM site_settings)
      ) AS has_data
    `);
    if (existingContent.rows[0]?.has_data) {
      throw new Error(
        "Content seed refused: application content already exists. Use an empty content database.",
      );
    }

    const requiredAccounts = [
      { username: "direction", role: "admin" },
      { username: "contenus", role: "content" },
      { username: "demandes", role: "requests" },
      { username: "developpeur", role: "developer" },
    ];
    const existingAccounts = await db
      .select({ username: users.username, role: users.role, active: users.active })
      .from(users);
    const accountsReady = requiredAccounts.every((required) =>
      existingAccounts.some(
        (account) =>
          account.username === required.username &&
          account.role === required.role &&
          account.active,
      ),
    );
    if (!accountsReady) {
      throw new Error(
        "Content seed refused: the four active admin accounts with expected roles must exist first.",
      );
    }
  } else {
    const existingData = await db.execute<{ has_data: boolean }>(sql`
      SELECT (
        EXISTS (SELECT 1 FROM archives) OR
        EXISTS (SELECT 1 FROM contact_messages) OR
        EXISTS (SELECT 1 FROM donations) OR
        EXISTS (SELECT 1 FROM consultation_requests) OR
        EXISTS (SELECT 1 FROM donation_needs) OR
        EXISTS (SELECT 1 FROM faqs) OR
        EXISTS (SELECT 1 FROM news) OR
        EXISTS (SELECT 1 FROM doctors) OR
        EXISTS (SELECT 1 FROM services) OR
        EXISTS (SELECT 1 FROM timeline_entries) OR
        EXISTS (SELECT 1 FROM hospital_values) OR
        EXISTS (SELECT 1 FROM pages) OR
        EXISTS (SELECT 1 FROM site_settings) OR
        EXISTS (SELECT 1 FROM sessions) OR
        EXISTS (SELECT 1 FROM users)
      ) AS has_data
    `);
    if (existingData.rows[0]?.has_data) {
      throw new Error(
        "Seed refused: the database already contains application data. Use a new empty database.",
      );
    }
  }

  /* ---------------------------- Utilisateurs ---------------------------- */
  for (const account of accounts) {
    const hash = await bcrypt.hash(account.password, 12);
    await db.insert(users).values({
      username: account.username,
      fullName: account.fullName,
      email: account.email,
      passwordHash: hash,
      role: account.role,
    });
    console.log(`   ✓ compte ${account.role} : ${account.username}`);
  }

  /* ------------------------------ Services ------------------------------ */
  const serviceIds = new Map<string, number>();
  for (const service of SERVICES) {
    const [row] = await db
      .insert(services)
      .values({ ...service, published: true })
      .returning({ id: services.id });
    serviceIds.set(service.slug, row.id);
  }
  console.log(`   ✓ ${SERVICES.length} services`);

  /* ------------------------------ Médecins ------------------------------ */
  for (const doctor of DOCTORS) {
    await db.insert(doctors).values({
      name: doctor.name,
      kind: doctor.kind,
      specialty: doctor.specialty,
      serviceId: serviceIds.get(doctor.serviceSlug) ?? null,
      role: doctor.role,
      days: doctor.days,
      hours: doctor.hours,
      bio: doctor.bio,
      order: doctor.order,
      published: true,
    });
  }
  console.log(`   ✓ ${DOCTORS.length} praticiens`);

  /* -------------------------- Frise chronologique ------------------------ */
  for (const entry of TIMELINE) {
    await db.insert(timelineEntries).values(entry);
  }

  /* ------------------------------- Valeurs ------------------------------ */
  for (const value of VALUES) {
    await db.insert(hospitalValues).values(value);
  }

  /* ------------------------------ Actualités ---------------------------- */
  for (const item of NEWS) {
    await db.insert(news).values({
      slug: item.slug,
      title: item.title,
      excerpt: item.excerpt,
      content: item.content,
      category: item.category,
      author: "Hôpital La Croix de Zinvié",
      published: true,
      publishedAt: item.publishedAt,
    });
  }
  console.log(`   ✓ ${NEWS.length} actualités`);

  /* --------------------------------- FAQ -------------------------------- */
  for (const faq of FAQS) {
    await db.insert(faqs).values(faq);
  }
  console.log(`   ✓ ${FAQS.length} questions fréquentes`);

  /* ------------------------------- Besoins ------------------------------ */
  for (const need of DONATION_NEEDS) {
    await db.insert(donationNeeds).values({ ...need, published: true });
  }

  /* -------------------------------- Pages ------------------------------- */
  await db.insert(pages).values({
    slug: "accueil",
    title: "Hôpital La Croix de Zinvié",
    subtitle:
"Soins de qualité à coût abordable, dans l'esprit du service et de la solidarité.",
    body:
"Nous sommes une structure sanitaire créée en 1974 par les Religieux Camilliens, dans le but d'offrir des soins à la population de Zinvié et ses environs. Nous qui, au début, étions un dispensaire, à partir de 1980 fûmes transformés en hôpital et baptisés « LA CROIX » de Zinvié.\n\nStructure confessionnelle appartenant aux Religieux Camilliens, nous répondons aux normes et offrons des soins de qualité à un coût très abordable, dans toutes les dimensions : morale, spirituelle et physique.\n\nUne particularité chez nous : la présence d'une aumônerie, qui s'occupe de l'accompagnement et de l'écoute des malades. Par ailleurs, la collaboration occupe une place très importante dans notre système.",
    data: {
      heroKicker: "Structure sanitaire confessionnelle — Atlantique, Bénin",
      heroTitle: "Des soins accessibles, un accompagnement humain",
      heroText:
"Créé en 1974 par les Religieux Camilliens, l'hôpital « La Croix » de Zinvié offre des soins de qualité à coût très abordable à la population de Zinvié et de ses environs. Urgences 24h/24, missions de chirurgie, aumônerie et équipe de permanence.",
      primaryCta: "Demander une consultation",
      secondaryCta: "Faire un don",
      stats: [
        { value: "1974", label: "Année de création" },
        { value: "100", label: "Lits d'hospitalisation" },
        { value: "50+", label: "Médecins et praticiens" },
        { value: "24/24", label: "Urgences" },
      ],
      pillars: [
        {
          title: "Un hôpital de proximité",
          text: "À 40 km de Cotonou, sur la route de Yêvié, nous prenons soin de la population de Zinvié, d'Abomey-Calavi et des communes rurales environnantes.",
          icon: "hospital",
        },
        {
          title: "Une équipe de garde",
          text: "Prise en charge des urgences adultes et pédiatriques en continu, avec hospitalisation, réanimation et bloc opératoire.",
          icon: "ambulance",
        },
        {
          title: "L'humain au centre",
          text: "Une aumônerie présente en permanence, qui accompagne et écoute les malades et leurs familles, dans le respect de chacun.",
          icon: "heart",
        },
      ],
    },
  });

  await db.insert(pages).values({
    slug: "a-propos",
    title: "À propos de l'hôpital « La Croix » de Zinvié",
    subtitle:
"Une histoire de service commencée en 1974, portée par les Religieux Camilliens.",
    body:
"Offrir des soins à la population de Zinvié et ses environs : telle est la raison d'être de l'hôpital « La Croix ». Depuis plus de cinquante ans, les Religieux Camilliens y exercent au service des malades, selon la tradition de saint Camille de Lellis, fondateur de l'Ordre des Serviteurs des Malades.",
    data: {
      missionTitle: "Notre mission",
      missionText:
        "Assurer à la population de Zinvié et des communes environnantes des soins de santé efficaces et accessibles — en priorité la médecine générale, la maternité et l'enfant, les urgences et la lutte contre les maladies transmissibles — tout en assurant un accompagnement spirituel, par la présence permanente de notre aumônerie. L'hôpital mobilise 250 personnes, dont 12 médecins permanents, 6 médecins itinérants, 130 membres du personnel médical, 13 sages-femmes et accoucheuses et 47 agents administratifs, pour un bassin de population d'environ un million d'habitants.",
      visionTitle: "Notre vision",
      visionText:
"Offrir des soins accessibles, de qualité et compatissants à tous, dans l'esprit du service et de la solidarité.",
      storyIntro:
"L'hôpital « La Croix » de Zinvié est une structure sanitaire confessionnelle créée en 1974 par les Religieux Camilliens. Nous avons commencé comme un simple dispensaire, au service des habitants de Zinvié ; à partir de 1980, nous avons été transformés en hôpital et avons été baptisés « LA CROIX » de Zinvié.\n\nSitué à 40 km de Cotonou, dans le département de l'Atlantique, plus précisément dans la commune d'Abomey-Calavi et l'arrondissement de Zinvié, l'hôpital s'est agrandi au fil des décennies : bloc opératoire, laboratoire, radiologie, maternité, oncologie, urgences, réanimation.\n\nNotre signature reste la même : offrir des soins de qualité à un coût très abordable, dans toutes ses dimensions — morale, spirituelle et physique — et faire de la collaboration notre force.",
      directions: [
        {
          name: "Père Marius Yabi",
          role: "Directeur de l'hôpital",
          text: "Conduit la stratégie de l'établissement, les partenariats et les campagnes de chirurgie à coût réduit.",
        },
        {
          name: "Dr Franck Ayodéhou Gandji",
          role: "Directeur Sanitaire",
          text: "Coordonne le plateau technique, les services cliniques et l'organisation des missions de chirurgie à coût réduit.",
        },
        {
          name: "Père Bruno Serge HOUNKOUNNOU",
          role: "Responsable de la banque du sang & du laboratoire",
          text: "Anime les campagnes de don de sang et la banque transfusionnelle de l'hôpital. Contact direct : +229 94 03 85 01 — hounk.bru@gmail.com",
        },
      ],
      partnershipText:
"La collaboration occupe une place très importante dans notre système : Agence Nationale pour la Transfusion Sanguine (ANTS), Fondation Claudine Talon, AMCES, Medici in Africa, missions italiennes de chirurgie, paroisses et associations locales.",
    },
  });

  /* ------------------------------ Paramètres ---------------------------- */
  await db.insert(siteSettings).values({
    key: "hospital",
    value: DEFAULT_SETTINGS as unknown as Record<string, unknown>,
  });

  if (!contentOnly) {
  /* --------------------- Données de démonstration (back) ------------------ */
  const [medecineGenerale] = await db
    .select({ id: services.id })
    .from(services)
    .where(sql`services.slug = 'medecine-generale'`)
    .limit(1);

  const demoRequests = [
    {
      reference: "DEM-2026-0001",
      fullName: "Aïcha Koudjo",
      phone: "+229 97 12 45 78",
      serviceLabel: "Médecine générale",
      preferredDate: "2026-02-12",
      reason:
"Douleurs abdominales et fièvre depuis cinq jours, consultation générale souhaitée.",
      status: "pending" as const,
    },
    {
      reference: "DEM-2026-0002",
      fullName: "Jean-Baptiste Hounkpatin",
      phone: "+229 96 44 21 09",
      serviceLabel: "Chirurgie",
      preferredDate: "2026-02-18",
      reason:
"Hernie inguino-scrotale évolutive, je souhaite être opéré et informée du coût.",
      status: "pending" as const,
    },
    {
      reference: "DEM-2026-0003",
      fullName: "Fatoumata Bio Tchané",
      phone: "+229 95 88 12 04",
      serviceLabel: "Gynécologie-obstétrique",
      preferredDate: "2026-02-20",
      reason:
"Consultation prénatale du deuxième trimestre et échographie de contrôle.",
      status: "processed" as const,
      adminNote: "Rappelle effectuée le 03/02, RDV fixé le 20/02 à 09h00.",
    },
  ];

  for (const request of demoRequests) {
    await db.insert(consultationRequests).values({
      ...request,
      serviceId: medecineGenerale?.id ?? null,
      createdAt: new Date(Date.now() - Math.random() * 20 * 86_400_000),
    });
  }

  await db.insert(donations).values([
    {
      reference: "DON-2026-0001",
      donorName: "Association Espoir d'Abomey",
      donorEmail: "contact@espoir-abomey.bj",
      donorPhone: "+229 97 00 11 22",
      amount: 50_000,
      currency: "XOF",
      method: "fedapay",
      purpose: "Équipement du bloc opératoire",
      status: "success" as const,
      createdAt: new Date("2026-01-20T09:15:00Z"),
    },
    {
      reference: "DON-2026-0002",
      donorName: "Anonyme",
      donorEmail: "",
      donorPhone: "+229 96 55 40 10",
      amount: 10_000,
      currency: "XOF",
      method: "fedapay",
      purpose: "Banque du sang",
      status: "success" as const,
      createdAt: new Date("2026-01-28T16:42:00Z"),
    },
    {
      reference: "DON-2026-0003",
      donorName: "Marie-Claire Zinsou",
      donorEmail: "m.zinsou@example.bj",
      donorPhone: "+229 97 33 76 54",
      amount: 25_000,
      currency: "XOF",
      method: "fedapay",
      purpose: "Crèche et maternité",
      status: "pending" as const,
      createdAt: new Date("2026-02-02T11:05:00Z"),
    },
  ]);

  await db.insert(contactMessages).values([
    {
      fullName: "Zacharie Adanhoumé",
      email: "z.adanhoume@example.bj",
      phone: "+229 94 21 88 30",
      subject: "Rendez-vous en chirurgie",
      message:
"Bonjour, je souhaite savoir si je peux être opéré d'une hernie et à quel prix. Merci de me rappeler.",
      status: "new" as const,
      createdAt: new Date("2026-02-03T08:20:00Z"),
    },
    {
      fullName: "Hortense Sossa",
      email: "hortense.sossa@example.bj",
      phone: "+229 97 61 09 77",
      subject: "Don de matériel médical",
      message:
"Bonjour, je dispose de lits médicalisés et de pousse-seringues à donner. Comment les livrer ?",
      status: "read" as const,
      createdAt: new Date("2026-01-30T14:10:00Z"),
    },
  ]);
  }

  console.log(
    contentOnly
      ? "✓ Contenu du site initialisé ; les comptes existants ont été conservés."
      : "✓ Base initialisée avec succès.",
  );
  await pool.end();
}

main().catch(async (error) => {
  console.error("✗ Échec du seed :", error);
  await pool.end();
  process.exit(1);
});
