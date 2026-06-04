import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary";
type Size = "md" | "lg";

const base =
  "group relative inline-flex select-none items-center justify-center gap-2 overflow-hidden rounded-full font-display font-semibold tracking-tight transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/70 focus-visible:ring-offset-2 focus-visible:ring-offset-navy disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary:
    "bg-gold text-navy-deep shadow-[0_12px_42px_-14px_rgba(201,168,76,0.75)] hover:bg-gold-soft hover:-translate-y-0.5 hover:shadow-[0_16px_52px_-12px_rgba(201,168,76,0.9)]",
  secondary:
    "border border-ink/20 text-ink hover:-translate-y-0.5 hover:border-gold/60 hover:bg-white/[0.06]",
};

const sizes: Record<Size, string> = {
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-[0.95rem]",
};

function classesFor(variant: Variant, size: Size, className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

function Inner({ variant, children }: { variant: Variant; children: ReactNode }) {
  return (
    <>
      {variant === "primary" && (
        <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
          <span className="absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-white/30 blur-md transition-transform duration-700 ease-out group-hover:translate-x-[400%]" />
        </span>
      )}
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </>
  );
}

type SharedProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: SharedProps & Omit<ComponentPropsWithoutRef<"button">, "className" | "children">) {
  return (
    <button className={classesFor(variant, size, className)} {...rest}>
      <Inner variant={variant}>{children}</Inner>
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  children,
  href,
  ...rest
}: SharedProps & { href: string } & Omit<
    ComponentPropsWithoutRef<"a">,
    "className" | "children" | "href"
  >) {
  return (
    <Link href={href} className={classesFor(variant, size, className)} {...rest}>
      <Inner variant={variant}>{children}</Inner>
    </Link>
  );
}
