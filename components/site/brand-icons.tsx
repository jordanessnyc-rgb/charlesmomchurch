import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;
const base = (props: P) => ({ viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": true, ...props });

export function FacebookIcon(props: P) {
  return (
    <svg {...base(props)}>
      <path d="M13.5 21v-7h2.4l.4-3h-2.8V9.2c0-.9.3-1.5 1.5-1.5h1.4V5.1c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8V11H8v3h2.5v7h3z" />
    </svg>
  );
}
export function InstagramIcon(props: P) {
  return (
    <svg {...base(props)} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
export function YoutubeIcon(props: P) {
  return (
    <svg {...base(props)}>
      <path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8zM10 15V9l5.2 3L10 15z" />
    </svg>
  );
}
export function TiktokIcon(props: P) {
  return (
    <svg {...base(props)}>
      <path d="M16.5 3c.3 1.9 1.5 3.3 3.5 3.6v3c-1.3 0-2.5-.4-3.5-1.1v6.3A5.2 5.2 0 1 1 11.3 9.6v3.1a2.2 2.2 0 1 0 2.2 2.1V3h3z" />
    </svg>
  );
}
export function WhatsappIcon(props: P) {
  return (
    <svg {...base(props)}>
      <path d="M12 2.5a9.5 9.5 0 0 0-8.2 14.3L2.5 21.5l4.8-1.3A9.5 9.5 0 1 0 12 2.5zm0 17.3a7.8 7.8 0 0 1-4-1.1l-.3-.2-2.8.8.8-2.7-.2-.3A7.8 7.8 0 1 1 12 19.8zm4.3-5.8c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1l-.8.9c-.1.2-.3.2-.5.1a6.4 6.4 0 0 1-3.2-2.8c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.7-1.7c-.2-.5-.4-.4-.5-.4h-.5a.9.9 0 0 0-.7.3 2.8 2.8 0 0 0-.9 2.1 4.9 4.9 0 0 0 1 2.6 11 11 0 0 0 4.3 3.8c1.6.7 2.2.7 3 .6a2.6 2.6 0 0 0 1.7-1.2c.2-.6.2-1.1.2-1.2l-.5-.3z" />
    </svg>
  );
}
