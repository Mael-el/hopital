"use client";

import { useState } from "react";
import { Icon } from "@/components/icons";
import { postJson } from "@/lib/client";

export function DemoPaymentConfirm({ reference }: { reference: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
"idle",
  );

  async function confirm() {
    setStatus("loading");
    try {
      const { status: code, data } = await postJson<{ ok?: boolean; error?: string }>(
"/api/dons/demo-confirm",
        { reference },
      );
      if (code === 200 && data.ok) {
        setStatus("done");
        window.location.reload();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <p className="flex items-center gap-2 text-sm font-semibold text-brand-700">
        <Icon name="check" className="h-4 w-4" />
        Don confirmé. Merci !
      </p>
    );
  }

  return (
    <div>
      <p className="text-sm text-slate-600">
        Mode démonstration : aucune clé FedaPay n&apos;est configurée sur cette
        installation. Vous pouvez simuler la confirmation du paiement pour voir
        le parcours complet.
      </p>
      {status === "error" && (
        <p className="mt-2 text-sm font-medium text-cross-600">
          La confirmation a échoué. Merci de réessayer.
        </p>
      )}
      <button
        type="button"
        onClick={confirm}
        disabled={status === "loading"}
        className="btn btn-accent mt-4"
      >
        {status === "loading" ? "Confirmation…" : "Simuler le paiement"}
      </button>
    </div>
  );
}
