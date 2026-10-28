# Guide technique et de reprise

**Hôpital « La Croix » de Zinvié**

Guide destiné à la direction et à la personne chargée de reprendre le site.

**Mise à jour : 29 octobre 2026**

> **Confidentialité :** ce guide peut être conservé avec le code source. Il ne
> contient aucun mot de passe, clé API ni URL de connexion à la base. Les mots
> de passe doivent être remis séparément, par un gestionnaire de mots de passe
> autorisé. Ne jamais ajouter un fichier `.env`, `.env.local` ou une capture
> contenant ces valeurs à GitHub.

## 1. Accès et comptes

La connexion au back-office se fait à l’adresse `/admin/connexion` du site.
Chaque personne doit recevoir son propre accès et ne partager son mot de passe
que par le canal sécurisé retenu par l’hôpital.

| Identifiant | Rôle | Droits principaux |
|---|---|---|
| `direction` | Administrateur principal | Tous les écrans, paramètres et statistiques d’audience |
| `contenus` | Gestionnaire de contenus | Pages, services, médecins, actualités et FAQ |
| `demandes` | Gestionnaire demandes et dons | Demandes, dons, messages et archives |
| `developpeur` | Développeur et maintenance | Accès complet, comme l’administrateur |

Les mots de passe ne figurent pas dans ce document. Ils sont enregistrés sous
forme de hash bcrypt dans la table `users` de Neon. Les variables de seed
`SEED_ADMIN_PASSWORD`, `SEED_CONTENT_PASSWORD`, `SEED_REQUESTS_PASSWORD` et
`SEED_DEVELOPER_PASSWORD`, si elles existent dans un fichier local, servent à
initialiser des comptes : elles ne constituent pas une procédure de
réinitialisation. Le site ne propose pas de récupération autonome du mot de
passe. En cas de perte, contacter la direction et une personne technique
autorisée pour réinitialiser le compte, invalider ses sessions et remettre le
nouveau mot de passe en privé.

## 2. Vue d’ensemble

- **Application :** Next.js 16, React 19 et TypeScript, avec rendu côté serveur.
- **Hébergement visé :** Vercel ; le dépôt GitHub est relié au projet Vercel.
- **Base :** PostgreSQL hébergé chez Neon, accès via Drizzle ORM et `pg`.
- **Code source :** dépôt GitHub `Mael-el/hopital`, branche `main`.
- **Point de contrôle :** `https://<domaine-du-site>/api/health` doit répondre
  avec HTTP 200 et `{"ok":true}` si l’application peut joindre PostgreSQL.
- **Administration :** `/admin`; les pages et actions vérifient la session et
  le rôle côté serveur.

Vercel et Neon sont des services distincts : Vercel exécute le site ; Neon
stocke les comptes, contenus, réglages, demandes, dons, messages et statistiques.
Le déploiement final et les variables Vercel doivent être vérifiés dans leurs
tableaux de bord avant de considérer le site prêt en production.

## 3. Où trouver le code

| Chemin | Rôle |
|---|---|
| `src/app/` | Pages publiques, pages d’administration et routes API |
| `src/app/admin/` | Tableau de bord, gestion de contenu et actions protégées |
| `src/app/api/` | Formulaires, recherche, paiements, CSRF et état de santé |
| `src/components/` | En-tête, pied de page, formulaires et composants UI |
| `src/db/schema.ts` | Schéma PostgreSQL (tables et relations) |
| `src/db/index.ts` | Connexion PostgreSQL/Drizzle de l’application |
| `src/db/seed.ts` | Jeu de données initial et mode contenu uniquement |
| `src/lib/auth.ts` | Connexion, sessions et contrôle des rôles |
| `src/lib/settings.ts` | Réglages par défaut et lecture des réglages du site |
| `src/lib/` | E-mail, paiement, audience, validation, archivage et utilitaires |
| `.env.example` | Noms des variables attendues ; aucune vraie valeur secrète |

Tables principales : `users`, `sessions`, `pages`, `services`, `doctors`,
`news`, `faqs`, `timeline_entries`, `hospital_values`, `donation_needs`,
`consultation_requests`, `donations`, `contact_messages`, `archives`,
`site_settings` et `page_views`.

## 4. Démarrer et vérifier en local

Prérequis : Node.js compatible avec Next.js 16 et npm.

```bash
npm ci
npm run dev -- --port 3000
```

Le fichier `.env.local` doit exister localement et contenir une vraie
`DATABASE_URL`. Ne pas recopier une URL de production sur un poste non autorisé.
Pour vérifier avant une mise en ligne :

```bash
npm run typecheck
npm run lint
npm run build
```

Arrêter le serveur de développement avec `Ctrl+C`. Le site ne peut pas charger
les pages dynamiques si la base est inaccessible.

## 5. Déploiement et variables d’environnement

Dans **Vercel → projet → Settings → Environment Variables**, vérifier au minimum :

| Variable | Utilité |
|---|---|
| `DATABASE_URL` | URL PostgreSQL Neon poolée pour les requêtes de l’application |
| `NEXT_PUBLIC_SITE_URL` | URL publique du site si elle diffère de la valeur par défaut |
| `FEDAPAY_ENV` | `sandbox` pendant les essais ; `live` uniquement après validation |
| `FEDAPAY_SECRET_KEY` | Clé privée FedaPay ; ne jamais utiliser une clé de test en production |
| `RESEND_API_KEY` | Facultative ; active l’envoi des notifications par e-mail |
| `MAIL_FROM` | Expéditeur des e-mails, facultatif |
| `MAIL_TO_ADMIN` | Adresse qui reçoit les notifications, facultative |

Ajouter les variables à l’environnement Vercel approprié (**Preview** pour les
essais, **Production** pour le vrai site), puis relancer le déploiement afin que
la version déployée les prenne en compte. Ne jamais préfixer une clé privée par
`NEXT_PUBLIC_`. Les variables `SEED_*` ne doivent pas être ajoutées à Vercel
pour faire fonctionner le site.

Pour une évolution de schéma, faire une sauvegarde Neon, examiner le changement
Drizzle, puis exécuter la migration depuis une machine autorisée avec une URL
appropriée. `npm run db:push` modifie le schéma : ne pas le lancer à l’aveugle
sur la base de production. Une ancienne tentative a rencontré le conflit
`admins_id_seq` lié à une table Neon préexistante ; en cas de conflit, arrêter
et faire examiner le schéma avant toute suppression ou nouvelle tentative.

## 6. Base Neon et initialisation du contenu

Les comptes et le contenu du site sont déjà présents dans la base Neon
configurée lors de la mise en place. Ne relancer aucun seed en production sans
validation explicite et sauvegarde préalable.

- `npm run db:seed` est réservé à une base neuve : il crée les comptes et ajoute
  aussi des données de démonstration (demandes, dons, messages). Ne pas
  l’utiliser sur la base de l’hôpital.
- `DOTENV_CONFIG_PATH=.env.local npx tsx src/db/seed.ts --content-only` ajoute
  uniquement le contenu public si ses tables sont vides et vérifie que les
  quatre comptes attendus sont actifs. Il échoue si ces préconditions ne sont
  pas respectées ; ne pas le relancer sur un contenu déjà présent.
- Ne jamais exécuter de `DROP`, `TRUNCATE` ou commande de réinitialisation sur
  Neon pour résoudre une erreur.
- Vérifier les sauvegardes Neon et tester périodiquement la procédure de
  restauration avec une personne autorisée.

## 7. Dépannage rapide

| Symptôme | Vérifications sans risque |
|---|---|
| `getaddrinfo ENOTFOUND HOST` | `DATABASE_URL` est probablement un exemple (`HOST`) ou mal copiée. Remplacer la variable locale/Vercel par l’URL Neon correcte ; ne pas partager sa valeur. |
| Erreur SQL `site_settings` ou table absente | Vérifier que Vercel pointe vers le bon projet Neon et que le schéma de l’application existe. Ne pas exécuter de migration destructive. |
| `/api/health` renvoie 500 | Vérifier la connexion, l’état de Neon et `DATABASE_URL`, puis lire les journaux Vercel. Ne pas publier les journaux s’ils contiennent des secrets. |
| Le site répond à une ancienne version | Vérifier le dernier déploiement Vercel, sa branche/commit et l’état de la construction. |
| Connexion admin refusée | Vérifier l’identifiant, l’état actif du compte et le rôle. Après plusieurs essais, demander une réinitialisation autorisée ; ne pas partager le mot de passe. |
| E-mail non reçu | Vérifier `RESEND_API_KEY`, le domaine expéditeur et les journaux serveur. Sans clé, les notifications ne sont pas envoyées par Resend. |
| Paiement bloqué ou en test | Vérifier `FEDAPAY_ENV` et les clés correspondantes. Garder `sandbox` jusqu’à validation par l’hôpital et FedaPay. |

Ordre de diagnostic conseillé : relever l’heure et l’adresse concernée, vérifier
`/api/health`, consulter les journaux du dernier déploiement, vérifier les
statuts Vercel/Neon, puis corriger une seule configuration à la fois. Ne jamais
envoyer de données de patient, URL de base, mot de passe ou clé API dans une
demande d’assistance publique.

## 8. Sécurité et continuité

Les réponses HTTP ajoutent une CSP avec nonce par requête en production,
`frame-ancestors 'none'`, `X-Frame-Options: DENY`,
`X-Content-Type-Options: nosniff`, `Referrer-Policy`,
`Permissions-Policy`, COOP et CORP. Les pages `/admin` et `/api` reçoivent
également `Cache-Control: no-store`. La CSP autorise l’iframe Google Maps et les
styles inline nécessaires à l’interface ; les scripts inline doivent utiliser
le nonce fourni par Next.js. Configuration dans `src/proxy.ts` et
`next.config.ts`. Vérifier les en-têtes sur la Preview Vercel après chaque
changement ; un contrôle local ne prouve pas à lui seul la configuration en
production.

1. Utiliser des mots de passe uniques, les conserver dans un gestionnaire
   approuvé par l’hôpital et les remettre à la personne remplaçante par un
   partage privé ; ne pas les écrire dans GitHub, e-mail collectif ou ce guide.
2. Limiter l’accès aux comptes Vercel, Neon et GitHub aux personnes mandatées ;
   activer l’authentification multifacteur.
3. Contrôler les sauvegardes et accès à la base. Les demandes de consultation
   contiennent des coordonnées et motifs : les traiter comme des données
   confidentielles.
4. Tester toute mise à jour en Preview avant Production ; garder FedaPay en
   sandbox jusqu’à approbation formelle.
5. Avant tout changement important : sauvegarder, vérifier le retour arrière et
   informer la direction. Après déploiement, contrôler le site, `/api/health`,
   la connexion admin et les formulaires sans soumettre de données réelles.
6. Après chaque relève, changer les accès de la personne sortante et vérifier
   que les autres comptes restent nominatifs et nécessaires.

## 9. État de référence et relève

Le dernier commit connu poussé sur `main` est `7866731` (`Add Neon content-only
seed mode`). Le dépôt de travail local peut contenir des changements non poussés.
Avant de publier, exécuter `git status`, examiner les différences, ne sélectionner
que les fichiers prévus et vérifier qu’aucun secret ou `.env.local` n’est inclus.

À compléter par l’hôpital dans son registre interne :

- Responsable de la relève : __________________________________
- Personne autorisée pour Vercel : _____________________________
- Personne autorisée pour Neon / sauvegardes : _________________
- Gestionnaire sécurisé des mots de passe : ___________________
- Date du dernier test de restauration : ______________________
- URL de production confirmée : _______________________________
