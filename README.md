# Hôpital « La Croix » de Zinvié — Site web & back-office

Application web complète (espace public + espace administration) pour
l'**Hôpital « La Croix » de Zinvié** — Centre de Santé à Vocation Humanitaire,
Yêvié, Route de Zinvié, commune d'Abomey-Calavi (Atlantique, Bénin).

> Le document de référence du projet mentionnait « Express.js + React 18 ».
> Cette implémentation utilise **Next.js (App Router)**, qui fournit
> exactement les mêmes briques fonctionnelles : serveur HTTP + API REST en
> `route handlers` (équivalent Express), composants React pour l'interface,
> PostgreSQL + Drizzle ORM, sessions serveur et protection CSRF.

---

## 1. Démarrage rapide

```bash
npm install
npx drizzle-kit push          # création des tables
npx tsx src/db/seed.ts        # chargement des données réelles
npm run dev                   # http://localhost:3000
```

Variables d'environnement (`.env`) :

```env
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/app_db
FEDAPAY_ENV=sandbox                 # "live" en production
FEDAPAY_SECRET_KEY=sk_sandbox_xxx   # clé secrète FedaPay (serveur uniquement)
RESEND_API_KEY=re_xxx               # notifications e-mail à la direction (optionnel)
MAIL_FROM="Hôpital La Croix <contact@hlacroixzinvie.bj>"
MAIL_TO_ADMIN=direction@hlacroixzinvie.bj
```

Sans clé FedaPay, l'application fonctionne en **mode démonstration** : le don
est enregistré et l'hôpital peut confirmer le paiement manuellement depuis la
page de remerciement.

## 2. Comptes d'administration

| Rôle | Identifiant | Mot de passe | Périmètre |
|---|---|---|---|
| Administrateur principal | `direction` | `CroixZinvie2025!Direction` | Tout le back-office |
| Gestionnaire de contenus | `contenus` | `CroixZinvie2025!Contenus` | Accueil, À propos, services, médecins, actualités, FAQ |
| Gestionnaire demandes & dons | `demandes` | `CroixZinvie2025!Demandes` | Demandes de consultation, dons, messages |
| Développeur & maintenance | `developpeur` | `CroixZinvie2025!Developpeur` | Accès complet au back-office + maintenance technique |

**Développeur référent** : Ismail AGOHOUNDJE — `ismailagohoundje14@gmail.com` ·
`01 61 79 19 67` (Bénin). Ses coordonnées sont affichées dans le pied de
page et sur la page *Contact*, et restent modifiables depuis
*Admin → Paramètres → Développeur & maintenance technique*.

Les mots de passe peuvent être surchargés via `SEED_ADMIN_PASSWORD`,
`SEED_CONTENT_PASSWORD`, `SEED_REQUESTS_PASSWORD` avant l'exécution du seed.
**Aucune inscription publique n'est possible.**

## 3. Données réelles intégrées

Le jeu de données initial est constitué d'informations vérifiées de
l'établissement :

- **Identité** — Hôpital « La Croix » de Zinvié / CSVH, créé en **1974** par
  les **Religieux Camilliens** (Serviteurs des Malades), d'abord dispensaire
  puis transformé en hôpital en **1980** ; structure confessionnelle avec
  **aumônerie permanente** ; 40 km de Cotonou, département de l'Atlantique,
  commune d'Abomey-Calavi, arrondissement de Zinvié.
- **Coordonnées réelles** — Yêvié, Route de Zinvié (RN31,Atlantique) ·
  GPS `6.598807, 2.363823` · Plus code `H9W6+6P` :
  - Standard & accueil : **+229 97 21 48 39**
  - Mobile & WhatsApp : **+229 95 88 68 53**
  - Urgences / fax : **+229 64 90 73 73**
  - Direction (Père Marius Yabi) : **+229 64 71 44 74** — `pmariusyabi@yahoo.it`
  - Banque du sang & laboratoire (Père Bruno Hounkonnou) : **+229 94 03 85 01** —
    `hounk.bru@gmail.com`
  - E-mails : `hlacroixdezinvie@yahoo.com` (officiel),
    `hlacroxdezinvie@yahoo.com` (secrétariat)
  - Sites : `hopitallacroixzinvie.bj` (officiel), `hlacroix-zinvie.net`
  - Facebook : **facebook.com/@hlacroixzinvie** (2,8 K mentions J'aime,
    3,5 K abonnés)
- **Horaires** — consultations du lundi au vendredi 8h00 – 16h00, urgences
  24h/24 et 7j/7, campagnes de don de sang le samedi.
- **Direction** — Père Marius Yabi (Directeur de l'hôpital),
  Dr Franck Ayodéhou Gandji (Directeur Sanitaire),
  Père Bruno Serge HOUNKOUNNOU (Banque du sang et campagnes de don),
  Sœur Monique Bourget, MD CCFP FCFP PhD (médecin des soins palliatifs).
- **Effectif réel** (audit *Biologie Sans Frontières*, janv. 2020) — 250 personnes
  au total : 12 médecins permanents, 6+ médecins itinérants, 130 membres du
  personnel médical, 13 sages-femmes et accoucheuses, 47 agents administratifs ;
  bassin de population d'environ 1 million d'habitants.
- **Services** — les 7 services principaux (médecine générale,
  ophtalmologie, gynécologie-obstétrique, chirurgie, oncologie, tuberculose,
  ulcère de Buruli) + 14 départements et unités (urgences, pédiatrie,
  néonatologie, kinésithérapie, imagerie, laboratoire, cardiologie, ORL,
  urologie, réanimation, traumatologie, anatomopathologie, neurochirurgie,
  aumônerie).
- **Actualités** — missions italiennes de chirurgie maxillo-faciale et de
  chirurgie de la paroi abdominale, campagnes de chirurgie générale à coût
  réduit, campagnes de don de sang avec l'ANTS et la Fondation Claudine Talon,
  service d'oncologie et unité de radiologie créés avec l'AMCES, travail sur
  la malnutrition, accompagnement des familles à la maternité.
- **Partenaires** — ANTS, Fondation Claudine Talon, AMCES, Medici in Africa,
  missions italiennes de chirurgie, paroisses d'Abomey-Calavi.

## 4. Fonctionnalités

### 4.1 Espace public (9 pages)

| Page | Route | Contenu |
|---|---|---|
| Accueil | `/` | Présentation, chiffres clés, 7 services, 3 dernières actualités, CTA consultation / don |
| À propos | `/a-propos` | Frise chronologique (1972 · 1974 · 1980…), mission, vision, valeurs, direction, partenariats |
| Services | `/services` + `/services/[slug]` | Les 7 services principaux + départements, fiche détaillée (description, horaires, emplacement, responsable) |
| Médecins | `/medecins` | Équipe médicale, spécialité, service, jours de présence, filtre par service |
| Demande de consultation | `/consultation` | Formulaire (nom, téléphone, service, date préférée, motif) + message de confirmation |
| Faire un don | `/dons` | Besoins de l'hôpital, formulaire (montant, nom, e-mail), paiement **FedaPay** |
| Remerciement | `/dons/merci` | Confirmation, référence du don, reçu |
| Actualités | `/actualites` + `/actualites/[slug]` | Liste et article détaillé |
| FAQ | `/faq` | Horaires, tarifs, accès, rendez-vous, dons, confidentialité |
| Contact | `/contact` | Coordonnées, plan d'accès (carte), formulaire, Facebook / WhatsApp, bouton d'appel |

Navigation : fil d'Ariane sur toutes les pages intérieures, menu mobile en
hamburger, responsive (mobile / tablette / ordinateur), 3 clics maximum.

### 4.2 Services en ligne additionnels

| Fonctionnalité | Route | Description |
|---|---|---|
| **Recherche globale** | `⌘K` / `/` ou bouton « Rechercher… » | Palette de recherche instantanée sur les services, praticiens, actualités et FAQ (API `/api/recherche`), navigation au clavier (↑ ↓ Entrée) |
| **Assistant d'orientation** | `/triage` | Questionnaire en 5 étapes (motif, symptôme, durée, intensité, situation particulière) qui recommande le service à consulter, le délai conseillé et pré-remplit la demande de consultation |
| **Numéros d'urgence** | Accueil & `/contact` | Urgences de l'hôpital 24h/24, SAMU 114, Police 166, Gendarmerie 128, Protection civile 118, avec les gestes de premiers secours et accès direct à l'appel |
| **Fiche pratique imprimable** | `/fiche-imprimable` | Format A4 prêt à imprimer : services, horaires, contacts, urgences, plan d'accès (CSS `@media print` dédié) |
| **Barres de progression des dons** | `/dons` | Avancement réel de chaque besoin (collecte vs objectif) et compteurs animés |
| **Notifications e-mail** | Back-office | Chaque nouvelle demande, message ou don déclenche une notification à la direction (API Resend si `RESEND_API_KEY` est défini, sinon journalisation locale) |
| **WhatsApp pré-rempli** | Contact & accueil | Messages pré-rédigés pour une prise de contact rapide depuis un mobile |

### 4.3 Espace administration (`/admin`)

- **Tableau de bord** — demandes en attente, messages non lus, dons confirmés,
  actualités publiées, archives, raccourcis.
- **Contenus** — Accueil (`/admin/contenus/accueil`), À propos
  (`/admin/contenus/a-propos` : mission, vision, direction, frise
  chronologique, valeurs), Services, Médecins, Actualités, FAQ.
- **Demandes de consultation** (`/admin/demandes`) — liste (nom, téléphone,
  service, date, motif), statut *en attente / traitée*, note interne, appel
  direct au patient.
- **Dons** (`/admin/dons`) — montant, statut, date, coordonnées du donateur,
  affectation, envoi du reçu.
- **Messages de contact** (`/admin/messages`) — liste, statut *non lu / lu /
  traité*, réponse par e-mail en un clic.
- **Archives** (`/admin/archives`) — lecture seule des données archivées.
- **Paramètres** (`/admin/parametres`) — coordonnées, moyens de don, liens
  Facebook / WhatsApp, carte, besoins à financer.

### 4.4 Archivage automatique

Une donnée inactive depuis **plus de 30 jours** (ni consultée, ni modifiée)
quitte la liste active et bascule dans la table `archives` (copie JSON
consultable séparément). Le mécanisme s'exécute automatiquement à chaque
ouverture du tableau de bord et peut être déclenché manuellement depuis la
page *Archives*. La durée de conservation est paramétrable dans les paramètres
(24 mois par défaut). Les contenus **publiés** ne sont jamais archivés :
seuls les brouillons dépubliés le sont.

## 5. Sécurité

- Mots de passe **bcrypt** (coût 12), sessions serveur stockées en base
  (jeton SHA-256 en base, cookie `httpOnly` + `sameSite=lax`).
- **CSRF** : jeton *double submit* sur les formulaires publics
  (`/api/csrf` + en-tête `x-csrf-token`) ; protection native Next.js sur les
  actions serveur du back-office (vérification Origin/Host).
- **Validation stricte côté serveur** : longueurs, formats (e-mail, téléphone
  normalisé, dates), listes blanches.
- **Rôles et permissions** appliqués à chaque action serveur
  (`admin` > `content` / `requests`).
- **Pas de données médicales sensibles** dans le formulaire de consultation
  (rappel explicite à l'écran).
- Accès administration fermé : aucune inscription, rate-limiting implicite,
  aucune route d'API back-office publique.
- Secrets uniquement via `process.env` (clé FedaPay jamais exposée au
  navigateur).
- Le webhook FedaPay **re-vérifie le statut auprès de l'API FedaPay** avant
  de valider un don (source de vérité serveur).

## 6. Modèle de données (PostgreSQL)

`users`, `sessions`, `pages`, `services`, `doctors`, `news`, `faqs`,
`timeline_entries`, `hospital_values`, `donation_needs`,
`consultation_requests`, `donations`, `contact_messages`, `archives`,
`site_settings` — 15 tables définies dans `src/db/schema.ts`.

```
Service ──┬── Médecin ──► Page publique
Actualité ┤
FAQ ───────┘

Demande de consultation ──► Hôpital (traitement)
Don (FedaPay) ────────────► Hôpital (suivi)
Message de contact ───────► Hôpital (traitement)
Archives ◄── archivage automatique (+30 jours)
```

## 7. Structure du projet

```
src/
├── app/
│   ├── (public)      # accueil, à-propos, services, médecins, actualités, FAQ, don, contact
│   ├── admin/        # back-office (layout protégé + actions serveur)
├── triage/       # assistant d'orientation
├── fiche-imprimable/ # fiche A4 imprimable
└── api/          # consultation, contact, dons (+ webhook), recherche, csrf, health
├── components/       # header, footer, breadcrumb, icônes, formulaires, UI admin
├── db/               # schema.ts (Drizzle) + seed.ts (données réelles)
└── lib/              # auth, csrf, settings, fedapay, archive, format, validation
```

## 8. Mise en production

1. Variables d'environnement : `DATABASE_URL`, `FEDAPAY_ENV=live`,
   `FEDAPAY_SECRET_KEY`.
2. `npm run build && npm run start` derrière un reverse proxy (Nginx/Caddy)
   avec **HTTPS obligatoire** (Let's Encrypt).
3. Domaine **`.bj`** (~10 000 FCFA/an) pointant vers le serveur.
4. **Sauvegardes quotidiennes** automatiques chez l'hébergeur + copie hors
   site fréquente par l'administrateur ; procédure de restauration à tester.
5. PostgreSQL 15 avec RLS recommandé et accès restreint à l'application.

## 9. Gestion des pannes

Gestionnaire logistique désigné par l'hôpital : constat → contact du
développeur / de l'hébergeur → suivi → vérification du retour à la normale.
Point de contrôle applicatif : `GET /api/health` (interroge la base de
données).
