import type { ApplyFormData } from "@/lib/schema";
import type { SiteConfig } from "@/lib/config";
import type { SelectedMarket } from "@/lib/checkoutMarkets";
import { locationKey } from "@/lib/pricing";
import type {
  ContactInfo,
  PlaqueShippingAddress,
  PaymentInfo,
  ListingInfo,
} from "@/lib/store/checkoutStore";

/**
 * Maps the checkout wizard's store state into toprespiratorytherapists'
 * existing ApplyFormData shape, so it can be POSTed straight to the existing
 * /api/apply route (which already validates against applySchema and calls
 * the BFF via lib/bff.ts — this function does not talk to the BFF directly).
 */
export function buildApplyPayload(params: {
  config: SiteConfig;
  selectedMarkets: SelectedMarket[];
  specialtyIds: string[];
  contact: ContactInfo;
  plaqueShipping: PlaqueShippingAddress | null;
  payment: PaymentInfo;
  listingChoice: "now" | "later";
  listingInfo: ListingInfo | null;
}): ApplyFormData {
  const specialtyOptions = params.config.specialty?.options ?? [];
  const specialtyLabels = specialtyOptions
    .filter((o) => params.specialtyIds.includes(o.id))
    .map((o) => o.label);

  const featuredLocations = params.selectedMarkets
    .filter((m) => m.featured)
    .map((m) => locationKey(m));

  return {
    type: "apply",
    companyName: params.listingInfo?.businessName || params.contact.company,
    website: params.listingInfo?.website ?? "",
    companyPhone: params.listingInfo?.listingPhone || params.contact.phone,
    executives: params.listingInfo?.people
      ? params.listingInfo.people.split(",").map((name) => ({ name: name.trim() }))
      : [],
    assetPermission: (params.listingInfo?.assetPermission ?? true) ? "grant" : "support",

    contactFirstName: params.contact.firstName,
    contactLastName: params.contact.lastName,
    email: params.contact.email,
    contactPhone: params.contact.phone,
    contactTitle: params.contact.title,
    plaqueShippingAddress: params.plaqueShipping?.street ?? "",
    plaqueShippingCity: params.plaqueShipping?.city ?? "",
    plaqueShippingState: params.plaqueShipping?.state ?? "",
    plaqueShippingZip: params.plaqueShipping?.zip ?? "",
    notes: params.contact.notes,

    locations: params.selectedMarkets.map((m) => ({ city: m.city, state: m.state })),
    featuredLocations,
    specialties: specialtyLabels,

    cardNumber: params.payment.cardNumber,
    cardExpiry: params.payment.expiry,
    cardCvc: params.payment.cvv,
    cardName: params.payment.cardholderName,
    billingAddress: params.payment.billingAddress,
    billingCity: params.payment.billingCity,
    billingState: params.payment.billingState,
    billingZip: params.payment.billingZip,
    consentToTerms: true,
  };
}
