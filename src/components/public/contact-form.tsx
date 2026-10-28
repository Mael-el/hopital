"use client";

import { useState } from "react";
import { Icon } from "@/components/icons";
import { postJson } from "@/lib/client";

type Errors = Record<string, string>;

export function ContactForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setErrors({});
    setGlobalError(null);

    const form = new FormData(event.currentTarget);
    const payload = {
      fullName: String(form.get("fullName") ?? ""),
      email: String(form.get("email") ?? ""),
      phone: String(form.get("phone") ?? ""),
      subject: String(form.get("subject") ?? ""),
      message: String(form.get("message") ?? ""),
    };

    try {
      const { status, data } = await postJson<{
        ok?: boolean;
        message?: string;
        errors?: Errors;
        error?: string;
      }>("/api/contact", payload);

      if (status === 200 && data.ok) {
        setSuccess(
          data.message ??
"Votre message a bien été envoyé. L'hôpital vous répondra dans les meilleurs délais.",
        );
        event.currentTarget.reset();
      } else if (data.errors) {
        setErrors(data.errors);
      } else {
        setGlobalError(data.error ?? "Une erreur est survenue. Merci de réessayer.");
      }
    } catch {
      setGlobalError("Une erreur est survenue. Merci de réessayer.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-xl border border-brand-200 bg-brand-50 p-8 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-700 text-white">
          <Icon name="check" className="h-7 w-7" strokeWidth={2.4} />
        </span>
        <h3 className="mt-5 text-xl font-bold text-brand-900">Message envoyé</h3>
        <p className="mx-auto mt-3 max-w-md leading-relaxed text-brand-800">
          {success}
        </p>
        <button
          type="button"
          onClick={() => setSuccess(null)}
          className="btn btn-ghost mt-6"
        >
          Écrire un autre message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {globalError && (
        <p className="rounded-lg bg-cross-50 px-4 py-3 text-sm font-medium text-cross-700">
          {globalError}
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
            className="field-input"
          />
          {errors.fullName && (
            <p className="mt-1 text-xs font-medium text-cross-600">
              {errors.fullName}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="email" className="field-label">
            Adresse e-mail *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            maxLength={160}
            className="field-input"
          />
          {errors.email && (
            <p className="mt-1 text-xs font-medium text-cross-600">{errors.email}</p>
          )}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className="field-label">
            Téléphone (facultatif)
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            maxLength={40}
            className="field-input"
          />
        </div>
        <div>
          <label htmlFor="subject" className="field-label">
            Objet *
          </label>
          <input
            id="subject"
            name="subject"
            type="text"
            required
            maxLength={160}
            className="field-input"
          />
          {errors.subject && (
            <p className="mt-1 text-xs font-medium text-cross-600">
              {errors.subject}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="message" className="field-label">
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          maxLength={4000}
          className="field-input resize-y"
        />
        {errors.message && (
          <p className="mt-1 text-xs font-medium text-cross-600">{errors.message}</p>
        )}
      </div>

      <button type="submit" disabled={loading} className="btn btn-primary">
        {loading ? "Envoi en cours…" : "Envoyer le message"}
        {!loading && <Icon name="arrow-right" className="h-4 w-4" />}
      </button>
    </form>
  );
}
