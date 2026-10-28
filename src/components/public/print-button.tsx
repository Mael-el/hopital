"use client";

import { Icon } from "@/components/icons";

export function PrintButton({ label = "Imprimer la fiche" }: { label?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="btn btn-primary no-print"
    >
      <Icon name="book" className="h-4 w-4" />
      {label}
    </button>
  );
}
