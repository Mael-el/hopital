"use client";

import { useEffect, useRef, useState } from "react";

/** Compteur animé (de 0 à la valeur) déclenché à l'entrée dans l'écran. */
export function AnimatedCounter({
  value,
  duration = 1400,
  className,
}: {
  value: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || started.current) return;
          started.current = true;

          const reduce =
            typeof window !== "undefined" &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches;

          if (reduce) {
            setDisplay(value);
            return;
          }

          const start = performance.now();
          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.round(value * eased));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        });
      },
      { threshold: 0.3 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [value, duration]);

  return (
    <span ref={ref} className={className}>
      {new Intl.NumberFormat("fr-FR").format(display)}
    </span>
  );
}

/** Barre de progression (collecte d'un besoin). */
export function ProgressBar({
  raised,
  target,
  className = "",
}: {
  raised: number;
  target: number;
  className?: string;
}) {
  const percentage = target > 0 ? Math.min(100, Math.round((raised / target) * 100)) : 0;

  return (
    <div className={className}>
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-sand-200"
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-brand-600 transition-[width] duration-700 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="mt-2 text-xs font-medium text-slate-500">
        <span className="font-bold text-brand-800">{percentage}%</span> de l&apos;objectif
        atteint
      </p>
    </div>
  );
}
