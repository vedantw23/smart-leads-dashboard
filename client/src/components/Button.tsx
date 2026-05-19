import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "danger";

const styles: Record<Variant, string> = {
  primary: "bg-meadow text-white hover:bg-emerald-700",
  secondary: "border border-slate-300 bg-white text-ink hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white",
  danger: "bg-coral text-white hover:bg-red-700"
};

export const Button = ({ className = "", variant = "primary", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) => (
  <button
    className={`inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${styles[variant]} ${className}`}
    {...props}
  />
);
