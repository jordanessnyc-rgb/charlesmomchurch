import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "gold" | "navy" | "outline" | "outlineLight" | "ghost" | "white";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60";
const variants: Record<Variant, string> = {
  gold: "bg-gold-500 text-navy-900 shadow-card hover:bg-gold-400",
  navy: "bg-navy-800 text-white shadow-card hover:bg-navy-700",
  outline: "border-2 border-navy-800 text-navy-800 hover:bg-navy-50",
  outlineLight: "border-2 border-white/70 text-white hover:bg-white/10",
  ghost: "text-navy-800 hover:bg-navy-50",
  white: "bg-white text-navy-800 shadow-card hover:bg-cream",
};
const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-2.5 text-sm sm:text-base",
  lg: "px-7 py-3.5 text-base",
};

export function buttonClass(variant: Variant = "gold", size: Size = "md", className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

export function Button({ variant = "gold", size = "md", className, ...props }: ComponentProps<"button"> & { variant?: Variant; size?: Size }) {
  return <button className={buttonClass(variant, size, className)} {...props} />;
}

export function ButtonLink({
  variant = "gold",
  size = "md",
  className,
  href,
  children,
  ...props
}: Omit<ComponentProps<typeof Link>, "href"> & { href: string; variant?: Variant; size?: Size; children: ReactNode }) {
  const external = /^https?:\/\//.test(href);
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={buttonClass(variant, size, className)}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={buttonClass(variant, size, className)} {...props}>
      {children}
    </Link>
  );
}
