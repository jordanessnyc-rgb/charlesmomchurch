import Image from "next/image";
import { cn } from "@/lib/utils";

/** Shows the image when a URL is set; otherwise an elegant branded placeholder. */
export function Photo({
  src,
  alt,
  className,
  label,
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority,
}: {
  src?: string;
  alt: string;
  className?: string;
  label?: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (src) {
    return (
      <div className={cn("relative overflow-hidden bg-navy-100", className)}>
        <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" priority={priority} />
      </div>
    );
  }
  return (
    <div
      className={cn("relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-navy-700 via-navy-800 to-navy-900", className)}
      role="img"
      aria-label={alt}
    >
      <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(400px 200px at 80% 20%, rgb(212 175 55 / .5), transparent 60%)" }} />
      <div className="relative flex flex-col items-center gap-2 text-gold-300">
        <Dove className="h-10 w-10" />
        {label && <span className="text-xs font-medium uppercase tracking-[0.2em] text-white/60">{label}</span>}
      </div>
    </div>
  );
}

export function Dove({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      <path
        d="M44 14c-6 0-11 4-13 9-3-2-8-3-13-1 3 1 6 3 8 6-8 1-15 5-20 11 7-2 13-2 19 0-3 3-5 7-5 12 4-4 9-7 14-8 1 4 4 7 8 8-1-4 0-8 2-11 5 1 10 0 14-3-3 0-6-1-8-3 4-3 7-7 8-12-3 2-6 3-9 3 0-5-2-9-5-11z"
        fill="currentColor"
      />
    </svg>
  );
}
