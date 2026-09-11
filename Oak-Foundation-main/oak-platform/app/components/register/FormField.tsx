import type { ReactNode } from "react";

type FormFieldProps = {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
};

export default function FormField({
  id,
  label,
  required,
  error,
  hint,
  children,
}: FormFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.14em] text-[#5B6B84]"
      >
        {label}
        {required && (
          <span className="ml-0.5 text-red-500" aria-hidden>
            *
          </span>
        )}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-[11px] font-medium text-red-500" role="alert">
          {error}
        </p>
      )}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1.5 text-[11px] text-[#8B98AC]">
          {hint}
        </p>
      )}
    </div>
  );
}