import type { Metadata } from "next";
import Link from "next/link";

import { Icon } from "@/components/icons";
import { loginAction } from "../actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Connexion administration",
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ erreur?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const { erreur } = await searchParams;

  return (
    <div className="w-full max-w-md">
      <div className="rounded-xl border border-slate-200 bg-white p-8 ">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-700 text-white">
            <Icon name="cross" className="h-6 w-6" strokeWidth={2} />
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-cross-600">
              Espace réservé
            </p>
            <h1 className="text-lg font-bold text-brand-900">
              Administration de l&apos;hôpital
            </h1>
          </div>
        </div>

        <p className="mt-5 text-sm leading-relaxed text-slate-600">
          L&apos;accès au back-office est fermé : aucun compte ne peut être
          créé depuis le site public. Utilisez les identifiants fournis par la
          direction de l&apos;hôpital.
        </p>

        {erreur && (
          <p className="mt-5 rounded-lg bg-cross-50 px-4 py-3 text-sm font-medium text-cross-700">
            Identifiants incorrects. Merci de réessayer.
          </p>
        )}

        <form action={loginAction} className="mt-6 space-y-4">
          <div>
            <label htmlFor="username" className="field-label">
              Identifiant
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              autoComplete="username"
              className="field-input"
            />
          </div>
          <div>
            <label htmlFor="password" className="field-label">
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="field-input"
            />
          </div>
          <button type="submit" className="btn btn-primary w-full">
            <Icon name="shield" className="h-4 w-4" />
            Se connecter
          </button>
        </form>
      </div>

      <p className="mt-6 text-center text-xs text-slate-500">
        Hôpital « La Croix » de Zinvié — Yêvié, Route de Zinvié, Bénin ·{" "}
        <Link href="/" className="font-semibold text-brand-700 underline">
          Retour au site public
        </Link>
      </p>
    </div>
  );
}
