import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Section({
  children,
  className,
  tone = "white",
  id,
}: {
  children: ReactNode;
  className?: string;
  tone?: "white" | "cream" | "navy" | "navy-light";
  id?: string;
}) {
  const tones = {
    white: "bg-white",
    cream: "bg-cream",
    navy: "bg-navy-texture text-white",
    "navy-light": "bg-navy-50",
  };
  return (
    <section id={id} className={cn("py-14 sm:py-20", tones[tone], className)}>
      <div className="container-x">{children}</div>
    </section>
  );
}

export function SectionHeading({
  kicker,
  title,
  text,
  align = "left",
  light = false,
  className,
}: {
  kicker?: string;
  title: string;
  text?: string;
  align?: "left" | "center";
  light?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("mb-10 max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {kicker && <p className={cn("kicker mb-3", light && "text-gold-300")}>{kicker}</p>}
      <h2 className={cn("text-3xl font-semibold sm:text-4xl", light ? "text-white" : "text-navy-800")}>{title}</h2>
      <div className={cn("gold-rule mt-4", align === "center" && "mx-auto")} />
      {text && <p className={cn("mt-4 text-lg leading-relaxed", light ? "text-white/80" : "text-muted")}>{text}</p>}
    </div>
  );
}

export function PageHero({ kicker, title, text, children }: { kicker?: string; title: string; text?: string; children?: ReactNode }) {
  return (
    <div className="bg-hero text-white">
      <div className="container-x py-16 sm:py-24">
        <div className="max-w-3xl">
          {kicker && <p className="kicker mb-3 text-gold-300">{kicker}</p>}
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">{title}</h1>
          {text && <p className="mt-5 text-lg leading-relaxed text-white/85 sm:text-xl">{text}</p>}
          {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
        </div>
      </div>
    </div>
  );
}
