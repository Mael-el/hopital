"use client";

import { useState } from "react";
import { Icon } from "@/components/icons";
import { postJson } from "@/lib/client";

const PRESETS = [1000, 2000, 5000, 10000, 25000, 50000];

export function DonationForm({
  purposes,
}: {
  purposes: { title: string }[];
}) {
  const [amount, setAmount] = useState<number>(5000);
  const [custom, setCustom] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const effectiveAmount = custom ? Number(custom) : amount;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setErrors({});
    setGlobalError(null);

    const form = new FormData(event.currentTarget);
    const payload = {
      amount: effectiveAmount,
      donorName: String(form.get("donorName") ?? ""),
      donorEmail: String(form.get("donorEmail") ?? ""),
      donorPhone: String(form.get("donorPhone") ?? ""),
      purpose: String(form.get("purpose") ?? ""),
      message: String(form.get("message") ?? ""),
    };

    try {
      const { status, data } = await postJson<{
        ok?: boolean;
        paymentUrl?: string;
        reference?: string;
        errors?: Record<string, string>;
        error?: string;
      }>("/api/dons", payload);

      if (status === 200 && data.ok && data.paymentUrl) {
        window.location.href = data.paymentUrl;
        return;
      }
      if (data.errors) {
        setErrors(data.errors);
        setGlobalError("Merci de corriger les informations saisies.");
      } else {
        setGlobalError(data.error ?? "Le paiement n'a pas pu être initialisé.");
      }
    } catch {
      setGlobalError(
"Une erreur est survenue. Merci de réessayer ou de contacter l'hôpital.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {globalError && (
        <p className="rounded-[3px] bg-cross-50 px-4 py-3 text-sm font-medium text-cross-700">
          {globalError}
        </p>
      )}

      <div>
        <span className="field-label">Montant du don (FCFA) *</span>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => {
                setAmount(preset);
                setCustom("");
              }}
              className={`rounded-[3px] border px-3 py-2.5 text-sm font-semibold transition ${
                !custom && amount === preset
                  ? "border-brand-600 bg-brand-600 text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:border-brand-400"
              }`}
            >
              {new Intl.NumberFormat("fr-FR").format(preset)}
            </button>
          ))}
        </div>
        <div className="mt-3">
          <label htmlFor="customAmount" className="sr-only">
            Montant personnalisé
          </label>
          <input
            id="customAmount"
            type="number"
            min={100}
            max={20000000}
            step={100}
            value={custom}
            onChange={(event) => setCustom(event.target.value)}
            placeholder="Autre montant (FCFA)"
            className="field-input"
          />
          {errors.amount && (
            <p className="mt-1 text-xs font-medium text-cross-600">
              {errors.amount}
            </p>
          )}
        </div>
        <p className="mt-2 text-sm font-semibold text-brand-800">
          Total :{" "}
          {new Intl.NumberFormat("fr-FR").format(
            Number.isFinite(effectiveAmount) ? effectiveAmount : 0,
          )}{" "}
          FCFA
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="donorName" className="field-label">
            Nom (facultatif)
          </label>
          <input
            id="donorName"
            name="donorName"
            type="text"
            maxLength={120}
            className="field-input"
          />
        </div>
        <div>
          <label htmlFor="donorEmail" className="field-label">
            E-mail (facultatif)
          </label>
          <input
            id="donorEmail"
            name="donorEmail"
            type="email"
            maxLength={160}
            className="field-input"
          />
          {errors.donorEmail && (
            <p className="mt-1 text-xs font-medium text-cross-600">
              {errors.donorEmail}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="donorPhone" className="field-label">
            Téléphone (facultatif)
          </label>
          <input
            id="donorPhone"
            name="donorPhone"
            type="tel"
            maxLength={40}
            className="field-input"
          />
        </div>
        <div>
          <label htmlFor="purpose" className="field-label">
            Affectation du don (facultatif)
          </label>
          <select id="purpose" name="purpose" className="field-input" defaultValue="">
            <option value="">Fonds libres</option>
            {purposes.map((purpose) => (
              <option key={purpose.title} value={purpose.title}>
                {purpose.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="message" className="field-label">
          Message à l&apos;hôpital (facultatif)
        </label>
        <textarea
          id="message"
          name="message"
          rows={3}
          maxLength={1000}
          className="field-input resize-y"
        />
      </div>

      <button type="submit" disabled={loading} className="btn btn-accent w-full">
        {loading ? (
"Préparation du paiement…"
        ) : (
          <>
            <Icon name="hand-heart" className="h-4 w-4" />
            Payer avec FedaPay
          </>
        )}
      </button>

      <p className="flex items-start gap-2 text-xs leading-relaxed text-slate-500">
        <Icon name="shield" className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
        Le paiement est sécurisé par FedaPay (MTN Mobile Money, Moov Money, carte
        bancaire). L&apos;hôpital reçoit un reçu pour chaque don confirmé.
      </p>
    </form>
  );
}
