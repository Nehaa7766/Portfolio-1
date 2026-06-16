export type ContactType = "email" | "phone" | "linkedin" | "github" | "location";

export interface ContactMethod {
  type: ContactType;
  label: string;
  value: string;
  /** Optional link target (opened in a new tab). */
  href?: string;
}

export const CONTACT_INTRO =
  "I'm always open to discussing new opportunities, collaborations, or just having a tech chat.";

export const CONTACT_METHODS: ContactMethod[] = [
  {
    type: "email",
    label: "Email",
    value: "neha.shinde@example.com",
    href: "mailto:neha.shinde@example.com",
  },
  {
    type: "phone",
    label: "Phone",
    value: "+91 98765 43210",
    href: "tel:+919876543210",
  },
  {
    type: "linkedin",
    label: "LinkedIn",
    value: "linkedin.com/in/neha-shinde",
    href: "https://linkedin.com/in/neha-shinde",
  },
  {
    type: "github",
    label: "GitHub",
    value: "github.com/NehaShinde",
    href: "https://github.com/NehaShinde",
  },
  {
    type: "location",
    label: "Location",
    value: "Pune, Maharashtra, India",
  },
];

export const AVAILABILITY = {
  status: "Open to Work",
  note: "Available for exciting opportunities and collaborations.",
};

export const CONTACT_QUOTE = "Let's build something amazing together!";
