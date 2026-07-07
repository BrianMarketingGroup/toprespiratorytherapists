import type { Metadata } from "next";
import CheckoutWizard from "@/components/checkout/CheckoutWizard";
import { topRespiratoryTherapistsConfig } from "@/lib/config";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = {
  title: `List Your Practice — ${siteConfig.name}`,
  description: `Apply to list your respiratory therapy practice on ${siteConfig.name} and reach patients and referring physicians searching for pulmonary rehabilitation, COPD management, asthma care, and more in your city.`,
};

export default function ApplyPage() {
  return <CheckoutWizard config={topRespiratoryTherapistsConfig} />;
}
