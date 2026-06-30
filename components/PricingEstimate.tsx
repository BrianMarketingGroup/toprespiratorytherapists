"use client";

import { calculateQuote, formatCurrency } from "@/lib/pricing";

interface PricingEstimateProps {
  locations: { city: string; state: string }[];
  featuredLocations: string[];
}

export default function PricingEstimate({ locations, featuredLocations }: PricingEstimateProps) {
  const validLocations = locations.filter((l) => l.city && l.state);
  const quote = calculateQuote({ locations: validLocations, featuredLocations });

  if (validLocations.length === 0) return null;

  return (
    <div className="rounded-xl border border-gold/30 bg-navy-dark p-5">
      <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-gold-light mb-3">
        Your Quote
      </p>
      <ul className="space-y-1.5 mb-3">
        {quote.lineItems.map((li) => (
          <li key={li.label} className="flex justify-between text-sm text-pearl/90">
            <span>{li.label}</span>
            <span className="font-semibold tabular-nums text-teal-light">{formatCurrency(li.amount)}</span>
          </li>
        ))}
      </ul>
      <div className="h-px waterline" />
      <div className="pt-3 flex justify-between items-baseline">
        <span className="text-sm font-semibold text-pearl">Total</span>
        <span className="race-head text-2xl font-light tabular-nums text-gold-light">
          {formatCurrency(quote.total)}
        </span>
      </div>
      <p className="text-xs text-pearl/65 mt-2">
        One-time annual fee — pay once. 12-month term from listing activation.
      </p>
    </div>
  );
}
