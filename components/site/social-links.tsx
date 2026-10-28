import { FacebookIcon, InstagramIcon, TiktokIcon, WhatsappIcon, YoutubeIcon } from "./brand-icons";
import type { SiteSettings } from "@/lib/content/types";
import { cn } from "@/lib/utils";

export function SocialLinks({ social, label, className, dark = false }: { social: SiteSettings["social"]; label: string; className?: string; dark?: boolean }) {
  const items = [
    { key: "facebook", href: social.facebook, Icon: FacebookIcon, name: "Facebook" },
    { key: "instagram", href: social.instagram, Icon: InstagramIcon, name: "Instagram" },
    { key: "youtube", href: social.youtube, Icon: YoutubeIcon, name: "YouTube" },
    { key: "tiktok", href: social.tiktok, Icon: TiktokIcon, name: "TikTok" },
    { key: "whatsapp", href: social.whatsapp, Icon: WhatsappIcon, name: "WhatsApp" },
  ].filter((i) => i.href);
  if (items.length === 0) return null;
  return (
    <div className={cn("flex items-center gap-2", className)} aria-label={label}>
      {items.map(({ key, href, Icon, name }) => (
        <a
          key={key}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={name}
          className={cn(
            "inline-flex h-10 w-10 items-center justify-center rounded-full border transition",
            dark ? "border-navy-800/20 text-navy-800 hover:bg-navy-50" : "border-white/20 text-white/80 hover:bg-white/10 hover:text-white",
          )}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </a>
      ))}
    </div>
  );
}
