"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Icon, type IconName } from "@/components/icons";

type Result = {
  type: "service" | "medecin" | "actualite" | "faq";
  typeLabel: string;
  title: string;
  text: string;
  href: string;
};

const TYPE_ICON: Record<Result["type"], IconName> = {
  service: "hospital",
  medecin: "users",
  actualite: "sparkles",
  faq: "tag",
};

const SUGGESTIONS = [
  "Urgences",
  "Maternité",
  "Chirurgie",
  "Don",
  "Tuberculose",
  "Ulcère de Buruli",
  "Rendez-vous",
];

export function SearchDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  /* Raccourcis clavier : ⌘K / Ctrl+K et "/" */
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const typing =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      } else if (event.key === "/" && !typing && !open) {
        event.preventDefault();
        setOpen(true);
      } else if (event.key === "Escape" && open) {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(() => inputRef.current?.focus(), 40);
    return () => {
      document.body.style.overflow = "";
      window.clearTimeout(timer);
    };
  }, [open]);

  /* Résultats affichés : rien tant que la saisie est trop courte */
  const visibleResults = query.trim().length < 2 ? [] : results;

  /* Recherche différée côté serveur (états mis à jour de façon asynchrone) */
  useEffect(() => {
    if (!open) return;
    const term = query.trim();
    if (term.length < 2) return;
    const timer = window.setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/recherche?q=${encodeURIComponent(term)}`, {
          cache: "no-store",
        });
        const data = (await response.json()) as { results: Result[] };
        setResults(data.results);
        setActive(0);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 220);
    return () => window.clearTimeout(timer);
  }, [query, open]);

  const go = useCallback(
    (href: string) => {
      setOpen(false);
      setQuery("");
      router.push(href);
    },
    [router],
  );

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((index) => (index + 1) % Math.max(visibleResults.length, 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive(
        (index) =>
          (index - 1 + Math.max(visibleResults.length, 1)) %
          Math.max(visibleResults.length, 1),
      );
    } else if (event.key === "Enter" && visibleResults[active]) {
      event.preventDefault();
      go(visibleResults[active].href);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-10 items-center gap-2 rounded-lg border border-sand-300 px-3 text-sm text-slate-500 transition hover:border-brand-600 hover:text-brand-800"
        aria-label="Rechercher sur le site"
      >
        <Icon name="scan" className="h-4 w-4 rotate-90" />
        <span className="hidden 2xl:inline">Rechercher…</span>
        <kbd className="hidden rounded-md border border-sand-300 px-1.5 py-0.5 font-sans text-[0.65rem] font-semibold text-slate-400 2xl:inline">
          ⌘K
        </kbd>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-start justify-center bg-brand-950/70 p-4 pt-[8vh] backdrop-blur-sm"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Recherche sur le site"
        >
          <div
            className="w-full max-w-2xl overflow-hidden border border-sand-300 bg-white"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-sand-200 px-5">
              <Icon name="scan" className="h-4 w-4 rotate-90 text-brand-700" />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Rechercher un service, un médecin, une actualité, une question…"
                className="h-14 flex-1 bg-transparent text-[0.95rem] text-slate-800 outline-none placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg border border-sand-300 px-2 py-1 text-[0.7rem] font-semibold text-slate-500"
              >
                ÉCHAP
              </button>
            </div>

            <div className="max-h-[55vh] overflow-y-auto">
              {query.trim().length < 2 ? (
                <div className="p-5">
                  <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-slate-500">
                    Recherches fréquentes
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {SUGGESTIONS.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => setQuery(suggestion)}
                        className="rounded-lg border border-sand-300 px-3 py-1.5 text-sm text-slate-600 transition hover:border-brand-600 hover:text-brand-800"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              ) : loading ? (
                <p className="p-6 text-center text-sm text-slate-500">
                  Recherche en cours…
                </p>
              ) : visibleResults.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="font-medium text-slate-700">
                    Aucun résultat pour « {query} »
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Essayez « chirurgie », « urgence » ou appelez-nous au +229 01 95 96 84 00.
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-sand-100">
                  {visibleResults.map((result, index) => (
                    <li key={`${result.type}-${result.title}-${index}`}>
                      <Link
                        href={result.href}
                        onClick={(event) => {
                          event.preventDefault();
                          go(result.href);
                        }}
                        onMouseEnter={() => setActive(index)}
                        className={`flex items-start gap-4 px-5 py-3.5 transition ${
                          index === active ? "bg-brand-50" : "hover:bg-sand-50"
                        }`}
                      >
                        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-care-50 text-care-700">
                          <Icon name={TYPE_ICON[result.type]} className="h-4 w-4" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-[0.65rem] font-bold uppercase tracking-[0.12em] text-cross-600">
                            {result.typeLabel}
                          </span>
                          <span className="mt-0.5 block font-medium text-slate-800">
                            {result.title}
                          </span>
                          <span className="mt-0.5 block truncate text-sm text-slate-500">
                            {result.text}
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-sand-200 bg-sand-50 px-5 py-2.5 text-[0.68rem] text-slate-500">
              <span>↑ ↓ pour naviguer · Entrée pour ouvrir</span>
              <span>Recherche dans tout le site</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
