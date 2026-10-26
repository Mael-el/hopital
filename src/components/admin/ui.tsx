import type { ReactNode } from "react";
import { Icon, type IconName } from "@/components/icons";

export function AdminHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          {title}
        </h1>
        {description && (
          <p className="mt-1 max-w-2xl text-sm text-slate-600">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

export function StatCard({
  label,
  value,
  icon,
  hint,
  href,
}: {
  label: string;
  value: string | number;
  icon: IconName;
  hint?: string;
  href?: string;
}) {
  const content = (
    <div className="rounded-[3px] border border-slate-200 bg-white p-5 transition hover:border-brand-300 ">
      <div className="flex items-start justify-between">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
          {label}
        </p>
        <span className="flex h-9 w-9 items-center justify-center rounded-[3px] bg-brand-50 text-brand-700">
          <Icon name={icon} className="h-4.5 w-4.5" />
        </span>
      </div>
      <p className="mt-3 text-3xl font-bold text-slate-900">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );

  if (!href) return content;

  return (
    <a href={href} className="block">
      {content}
    </a>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string }> = {
    pending: { label: "En attente", className: "bg-amber-100 text-amber-800" },
    processed: { label: "Traitée", className: "bg-brand-100 text-brand-800" },
    success: { label: "Confirmé", className: "bg-brand-100 text-brand-800" },
    failed: { label: "Échoué", className: "bg-cross-100 text-cross-700" },
    new: { label: "Non lu", className: "bg-amber-100 text-amber-800" },
    read: { label: "Lu", className: "bg-sky-100 text-sky-800" },
    published: { label: "Publié", className: "bg-brand-100 text-brand-800" },
    unpublished: { label: "Brouillon", className: "bg-slate-200 text-slate-700" },
  };

  const entry = map[status] ?? { label: status, className: "bg-slate-200 text-slate-700" };

  return (
    <span className={`badge ${entry.className}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {entry.label}
    </span>
  );
}

export function EmptyState({
  title,
  text,
  icon = "book",
}: {
  title: string;
  text?: string;
  icon?: IconName;
}) {
  return (
    <div className="rounded-[3px] border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
      <Icon name={icon} className="mx-auto h-8 w-8 text-slate-300" />
      <p className="mt-3 font-semibold text-slate-700">{title}</p>
      {text && <p className="mt-1 text-sm text-slate-500">{text}</p>}
    </div>
  );
}

export function Field({
  label,
  name,
  defaultValue,
  type = "text",
  required,
  placeholder,
  hint,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="field-label">
        {label}
        {required ? " *" : ""}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        placeholder={placeholder}
        className="field-input"
      />
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

export function TextArea({
  label,
  name,
  defaultValue,
  rows = 5,
  required,
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  rows?: number;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="field-label">
        {label}
        {required ? " *" : ""}
      </label>
      <textarea
        id={name}
        name={name}
        rows={rows}
        defaultValue={defaultValue}
        required={required}
        placeholder={placeholder}
        className="field-input resize-y"
      />
    </div>
  );
}

export function Checkbox({
  label,
  name,
  defaultChecked,
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="h-4 w-4 rounded border-slate-300 text-brand-700 focus:ring-brand-500"
      />
      {label}
    </label>
  );
}

export function SubmitButton({ label = "Enregistrer" }: { label?: string }) {
  return (
    <button type="submit" className="btn btn-primary">
      {label}
    </button>
  );
}
