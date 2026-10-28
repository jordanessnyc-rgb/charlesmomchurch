import type { CollectionName } from "@/lib/content/types";

export type FieldType = "text" | "textarea" | "bilingual" | "bilingual-textarea" | "date" | "datetime" | "url" | "image" | "bool" | "number" | "select" | "email" | "slug" | "list";

export type Field = {
  key: string;
  label: string;
  type: FieldType;
  hint?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  /** For type "list": the fields of each row. */
  fields?: Field[];
  /** For type "number": display/edit as dollars, store as cents. */
  money?: boolean;
};

export type CollectionSchema = { label: string; singular: string; description: string; titleKey: string; fields: Field[]; hasSlug?: boolean };

const image = (key = "image", label = "Photo"): Field => ({ key, label, type: "image", hint: "Upload a photo or paste an image URL." });

export const collectionSchemas: Record<CollectionName, CollectionSchema> = {
  events: {
    label: "Events",
    singular: "Event",
    description: "Services, conferences, outreach days and special gatherings shown on the Events page and homepage.",
    titleKey: "title",
    hasSlug: true,
    fields: [
      { key: "title", label: "Title", type: "bilingual", required: true },
      { key: "slug", label: "URL slug", type: "slug", hint: "Lowercase letters and dashes. Example: night-of-worship" },
      { key: "description", label: "Description", type: "bilingual-textarea", required: true },
      { key: "startsAt", label: "Starts", type: "datetime", required: true },
      { key: "endsAt", label: "Ends", type: "datetime" },
      { key: "location", label: "Location", type: "bilingual" },
      { key: "online", label: "Also available online (Zoom / livestream)", type: "bool" },
      { key: "link", label: "Online link", type: "url", hint: "Zoom or livestream link for this event. Leave empty to use the default from Settings." },
      {
        key: "category",
        label: "Category",
        type: "select",
        options: [
          { value: "service", label: "Special service" },
          { value: "conference", label: "Conference" },
          { value: "outreach", label: "Outreach" },
          { value: "youth", label: "Youth" },
          { value: "other", label: "Other" },
        ],
      },
      { key: "registration", label: "Enable online registration", type: "bool" },
      { key: "featured", label: "Featured on homepage", type: "bool" },
      image(),
    ],
  },
  announcements: {
    label: "Announcements",
    singular: "Announcement",
    description: "Short notices shown on the homepage.",
    titleKey: "title",
    fields: [
      { key: "title", label: "Title", type: "bilingual", required: true },
      { key: "text", label: "Text", type: "bilingual-textarea", required: true },
      { key: "date", label: "Date", type: "date" },
      { key: "link", label: "Link", type: "text", hint: "Optional. A site path like /events or a full URL." },
    ],
  },
  ministries: {
    label: "Ministries",
    singular: "Ministry",
    description: "Each ministry gets its own page with description, photos, schedule and a sign-up form.",
    titleKey: "name",
    hasSlug: true,
    fields: [
      { key: "name", label: "Name", type: "bilingual", required: true },
      { key: "slug", label: "URL slug", type: "slug" },
      { key: "summary", label: "Short summary", type: "bilingual", required: true },
      { key: "description", label: "Description", type: "bilingual-textarea", required: true },
      { key: "activities", label: "Activities (comma-separated)", type: "bilingual" },
      { key: "schedule", label: "When we meet", type: "bilingual" },
      { key: "leader", label: "Leader name", type: "text" },
      { key: "contactEmail", label: "Contact email", type: "email" },
      image(),
      { key: "gallery", label: "Gallery image URLs", type: "textarea", hint: "One image URL per line." },
      { key: "registration", label: "Show the join / registration form", type: "bool" },
    ],
  },
  projects: {
    label: "Charity projects",
    singular: "Project",
    description: "Current charitable projects shown under Love in Action and Sponsorship.",
    titleKey: "title",
    hasSlug: true,
    fields: [
      { key: "title", label: "Title", type: "bilingual", required: true },
      { key: "slug", label: "URL slug", type: "slug" },
      { key: "description", label: "Description", type: "bilingual-textarea", required: true },
      { key: "needs", label: "What this project needs", type: "bilingual-textarea" },
      image(),
      { key: "goalCents", label: "Fundraising goal (USD)", type: "number", money: true, hint: "Leave 0 to hide the progress bar." },
      { key: "raisedCents", label: "Amount raised so far (USD)", type: "number", money: true },
      { key: "fundId", label: "Donation fund", type: "text", hint: "Fund id from Settings → Giving (e.g. outreach, building)." },
      { key: "active", label: "Active", type: "bool" },
    ],
  },
  impactStats: {
    label: "Impact numbers",
    singular: "Stat",
    description: "The headline numbers on the Impact page and homepage. Update them as outreach grows.",
    titleKey: "label",
    fields: [
      { key: "label", label: "Label", type: "bilingual", required: true },
      { key: "value", label: "Value", type: "text", required: true, hint: "Free text, e.g. 250+ or 1,200" },
      {
        key: "icon",
        label: "Icon",
        type: "select",
        options: [
          { value: "families", label: "Families" },
          { value: "events", label: "Events" },
          { value: "volunteers", label: "Volunteers" },
          { value: "supplies", label: "Supplies / boxes" },
          { value: "meals", label: "Meals" },
          { value: "prayer", label: "Prayer" },
        ],
      },
    ],
  },
  testimonials: {
    label: "Testimonials",
    singular: "Testimonial",
    description: "Authorized testimonials shown on Impact and Love in Action. Only publish with permission.",
    titleKey: "name",
    fields: [
      { key: "name", label: "Name (first name only is fine)", type: "text", required: true },
      { key: "quote", label: "Quote", type: "bilingual-textarea", required: true },
      { key: "context", label: "Context (e.g. Mother of three)", type: "bilingual" },
      image(),
    ],
  },
  stories: {
    label: "Stories of impact",
    singular: "Story",
    description: "Longer stories about outreach work.",
    titleKey: "title",
    fields: [
      { key: "title", label: "Title", type: "bilingual", required: true },
      { key: "text", label: "Story", type: "bilingual-textarea", required: true },
      { key: "date", label: "Date", type: "date" },
      image(),
    ],
  },
  leadership: {
    label: "Leadership",
    singular: "Leader",
    description: "Pastoral leadership shown on the About page.",
    titleKey: "name",
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "role", label: "Role", type: "bilingual", required: true },
      { key: "bio", label: "Bio", type: "bilingual-textarea" },
      image(),
    ],
  },
  media: {
    label: "Videos",
    singular: "Video",
    description: "YouTube videos for the Sermons & Media page.",
    titleKey: "title",
    fields: [
      { key: "title", label: "Title", type: "bilingual", required: true },
      { key: "youtubeId", label: "YouTube video ID or URL", type: "text", required: true, hint: "Paste the full YouTube link; the ID is extracted automatically." },
      {
        key: "category",
        label: "Category",
        type: "select",
        options: [
          { value: "sermon", label: "Recorded sermon" },
          { value: "live", label: "Live service" },
          { value: "teaching", label: "Bible teaching" },
          { value: "inspirational", label: "Inspirational" },
        ],
      },
      { key: "date", label: "Date", type: "date" },
      { key: "description", label: "Description", type: "bilingual-textarea" },
    ],
  },
};

/** Settings are edited in groups; each group is a list of fields on the SiteSettings object. */
export const settingsGroups: { key: string; label: string; description: string; fields: Field[] }[] = [
  {
    key: "identity",
    label: "Church identity",
    description: "Names and the welcome text shown on the homepage.",
    fields: [
      { key: "churchName", label: "Short name", type: "text", required: true },
      { key: "legalName", label: "Full / legal name", type: "text", required: true },
      { key: "tagline", label: "Tagline", type: "bilingual" },
      { key: "welcomeMessage", label: "Welcome message (homepage)", type: "bilingual-textarea" },
      { key: "heroImage", label: "Homepage hero photo", type: "image", hint: "Shown instead of the logo on the homepage when set." },
      { key: "heroVideoUrl", label: "Homepage video (YouTube URL)", type: "url" },
    ],
  },
  {
    key: "contact",
    label: "Contact & location",
    description: "Address, phone, email and the inboxes that receive each form.",
    fields: [
      { key: "address.line1", label: "Street address", type: "text" },
      { key: "address.line2", label: "Address line 2", type: "text" },
      { key: "address.city", label: "City", type: "text" },
      { key: "address.state", label: "State", type: "text" },
      { key: "address.zip", label: "ZIP", type: "text" },
      { key: "mapsQuery", label: "Google Maps search text", type: "text", hint: "Used for the map when the street address is empty." },
      { key: "phone", label: "Phone", type: "text" },
      { key: "whatsapp", label: "WhatsApp number", type: "text" },
      { key: "email", label: "Main email (public)", type: "email" },
      { key: "officeHours", label: "Office hours", type: "bilingual" },
      { key: "emails.general", label: "Inbox: general contact & visitors", type: "email", hint: "Where contact, visitor and event registrations are sent. Falls back to the main email." },
      { key: "emails.prayer", label: "Inbox: prayer team", type: "email" },
      { key: "emails.assistance", label: "Inbox: assistance / care team", type: "email" },
      { key: "emails.sponsorship", label: "Inbox: sponsorship & donations", type: "email" },
      { key: "emails.volunteer", label: "Inbox: volunteers & ministries", type: "email" },
    ],
  },
  {
    key: "online",
    label: "Social & online",
    description: "Social profiles, YouTube, livestream and Zoom links.",
    fields: [
      { key: "social.facebook", label: "Facebook URL", type: "url" },
      { key: "social.instagram", label: "Instagram URL", type: "url" },
      { key: "social.youtube", label: "YouTube URL", type: "url" },
      { key: "social.tiktok", label: "TikTok URL", type: "url" },
      { key: "social.whatsapp", label: "WhatsApp community link", type: "url" },
      { key: "youtubeChannelUrl", label: "YouTube channel URL", type: "url" },
      { key: "youtubeLiveEmbedId", label: "YouTube live video ID", type: "text", hint: "The ID of your live/stream video to embed on the Media page." },
      { key: "livestreamUrl", label: "Livestream link", type: "url" },
      { key: "zoomUrl", label: "Zoom link for online prayer", type: "url" },
      { key: "zoomNote", label: "Note about online meetings", type: "bilingual-textarea" },
    ],
  },
  {
    key: "services",
    label: "Service times",
    description: "Weekly worship, online prayer and Bible study schedule.",
    fields: [
      {
        key: "serviceTimes",
        label: "Schedule",
        type: "list",
        fields: [
          { key: "id", label: "Id", type: "slug" },
          {
            key: "type",
            label: "Type",
            type: "select",
            options: [
              { value: "worship", label: "Worship service" },
              { value: "prayer", label: "Online prayer" },
              { value: "bible", label: "Bible study / discipleship" },
            ],
          },
          { key: "label", label: "Name", type: "bilingual" },
          { key: "day", label: "Day", type: "bilingual" },
          { key: "time", label: "Time", type: "text" },
          { key: "location", label: "Location", type: "bilingual" },
          { key: "online", label: "Online", type: "bool" },
          { key: "link", label: "Link (optional)", type: "url" },
        ],
      },
    ],
  },
  {
    key: "about",
    label: "About us",
    description: "History, mission, vision and beliefs.",
    fields: [
      { key: "mission", label: "Mission", type: "bilingual-textarea" },
      { key: "vision", label: "Vision", type: "bilingual-textarea" },
      { key: "history", label: "History", type: "bilingual-textarea", hint: "Separate paragraphs with a blank line." },
      {
        key: "beliefs",
        label: "Beliefs & values",
        type: "list",
        fields: [
          { key: "title", label: "Title", type: "bilingual" },
          { key: "text", label: "Text", type: "bilingual-textarea" },
        ],
      },
    ],
  },
  {
    key: "visit",
    label: "Plan your visit",
    description: "Parking and what to expect.",
    fields: [
      { key: "parking", label: "Parking", type: "bilingual-textarea" },
      { key: "whatToExpect", label: "What to expect", type: "bilingual-textarea" },
    ],
  },
  {
    key: "giving",
    label: "Giving",
    description: "Funds people can give to and how donations are used.",
    fields: [
      { key: "givingExplanation", label: "How donations are used", type: "bilingual-textarea" },
      { key: "otherWaysToGive", label: "Other ways to give", type: "bilingual-textarea" },
      {
        key: "funds",
        label: "Funds",
        type: "list",
        fields: [
          { key: "id", label: "Id", type: "slug" },
          { key: "name", label: "Name", type: "bilingual" },
          { key: "description", label: "Description", type: "bilingual" },
        ],
      },
    ],
  },
  {
    key: "sponsorship",
    label: "Letter of Need & sponsorship",
    description: "Content of the downloadable letter and the sponsorship page.",
    fields: [
      { key: "letterOfNeed.title", label: "Letter title", type: "bilingual" },
      { key: "letterOfNeed.body", label: "Letter body", type: "bilingual-textarea", hint: "Separate paragraphs with a blank line." },
      { key: "letterOfNeed.signatory", label: "Signed by", type: "text" },
      { key: "letterOfNeed.signatoryTitle", label: "Signatory title", type: "bilingual" },
      { key: "letterOfNeed.date", label: "Letter date", type: "date", hint: "Leave empty to use today's date." },
      { key: "letterOfNeedPdfUrl", label: "Custom Letter of Need PDF URL", type: "url", hint: "If set, this file is downloaded instead of the generated letter." },
      {
        key: "currentNeeds",
        label: "Current needs",
        type: "list",
        fields: [
          { key: "title", label: "Title", type: "bilingual" },
          { key: "text", label: "Text", type: "bilingual" },
        ],
      },
      { key: "futureFacility", label: "Vision for a future facility", type: "bilingual-textarea" },
      { key: "corporateSponsorship", label: "Corporate sponsorship", type: "bilingual-textarea" },
    ],
  },
  {
    key: "outreach",
    label: "Love in Action",
    description: "Outreach page texts and photo galleries.",
    fields: [
      { key: "whoWeServe", label: "Who we serve", type: "bilingual-textarea" },
      { key: "waysToContribute", label: "Ways to contribute", type: "bilingual-textarea" },
      { key: "impactUpdated", label: "Impact numbers last updated", type: "date" },
      {
        key: "outreachGallery",
        label: "Outreach photos",
        type: "list",
        fields: [
          { key: "url", label: "Photo", type: "image" },
          { key: "caption", label: "Caption", type: "bilingual" },
        ],
      },
      {
        key: "gallery",
        label: "Church photos (homepage)",
        type: "list",
        fields: [
          { key: "url", label: "Photo", type: "image" },
          { key: "caption", label: "Caption", type: "bilingual" },
        ],
      },
    ],
  },
  {
    key: "privacy",
    label: "Privacy policy",
    description: "Shown at /privacy.",
    fields: [
      { key: "privacyUpdated", label: "Last updated", type: "date" },
      { key: "privacyPolicy", label: "Policy text", type: "bilingual-textarea", hint: "Use '## ' at the start of a line for a heading." },
    ],
  },
];
