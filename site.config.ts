export interface NavLink {
  href: string;
  label: string;
}

export const siteConfig = {
  // Identity
  name: "TopRespiratoryTherapists.com",
  shortName: "TopRespiratoryTherapists",
  legalEntity: "TopRespiratoryTherapists.com",
  domain: "toprespiratorytherapists.com",
  url: "https://toprespiratorytherapists.com",
  launchYear: 2026,

  // Wordmark
  wordmark: { top: "TOP RESPIRATORY", bottom: "THERAPISTS", tld: ".com" },

  // SEO / social
  title: "TopRespiratoryTherapists.com — Get Your Practice Listed",
  description:
    "TopRespiratoryTherapists.com is a national directory connecting patients, families, and referring physicians with trusted respiratory therapists and respiratory care practices. Claim an enhanced listing to reach patients actively searching for pulmonary rehabilitation, COPD management, asthma care, and more.",
  ogDescription:
    "Get an enhanced listing on TopRespiratoryTherapists.com — help patients and referring physicians find your respiratory care practice when they're searching for pulmonary rehabilitation, COPD management, ventilator support, and home respiratory services.",

  // Contact
  phone: "(866) 780-9092",
  phoneHref: "tel:+18667809092",
  salesEmail: "info@toprespiratorytherapists.com",

  // Analytics
  gaMeasurementId: "G-XXXXXXXXXX",

  // Lead notification email
  notifications: {
    fromEmail: "listings@toprespiratorytherapists.com",
    fromName: "TopRespiratoryTherapists.com",
    replyTo: "sbansal@brianmarketinggroup.com",
    testEmail: "sbansal@brianmarketinggroup.com",
    recipients: [
      "sbansal@brianmarketinggroup.com",
    ],
  },

  // Traffic-source attribution cookie name
  trafficCookie: "trt_source",

  // Directory preview config
  directory: {
    subtext:
      "Every listing includes a ranked directory placement, a dedicated practice profile, and an optional Featured Listing upgrade. Switch between the views below.",
    browse: "Houston, TX",
    filter: "All Specialties",
    cta: "List Your Practice",
    headline: "Find Top Respiratory Therapists",
    listHeading: "Top Respiratory Therapists — Houston, TX",
    spotName: "Featured Listing",
    spotScope: "1 per city",
    servicesLabel: "Respiratory Specialties",
    teamLabel: "About the Practice",
    noun: "respiratory practice",
    recognition: "Listed 2026",
    launch: "August 2026",
    toggles: { spotlight: "Featured", profile: "Profile", directory: "Directory" },
    directorySlug: "houston-tx",
    profileSlug: "houston-pulmonary-respiratory-care",
  },

  // Navigation
  nav: [
    { href: "/about", label: "About" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/#pricing", label: "Pricing" },
    { href: "/contact", label: "Contact" },
  ] as NavLink[],

  footer: {
    company: [
      { href: "/about", label: "About Us" },
      { href: "/how-it-works", label: "How It Works" },
      { href: "/contact", label: "Contact" },
    ] as NavLink[],
    forShops: [
      { href: "/apply", label: "List Your Practice" },
      { href: "/how-it-works", label: "Why Get Listed" },
      { href: "/#pricing", label: "Pricing" },
    ] as NavLink[],
  },
} as const;

export type SiteConfig = typeof siteConfig;
