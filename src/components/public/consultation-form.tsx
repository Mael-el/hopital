"use client";

import { useState } from "react";
import { Icon } from "@/components/icons";
import { postJson } from "@/lib/client";

type ServiceOption = { slug: string; name: string; hours: string };

type Errors = Record<string, string>;

export function ConsultationForm({
  services,
  defaultService = "",
  defaultMotif = "",
}: {
  services: ServiceOption[];
  defaultService?: string;
  defaultMotif?: string;
}) {
  const [errors, setErrors] = useState<Errors>({});
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<{ message: string; reference: string } | null>(
    null,
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setErrors({});
    setGlobalError(null);

    const form = new FormData(event.currentTarget);
    const payload = {
      fullName: String(form.get("fullName") ?? ""),
      phone: String(form.get("phone") ?? ""),
      serviceSlug: String(form.get("serviceSlug") ?? ""),
      preferredDate: String(form.get("preferredDate") ?? ""),
      reason: String(form.get("reason") ?? ""),
    };

    try {
      const { status, data } = await postJson<
        {
          ok?: boolean;
          message?: string;
          reference?: string;
          errors?: Errors;
          error?: string;
        }
      >("/api/consultation", payload);

      if (status === 200 && data.ok) {
        setSuccess({
          message:
            data.message ??
"Votre demande a bien été transmise. L'hôpital vous rappellera pour fixer le rendez-vous.",
          reference: data.reference ?? "",
        });
        event.currentTarget.reset();
      } else if (data.errors) {
        setErrors(data.errors);
      } else {
        setGlobalError(data.error ?? "Une erreur est survenue. Merci de réessayer.");
      }
    } catch {
      setGlobalError(
"Une erreur est survenue lors de l'envoi. Merci de réessayer ou de nous appeler.",
      );
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-[4px] border border-brand-200 bg-brand-50 p-8 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-700 text-white">
          <Icon name="check" className="h-7 w-7" strokeWidth={2.4} />
        </span>
        <h3 className="mt-5 text-xl font-bold text-brand-900">
          Demande enregistrée
        </h3>
        <p className="mx-auto mt-3 max-w-md leading-relaxed text-brand-800">
          {success.message}
        </p>
        {success.reference && (
          <p className="mt-4 inline-block rounded-[3px] bg-white px-4 py-2 text-sm font-semibold text-brand-800">
            Référence : {success.reference}
          </p>
        )}
        <p className="mt-5 flex items-center justify-center gap-2 text-sm text-slate-600">
          <Icon name="phone" className="h-4 w-4" />
          En cas d&apos;urgence, appelez le +229 97 21 48 39 (urgences 24h/24).
        </p>
        <button
          type="button"
          onClick={() => setSuccess(null)}
          className="btn btn-ghost mt-6"
        >
          Envoyer une autre demande
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {globalError && (
        <p className="rounded-[3px] bg-cross-50 px-4 py-3 text-sm font-medium text-cross-700">
          {globalError}
        </p>
      )}

      {defaultMotif && (
        <p className="flex items-start gap-2 rounded-[3px] border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-800">
          <Icon name="sparkles" className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            Votre demande a été pré-remplie à partir de l&apos;assistant
            d&apos;orientation. Vérifiez et complétez si nécessaire.
          </span>
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="fullName" className="field-label">
            Nom et prénom(s) *
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            maxLength={120}
            placeholder="Ex. Aïcha Koudjo"
            className="field-input"
          />
          {errors.fullName && (
            <p className="mt-1 text-xs font-medium text-cross-600">
              {errors.fullName}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="field-label">
            Numéro de téléphone *
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            maxLength={40}
            placeholder="+229 97 00 00 00"
            className="field-input"
          />
          {errors.phone && (
            <p className="mt-1 text-xs font-medium text-cross-600">{errors.phone}</p>
          )}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="serviceSlug" className="field-label">
            Service souhaité *
          </label>
          <select
            id="serviceSlug"
            name="serviceSlug"
            required
            defaultValue={defaultService}
            className="field-input"
          >
            <option value="" disabled>
              Choisir un service
            </option>
            {services.map((service) => (
              <option key={service.slug} value={service.slug}>
                {service.name}
              </option>
            ))}
          </select>
          {errors.serviceSlug && (
            <p className="mt-1 text-xs font-medium text-cross-600">
              {errors.serviceSlug}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="preferredDate" className="field-label">
            Date préférée (facultatif)
          </label>
          <input
            id="preferredDate"
            name="preferredDate"
            type="date"
            className="field-input"
          />
          {errors.preferredDate && (
            <p className="mt-1 text-xs font-medium text-cross-600">
              {errors.preferredDate}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="reason" className="field-label">
          Motif de la demande *
        </label>
        <textarea
          id="reason"
          name="reason"
          rows={5}
          required
          maxLength={2000}
          defaultValue={defaultMotif}
          placeholder="Décrivez brièvement votre besoin (ne précisez aucune information médicale sensible : nos équipes vous recevront en consultation)."
          className="field-input resize-y"
        />
        {errors.reason && (
          <p className="mt-1 text-xs font-medium text-cross-600">{errors.reason}</p>
        )}
      </div>

      <div className="flex flex-col gap-4 rounded-[3px] bg-sand-100 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-start gap-2 text-xs leading-relaxed text-slate-600">
          <Icon name="shield" className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
          Cette demande n&apos;est pas un rendez-vous confirmé : l&apos;hôpital vous
          rappellera pour fixer la date et l&apos;heure. Merci de ne pas
          transmettre d&apos;informations médicales sensibles.
        </p>
        <button type="submit" disabled={loading} className="btn btn-accent shrink-0">
          {loading ? "Envoi en cours…" : "Envoyer ma demande"}
          {!loading && <Icon name="arrow-right" className="h-4 w-4" />}
        </button>
      </div>
    </form>
  );
}
