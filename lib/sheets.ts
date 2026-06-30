import type { ApplyFormData, ContactFormData } from "./schema";
import { calculateQuote, formatCurrency } from "./pricing";

function getWebhookUrl() {
  return process.env.SHEETS_WEBHOOK_URL ?? null;
}

// Google Apps Script: POST to /exec runs the script and returns a 302 to an
// echo URL. The script already ran — GET the echo URL just to confirm {ok:true}.
async function postToScript(url: string, payload: object): Promise<void> {
  const body = JSON.stringify(payload);
  const headers = { "Content-Type": "application/json" };

  const res = await fetch(url, { method: "POST", headers, body, redirect: "manual" });

  if (res.status >= 300 && res.status < 400) {
    // Script already executed. GET the echo URL to read the response.
    const location = res.headers.get("location");
    if (location) {
      const echo = await fetch(location, { method: "GET" });
      const text = await echo.text().catch(() => "");
      if (text.includes('"ok":false')) {
        throw new Error(`Script returned error: ${text.slice(0, 200)}`);
      }
    }
    return;
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Script webhook ${res.status}: ${text.slice(0, 200)}`);
  }
}

export async function appendLeadToSheet(
  data: ApplyFormData,
  meta: { referer: string; landingPage: string },
): Promise<void> {
  const url = getWebhookUrl();
  if (!url) return;

  const quote = calculateQuote({ locations: data.locations, featuredLocations: data.featuredLocations });
  const cardLast4 = data.cardNumber.replace(/\s/g, "").slice(-4);

  const payload = {
    type: "application",
    timestamp: new Date().toLocaleString("en-US", { timeZone: "America/New_York" }),
    practiceName: data.companyName,
    website: data.website ?? "",
    companyPhone: data.companyPhone,
    cities: data.locations.map((l) => `${l.city}, ${l.state}`).join("; "),
    featuredCities: data.featuredLocations.map((k) => k.replace("|", ", ")).join("; ") || "None",
    specialties: (data.specialties ?? []).join(", ") || "None",
    keyStaff: (data.executives ?? []).map((e) => `${e.name}${e.title ? ` (${e.title})` : ""}`).join("; ") || "None",
    contactName: `${data.contactFirstName} ${data.contactLastName}`,
    email: data.email,
    contactPhone: data.contactPhone,
    title: data.contactTitle ?? "",
    awardShipping: `${data.plaqueShippingAddress}, ${data.plaqueShippingCity}, ${data.plaqueShippingState} ${data.plaqueShippingZip}`,
    cardLast4: `****${cardLast4}`,
    cardExpiry: data.cardExpiry,
    nameOnCard: data.cardName,
    billingAddress: `${data.billingAddress}, ${data.billingCity}, ${data.billingState} ${data.billingZip}`,
    quoteTotal: formatCurrency(quote.total),
    trafficSource: meta.referer || "direct",
    landingPage: meta.landingPage || "/apply",
    notes: data.notes ?? "",
    assetPermission: data.assetPermission === "grant" ? "Granted" : "Contact us",
  };

  await postToScript(url, payload);
}

export async function appendContactToSheet(
  data: ContactFormData,
  meta: { referer: string; landingPage: string },
): Promise<void> {
  const url = getWebhookUrl();
  if (!url) return;

  const payload = {
    type: "contact",
    timestamp: new Date().toLocaleString("en-US", { timeZone: "America/New_York" }),
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phone: data.phone ?? "",
    message: data.message,
    trafficSource: meta.referer || "direct",
    landingPage: meta.landingPage || "/contact",
  };

  await postToScript(url, payload);
}
