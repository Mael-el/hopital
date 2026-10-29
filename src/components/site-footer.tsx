import Link from "next/link";
import Image from "next/image";
import { getSettings } from "@/lib/settings";
import { Icon, type IconName } from "./icons";

export async function SiteFooter() {
  const settings = await getSettings();
  const year = new Date().getFullYear();

  const navigation = [
    { href: "/a-propos", label: "À propos" },
    { href: "/services", label: "Services" },
    { href: "/medecins", label: "Médecins" },
    { href: "/consultation", label: "Demander une consultation" },
    { href: "/triage", label: "Quel service consulter ?" },
    { href: "/actualites", label: "Actualités" },
    { href: "/faq", label: "Questions fréquentes" },
    { href: "/dons", label: "Faire un don" },
    { href: "/fiche-imprimable", label: "Fiche pratique" },
    { href: "/contact", label: "Contact & accès" },
  ];

  return (
    <footer className="mt-20 border-t-4 border-brand-800 bg-brand-950 text-brand-100">
      <div className="container-page grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4 lg:gap-0">
        {/* Identité */}
        <div className="lg:border-r lg:border-white/10 lg:pr-8">
          <div className="flex items-center gap-3">
            <Image
              src="/images/logo.jpeg"
              alt="Logo de l'Hôpital La Croix de Zinvié"
              width={228}
              height={220}
              className="h-12 w-12 rounded-lg object-contain"
            />
            <span className="leading-tight">
              <span className="block font-serif text-lg font-bold text-white">
                Hôpital La Croix
              </span>
              <span className="block text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-cross-300">
                de Zinvié
              </span>
            </span>
          </div>
          <p className="mt-5 text-sm leading-relaxed text-brand-200/75">
            {settings.legalName}. Structure confessionnelle créée en{" "}
            {settings.founded} par les Religieux Camilliens, au service de la
            population de Zinvié et des communes environnantes.
          </p>

          <h3 className="mt-7 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-white">
            Nous suivre
          </h3>
          <div className="mt-3 flex flex-wrap gap-2.5">
            {settings.socialLinks.map((link) => (
              <a
                key={`${link.platform}-${link.url}`}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                aria-label={link.label}
                title={link.label}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 text-white/80 transition hover:border-cross-500 hover:bg-cross-600 hover:text-white"
              >
                <Icon
                  name={(link.platform as IconName) ?? "globe"}
                  className="h-4 w-4"
                />
              </a>
            ))}
          </div>
          <ul className="mt-4 space-y-1.5 text-xs text-brand-200/60">
            {settings.webLinks.slice(0, 3).map((link) => (
              <li key={link.url}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="transition hover:text-white"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Navigation */}
        <div className="lg:border-r lg:border-white/10 lg:px-8">
          <h3 className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-white">
            Navigation
          </h3>
          <ul className="mt-5 space-y-2.5 text-sm">
            {navigation.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-brand-200/75 transition hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Coordonnées */}
        <div className="lg:border-r lg:border-white/10 lg:px-8">
          <h3 className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-white">
            Nos contacts
          </h3>
          <ul className="mt-5 space-y-3.5 text-sm text-brand-200/75">
            <li className="flex gap-3">
              <Icon name="map" className="mt-0.5 h-4 w-4 shrink-0 text-brand-300" />
              <span>
                {settings.addressLine1}
                <br />
                {settings.addressLine2}
                <br />
                {settings.addressLine3}
              </span>
            </li>
            {settings.contactChannels.slice(0, 4).map((channel) => (
              <li key={channel.label} className="flex gap-3">
                <Icon
                  name={
                    channel.label.toLowerCase().includes("urgence")
                      ? "ambulance"
                      : channel.label.toLowerCase().includes("banque")
                        ? "droplet"
                        : "phone"
                  }
                  className="mt-0.5 h-4 w-4 shrink-0 text-brand-300"
                />
                <span>
                  <a
                    href={`tel:${channel.value.replace(/\s/g, "")}`}
                    className="transition hover:text-white"
                  >
                    {channel.value}
                  </a>
                  <span className="block text-xs text-brand-200/55">
                    {channel.label}
                  </span>
                </span>
              </li>
            ))}
            <li className="flex gap-3">
              <Icon name="mail" className="mt-0.5 h-4 w-4 shrink-0 text-brand-300" />
              <span className="space-y-1">
                {[settings.email, settings.emailSecondary, settings.emailEconomat]
                  .filter(Boolean)
                  .map((email) => (
                    <a
                      key={email}
                      href={`mailto:${email}`}
                      className="block break-all transition hover:text-white"
                    >
                      {email}
                    </a>
                  ))}
              </span>
            </li>
          </ul>
        </div>

        {/* Horaires */}
        <div className="lg:pl-8">
          <h3 className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-white">
            Horaires
          </h3>
          <ul className="mt-5 space-y-3.5 text-sm text-brand-200/75">
            <li className="flex gap-3">
              <Icon name="clock" className="mt-0.5 h-4 w-4 shrink-0 text-brand-300" />
              <span>{settings.openingHours}</span>
            </li>
            <li className="flex gap-3">
              <Icon name="ambulance" className="mt-0.5 h-4 w-4 shrink-0 text-cross-300" />
              <span>{settings.emergencyHours}</span>
            </li>
            <li className="flex gap-3">
              <Icon name="droplet" className="mt-0.5 h-4 w-4 shrink-0 text-brand-300" />
              <span>{settings.saturdayHours}</span>
            </li>
          </ul>
          <div className="mt-6 border-l-2 border-cross-500 bg-white/5 p-4">
            <p className="text-xs leading-relaxed text-brand-200/70">
              Le service des urgences est assuré en continu, jour et nuit, par
              l&apos;équipe de garde de l&apos;hôpital.
            </p>
          </div>
          <p className="mt-4 text-xs text-brand-200/50">
            {settings.beds} · {settings.staffCount}
          </p>
        </div>
      </div>

      {/* Bandeau institutionnel */}
      <div className="border-t border-white/10 bg-black/15">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-5 text-xs text-brand-200/60 md:flex-row">
          <p>
            © {year} {settings.hospitalName} — Tous droits réservés.
          </p>
          <div className="flex flex-col items-center gap-2 md:flex-row md:gap-6">
            <p className="flex flex-wrap items-center justify-center gap-5">
              <span className="flex items-center gap-2">
                <Icon name="shield" className="h-3.5 w-3.5" />
                Espace patients sécurisé
              </span>
              <Link
                href="/admin/connexion"
                className="transition hover:text-white"
              >
                Espace administration
              </Link>
            </p>
            <p className="flex flex-wrap items-center justify-center gap-2 border-white/10 md:border-l md:pl-6">
              <Icon name="sparkles" className="h-3.5 w-3.5 text-brand-300" />
              <span>
                Conçu &amp; maintenu par Ismail ET Simon Jude AGOHOUNDJE —{" "}
                <a
                  href="mailto:ismailagohoundje14@gmail.com"
                  className="transition hover:text-white"
                >
                  ismailagohoundje14@gmail.com
                </a>{" "}
                ·{" "}
                <a href="tel:0161791967" className="transition hover:text-white">
                  01 61 79 19 67
                </a>{" "}
                /{" "}
                <a href="tel:0197766645" className="transition hover:text-white">
                  01 97 76 66 45
                </a>
              </span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
