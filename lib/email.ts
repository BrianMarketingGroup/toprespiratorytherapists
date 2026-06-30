import sgMail from "@sendgrid/mail";
import type { ApplyFormData, ContactFormData } from "./schema";
import { calculateQuote, formatCurrency } from "./pricing";
import { siteConfig } from "@/site.config";

const {
  fromEmail: FROM_EMAIL,
  fromName: FROM_NAME,
  replyTo: REPLY_TO,
  testEmail: TEST_EMAIL,
  recipients: NOTIFICATION_EMAILS,
} = siteConfig.notifications;

function recipients(submitterEmail: string): string[] {
  return submitterEmail.toLowerCase() === TEST_EMAIL.toLowerCase()
    ? [TEST_EMAIL]
    : [...NOTIFICATION_EMAILS];
}

function isConfigured(): boolean {
  return Boolean(process.env.SENDGRID_API_KEY);
}

function init() {
  if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }
}

export async function sendLeadEmail(
  data: ApplyFormData,
  meta: { referer: string; landingPage: string },
): Promise<void> {
  if (!isConfigured()) {
    console.log("[email] Skipping — SendGrid not configured.", { companyName: data.companyName });
    return;
  }
  init();

  const quote = calculateQuote({ locations: data.locations, featuredLocations: data.featuredLocations });
  const divider = "─".repeat(52);

  const crewText = (data.executives ?? []).length > 0
    ? (data.executives ?? []).map((e) => `  • ${e.name}${e.title ? ` — ${e.title}` : ""}${e.description ? `\n    ${e.description}` : ""}`).join("\n")
    : "  None provided";

  const text = `
New listing application received on ${siteConfig.name}

SOURCE
Traffic Source:  ${meta.referer || "direct"}
Landing Page:    ${meta.landingPage || "/apply"}
Submitted:       ${new Date().toLocaleString("en-US", { timeZone: "America/New_York" })} ET

PRACTICE
Practice Name:   ${data.companyName}
Website:         ${data.website || "—"}
Phone:           ${data.companyPhone}
Asset Permission: ${data.assetPermission === "grant" ? "Granted — pull from website" : "Requested — contact them"}

THERAPISTS & KEY STAFF
${crewText}

CITIES (${data.locations.length})
${data.locations.map((l) => `  ${l.city}, ${l.state}`).join("\n")}

FEATURED LISTING (${data.featuredLocations.length} of ${data.locations.length} cities)
${data.featuredLocations.length > 0 ? data.featuredLocations.map((k) => `  ★ ${k.replace("|", ", ")}`).join("\n") : "  None selected"}

SPECIALTIES & SERVICES
${(data.specialties ?? []).length > 0 ? (data.specialties ?? []).map((s) => `  • ${s}`).join("\n") : "  None selected"}

CONTACT
Name:   ${data.contactFirstName} ${data.contactLastName}${data.contactTitle ? ` (${data.contactTitle})` : ""}
Email:  ${data.email}
Phone:  ${data.contactPhone}

AWARD SHIPPING
${data.plaqueShippingAddress}
${data.plaqueShippingCity}, ${data.plaqueShippingState} ${data.plaqueShippingZip}

NOTES
${data.notes || "—"}

ITEMIZED QUOTE — 12-month term, pay once
${divider}
${quote.lineItems.map((li) => `${li.label}: ${formatCurrency(li.amount)}`).join("\n")}
${divider}
TOTAL:  ${formatCurrency(quote.total)}
${divider}
`.trim();

  await sgMail.send({
    to: recipients(data.email),
    from: { email: FROM_EMAIL, name: FROM_NAME },
    replyTo: { email: REPLY_TO, name: FROM_NAME },
    subject: `New Application: ${data.companyName} — ${data.locations[0]?.city ?? "?"}, ${data.locations[0]?.state ?? "?"}`,
    text,
  });
}

export async function sendContactEmail(
  data: ContactFormData,
  meta: { referer: string; landingPage: string },
): Promise<void> {
  if (!isConfigured()) {
    console.log("[email] Skipping — SendGrid not configured.", { email: data.email });
    return;
  }
  init();

  const text = `
New inquiry from ${siteConfig.name}

SOURCE
Traffic Source:  ${meta.referer || "direct"}
Landing Page:    ${meta.landingPage || "/contact"}
Submitted:       ${new Date().toLocaleString("en-US", { timeZone: "America/New_York" })} ET

CONTACT
Name:    ${data.firstName} ${data.lastName}
Email:   ${data.email}
Phone:   ${data.phone || "—"}

Message:
${data.message}
`.trim();

  await sgMail.send({
    to: recipients(data.email),
    from: { email: FROM_EMAIL, name: FROM_NAME },
    replyTo: { email: REPLY_TO, name: FROM_NAME },
    subject: `Contact Inquiry: ${data.firstName} ${data.lastName}`,
    text,
  });
}
