import type { L } from "@/lib/i18n/config";

export type ServiceTime = {
  id: string;
  type: "worship" | "prayer" | "bible";
  label: L;
  day: L;
  time: string;
  location: L;
  online: boolean;
  link?: string;
};

export type GalleryImage = { url: string; caption: L };

export type Fund = { id: string; name: L; description: L };

export type SiteSettings = {
  churchName: string;
  legalName: string;
  tagline: L;
  address: { line1: string; line2: string; city: string; state: string; zip: string };
  mapsQuery: string;
  phone: string;
  whatsapp: string;
  email: string;
  emails: { general: string; prayer: string; assistance: string; sponsorship: string; volunteer: string };
  social: { facebook: string; instagram: string; youtube: string; tiktok: string; whatsapp: string };
  youtubeChannelUrl: string;
  youtubeLiveEmbedId: string;
  livestreamUrl: string;
  zoomUrl: string;
  zoomNote: L;
  serviceTimes: ServiceTime[];
  heroImage: string;
  heroVideoUrl: string;
  welcomeMessage: L;
  mission: L;
  vision: L;
  history: L;
  beliefs: { title: L; text: L }[];
  parking: L;
  whatToExpect: L;
  officeHours: L;
  givingExplanation: L;
  funds: Fund[];
  otherWaysToGive: L;
  letterOfNeed: { title: L; body: L; signatory: string; signatoryTitle: L; date: string };
  letterOfNeedPdfUrl: string;
  currentNeeds: { title: L; text: L }[];
  futureFacility: L;
  corporateSponsorship: L;
  whoWeServe: L;
  waysToContribute: L;
  privacyPolicy: L;
  privacyUpdated: string;
  impactUpdated: string;
  gallery: GalleryImage[];
  outreachGallery: GalleryImage[];
};

export type BaseItem = { id: string; sort: number; published: boolean };

export type EventItem = BaseItem & {
  slug: string;
  title: L;
  description: L;
  startsAt: string; // ISO datetime
  endsAt: string;
  location: L;
  online: boolean;
  link: string;
  image: string;
  category: "service" | "conference" | "outreach" | "youth" | "other";
  registration: boolean;
  featured: boolean;
};

export type AnnouncementItem = BaseItem & { title: L; text: L; link: string; date: string };

export type MinistryItem = BaseItem & {
  slug: string;
  name: L;
  summary: L;
  description: L;
  activities: L;
  schedule: L;
  leader: string;
  contactEmail: string;
  image: string;
  gallery: string;
  registration: boolean;
};

export type ProjectItem = BaseItem & {
  slug: string;
  title: L;
  description: L;
  needs: L;
  image: string;
  goalCents: number;
  raisedCents: number;
  fundId: string;
  active: boolean;
};

export type ImpactStat = BaseItem & { label: L; value: string; icon: "families" | "events" | "volunteers" | "supplies" | "meals" | "prayer" };

export type TestimonialItem = BaseItem & { name: string; quote: L; context: L; image: string };

export type StoryItem = BaseItem & { title: L; text: L; image: string; date: string };

export type LeaderItem = BaseItem & { name: string; role: L; bio: L; image: string };

export type MediaItem = BaseItem & {
  title: L;
  youtubeId: string;
  category: "sermon" | "live" | "teaching" | "inspirational";
  date: string;
  description: L;
};

export type Collections = {
  events: EventItem;
  announcements: AnnouncementItem;
  ministries: MinistryItem;
  projects: ProjectItem;
  impactStats: ImpactStat;
  testimonials: TestimonialItem;
  stories: StoryItem;
  leadership: LeaderItem;
  media: MediaItem;
};

export type CollectionName = keyof Collections;
export const collectionNames = [
  "events",
  "announcements",
  "ministries",
  "projects",
  "impactStats",
  "testimonials",
  "stories",
  "leadership",
  "media",
] as const satisfies readonly CollectionName[];

export function isCollectionName(value: string): value is CollectionName {
  return (collectionNames as readonly string[]).includes(value);
}
