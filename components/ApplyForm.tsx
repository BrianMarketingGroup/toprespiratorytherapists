"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect, useRef } from "react";
import { ChevronRight, ChevronLeft, Check, Plus, Trash2, Star } from "lucide-react";
import { applySchema, type ApplyFormData, SPECIALTIES } from "@/lib/schema";
import { PRICING, formatCurrency, calculateQuote, locationKey } from "@/lib/pricing";
import { FormField, Input, Textarea, Select } from "./FormField";
import CityCombobox from "./CityCombobox";
import { getTrafficSource } from "./TrafficSourceTracker";
import PricingEstimate from "./PricingEstimate";
import Button from "./Button";
import { US_STATES } from "@/content/states";

const STEPS = [
  { number: 1, label: "Practice" },
  { number: 2, label: "Contact" },
  { number: 3, label: "Cities" },
  { number: 4, label: "Billing" },
] as const;

const STEP_FIELDS: Record<number, (keyof ApplyFormData)[]> = {
  1: ["companyName", "companyPhone", "assetPermission", "executives"],
  2: ["contactFirstName", "contactLastName", "email", "contactPhone", "plaqueShippingAddress", "plaqueShippingCity", "plaqueShippingState", "plaqueShippingZip"],
  3: ["locations"],
  4: ["cardNumber", "cardExpiry", "cardCvc", "cardName", "billingAddress", "billingCity", "billingState", "billingZip", "consentToTerms"],
};

const formatPhone = (val: string) => {
  const digits = val.replace(/\D/g, "");
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
};

const formatCC = (val: string) => val.replace(/\D/g, "").replace(/(\d{4})(?=\d)/g, "$1 ");
const formatExpiry = (val: string) => {
  const d = val.replace(/\D/g, "");
  return d.length >= 3 ? `${d.slice(0, 2)}/${d.slice(2, 4)}` : d;
};

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-0 mb-10">
      {STEPS.map((step, i) => {
        const done = step.number < current;
        const active = step.number === current;
        return (
          <div key={step.number} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-bold transition-colors
                ${done ? "bg-teal border-teal text-white" : active ? "bg-navy border-navy text-white" : "bg-navy-light/20 border-pearl-dark text-muted"}`}>
                {done ? <Check className="h-4 w-4" /> : step.number}
              </div>
              <span className={`mt-1.5 text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap hidden sm:block
                ${active ? "text-navy" : done ? "text-teal" : "text-muted"}`}>
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 mt-[-14px] sm:mt-[-20px] transition-colors ${done ? "bg-teal" : "bg-pearl-dark"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function ApplyForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [step, setStep] = useState(1);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    trigger,
    setValue,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<ApplyFormData>({
    resolver: zodResolver(applySchema),
    defaultValues: {
      type: "apply",
      executives: [],
      locations: [{ city: "", state: "" }],
      featuredLocations: [],
      specialties: [],
      assetPermission: "grant" as const,
    },
    mode: "onTouched",
  });

  const watchedLocations = watch("locations");
  const watchedFeatured = watch("featuredLocations") ?? [];
  const watchedSpecialties = watch("specialties") ?? [];
  const validLocations = (watchedLocations ?? []).filter(l => l.city && l.state);

  const [takenCities, setTakenCities] = useState<string[]>([]);

  // Fetch the taken featured spots once when the form opens. Backed by the BFF
  // featured_claims API (with a Google-Sheets fallback) via /api/cities/availability.
  const [takenSet, setTakenSet] = useState<string[]>([]);
  // Trim + lowercase so taken-spot matching is robust to whitespace/casing on
  // either side (BFF/sheet values vs. the form's city/state).
  const normKey = (city: string, state: string) => `${city.trim()}|${state.trim()}`.toLowerCase();
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/cities/availability");
        const data = await res.json();
        const taken: { city: string; state: string }[] = data.taken ?? [];
        if (active) setTakenSet(taken.map(t => normKey(t.city, t.state)));
      } catch {
        // Fail open — never block the form on an availability check.
      }
    })();
    return () => { active = false; };
  }, []);

  const locationsKey = validLocations.map(locationKey).join(",");
  useEffect(() => {
    setTakenCities(
      validLocations.filter(loc => takenSet.includes(normKey(loc.city, loc.state))).map(locationKey),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationsKey, takenSet]);

  const userDeselectedRef = useRef(new Set<string>());

  // Cleanup + auto-select Featured: runs when locations change, not when featured is toggled
  useEffect(() => {
    const validKeys = validLocations.map(locationKey);
    const filtered = watchedFeatured.filter(k => validKeys.includes(k) && !takenCities.includes(k));
    if (filtered.length !== watchedFeatured.length) setValue("featuredLocations", filtered);
    // Auto-select Featured for new valid cities (unless user explicitly deselected them)
    const toAutoSelect = validKeys.filter(k =>
      !takenCities.includes(k) &&
      !watchedFeatured.includes(k) &&
      !userDeselectedRef.current.has(k)
    );
    if (toAutoSelect.length > 0) {
      setValue("featuredLocations", [...filtered, ...toAutoSelect]);
    }
    // Clean up deselected ref for cities that were removed
    const validKeySet = new Set(validKeys);
    userDeselectedRef.current = new Set([...userDeselectedRef.current].filter(k => validKeySet.has(k)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationsKey, takenCities, setValue]);

  function toggleFeatured(loc: { city: string; state: string }) {
    const key = locationKey(loc);
    if (watchedFeatured.includes(key)) {
      userDeselectedRef.current.add(key);
      setValue("featuredLocations", watchedFeatured.filter(k => k !== key));
    } else {
      userDeselectedRef.current.delete(key);
      setValue("featuredLocations", [...watchedFeatured, key]);
    }
  }

  function toggleSpecialty(s: string) {
    setValue("specialties",
      watchedSpecialties.includes(s) ? watchedSpecialties.filter(x => x !== s) : [...watchedSpecialties, s]
    );
  }

  const { fields: executiveFields, append: appendExecutive, remove: removeExecutive } = useFieldArray({ control, name: "executives" });
  const { fields: locationFields, append: appendLocation, remove: removeLocation } = useFieldArray({ control, name: "locations" });

  async function goNext() {
    const valid = await trigger(STEP_FIELDS[step]);
    if (valid) {
      const next = step + 1;
      clearErrors(STEP_FIELDS[next] as (keyof ApplyFormData)[]);
      setStep(next);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setTimeout(() => {
        const el = document.querySelector('[aria-invalid="true"]');
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 50);
    }
  }

  function goBack() {
    setStep(s => s - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function onSubmit(data: ApplyFormData) {
    setServerError(null);
    try {
      const payload = {
        ...data,
        featuredLocations: data.featuredLocations.filter(k => !takenCities.includes(k)),
      };
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-traffic-source": getTrafficSource(),
          "x-landing-page": window.location.pathname,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setServerError(body.error ?? "Something went wrong. Please try again.");
        return;
      }
      router.push("/apply/thanks");
    } catch {
      setServerError("Network error. Please check your connection and try again.");
    }
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      onKeyDown={(e) => {
        if (e.key === "Enter" && step < 4 && (e.target as HTMLElement).tagName !== "TEXTAREA") e.preventDefault();
      }}
    >
      <input type="text" aria-hidden tabIndex={-1} className="absolute opacity-0 h-0 w-0 pointer-events-none" {...register("_honeypot")} />

      <StepIndicator current={step} />

      {/* ── Step 1: Practice ── */}
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl text-navy mb-1 race-head">Respiratory Practice</h2>
            <p className="text-sm text-muted">Tell us about your respiratory therapy practice.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField label="Company Name" required error={errors.companyName?.message} className="sm:col-span-2">
              <Input {...register("companyName")} error={errors.companyName?.message} placeholder="e.g. Houston Pulmonary & Respiratory Care" />
            </FormField>

            <FormField label="Website" error={errors.website?.message} hint="Optional">
              <Input {...register("website")} type="url" placeholder="https://yourpractice.com" />
            </FormField>

            <FormField label="Company Phone" required error={errors.companyPhone?.message}>
              <Input
                {...register("companyPhone")}
                type="tel"
                placeholder="(555) 000-0000"
                error={errors.companyPhone?.message}
                onChange={(e) => { e.target.value = formatPhone(e.target.value); register("companyPhone").onChange(e); }}
              />
            </FormField>
          </div>

          {/* Therapists & Key Staff */}
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-navy">Therapists &amp; Key Staff</p>
              <p className="text-sm text-muted">Optional. Highlight the therapists and staff behind your practice, or skip and we&apos;ll collect these details later.</p>
            </div>
            {executiveFields.map((field, index) => (
              <div key={field.id} className="p-4 rounded-xl border border-pearl-dark bg-pearl relative">
                <button
                  type="button"
                  onClick={() => removeExecutive(index)}
                  className="absolute top-4 right-4 text-muted hover:text-red-500 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 pr-8">
                  <FormField label="Name" required error={errors.executives?.[index]?.name?.message}>
                    <Input {...register(`executives.${index}.name` as const)} placeholder="e.g. Dr. Marcus Reyes, RRT" error={errors.executives?.[index]?.name?.message} />
                  </FormField>
                  <FormField label="Title / Role" hint="Optional" error={errors.executives?.[index]?.title?.message}>
                    <Input {...register(`executives.${index}.title` as const)} placeholder="e.g. Lead Respiratory Therapist, Clinical Director" />
                  </FormField>
                </div>
                <FormField label="Bio / Credentials" hint="Optional" error={errors.executives?.[index]?.description?.message}>
                  <Textarea {...register(`executives.${index}.description` as const)} placeholder="RRT-NPS, 15+ years in pulmonary rehabilitation, COPD & asthma specialist…" rows={2} />
                </FormField>
              </div>
            ))}
            <button
              type="button"
              onClick={() => appendExecutive({ name: "", title: "", description: "" })}
              className="inline-flex items-center gap-2 text-sm font-semibold text-gold-dark hover:text-navy transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Staff Member
            </button>
          </div>

          {/* Website Assets permission */}
          <fieldset className="space-y-3">
            <legend className="text-sm font-semibold text-navy mb-2">
              Website Assets <span className="text-gold-dark ml-0.5">*</span>
            </legend>
            <p className="text-sm text-muted -mt-1 mb-3">
              May we use photos, logos, and provider bios from your website for your listing?
            </p>
            {errors.assetPermission?.message && (
              <p className="text-xs text-red-600">{errors.assetPermission.message}</p>
            )}
            <label className="flex items-start gap-3 p-4 rounded-xl border border-pearl-dark bg-pearl cursor-pointer hover:border-teal/50 transition-colors has-[:checked]:border-teal has-[:checked]:bg-teal/5">
              <input type="radio" value="grant" {...register("assetPermission")} className="mt-0.5 accent-teal" />
              <div>
                <p className="font-semibold text-navy text-sm">Yes, you may use our website assets</p>
                <p className="text-xs text-muted mt-0.5">We&apos;ll pull your logo, practice photos, and provider info automatically.</p>
              </div>
            </label>
            <label className="flex items-start gap-3 p-4 rounded-xl border border-pearl-dark bg-pearl cursor-pointer hover:border-teal/50 transition-colors has-[:checked]:border-teal has-[:checked]:bg-teal/5">
              <input type="radio" value="support" {...register("assetPermission")} className="mt-0.5 accent-teal" />
              <div>
                <p className="font-semibold text-navy text-sm">Please have your team contact us</p>
                <p className="text-xs text-muted mt-0.5">Our support team will reach out to coordinate your listing assets.</p>
              </div>
            </label>
          </fieldset>
        </div>
      )}

      {/* ── Step 2: Contact Info ── */}
      {step === 2 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl text-navy mb-1 race-head">Contact Information</h2>
            <p className="text-sm text-muted">Who should we reach out to about this listing?</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField label="First Name" required error={errors.contactFirstName?.message}>
              <Input {...register("contactFirstName")} error={errors.contactFirstName?.message} placeholder="Jane" />
            </FormField>

            <FormField label="Last Name" required error={errors.contactLastName?.message}>
              <Input {...register("contactLastName")} error={errors.contactLastName?.message} placeholder="Smith" />
            </FormField>

            <FormField label="Email Address" required error={errors.email?.message} className="sm:col-span-2">
              <Input {...register("email")} type="email" error={errors.email?.message} placeholder="jane@yourpractice.com" />
            </FormField>

            <FormField label="Phone" required error={errors.contactPhone?.message}>
              <Input
                {...register("contactPhone")}
                type="tel"
                placeholder="(555) 000-0000"
                error={errors.contactPhone?.message}
                onChange={(e) => { e.target.value = formatPhone(e.target.value); register("contactPhone").onChange(e); }}
              />
            </FormField>

            <FormField label="Title / Role" hint="Optional">
              <Input {...register("contactTitle")} placeholder="e.g. Owner, Clinical Director, Office Manager" />
            </FormField>
          </div>

          <FormField label="Notes" hint="Optional">
            <Textarea {...register("notes")} placeholder="Any questions, special requests, or context for our team…" rows={3} />
          </FormField>

          {/* Award plaque shipping */}
          <div className="pt-4 border-t border-pearl-dark">
            <h3 className="text-sm font-semibold text-navy mb-1">Complimentary Award Delivery</h3>
            <p className="text-xs text-muted mb-4">Where should we ship your complimentary recognition award?</p>
            <div className="space-y-5">
              <FormField label="Street Address" required error={errors.plaqueShippingAddress?.message}>
                <Input {...register("plaqueShippingAddress")} error={errors.plaqueShippingAddress?.message} placeholder="1420 Industrial Blvd, Suite 100" autoComplete="street-address" />
              </FormField>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <FormField label="City" required error={errors.plaqueShippingCity?.message}>
                  <Input {...register("plaqueShippingCity")} error={errors.plaqueShippingCity?.message} placeholder="Miami" autoComplete="address-level2" />
                </FormField>
                <FormField label="State" required error={errors.plaqueShippingState?.message}>
                  <Select {...register("plaqueShippingState")} error={errors.plaqueShippingState?.message} autoComplete="address-level1">
                    <option value="">State</option>
                    {US_STATES.map(s => <option key={s.abbr} value={s.abbr}>{s.abbr}</option>)}
                  </Select>
                </FormField>
                <FormField label="ZIP Code" required error={errors.plaqueShippingZip?.message}>
                  <Input {...register("plaqueShippingZip")} error={errors.plaqueShippingZip?.message} placeholder="33139" maxLength={10} inputMode="numeric" autoComplete="postal-code" />
                </FormField>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Step 3: Cities & Services ── */}
      {step === 3 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl text-navy mb-1 race-head">Cities &amp; Specialties</h2>
            <p className="text-sm text-muted">Add every city where you want your practice listed, and the respiratory specialties you offer.</p>
          </div>

          {/* Location rows */}
          <div className="space-y-3">
            {(errors.locations as { message?: string } | undefined)?.message && (
              <p className="text-xs text-red-600">{(errors.locations as { message?: string }).message}</p>
            )}

            <div className="space-y-3">
              {locationFields.map((field, i) => {
                const stateVal = watch(`locations.${i}.state`) ?? "";
                const excludeKeys = (watchedLocations ?? [])
                  .filter((l, j) => j !== i && !!l.city && !!l.state)
                  .map(l => `${l.city}|${l.state}`);
                return (
                  <div key={field.id} className="p-4 rounded-xl border border-pearl-dark bg-pearl">
                    <div className="flex items-start gap-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
                        <FormField label="State" required error={errors.locations?.[i]?.state?.message}>
                          <Controller
                            name={`locations.${i}.state` as const}
                            control={control}
                            render={({ field: stateField }) => (
                              <Select
                                {...stateField}
                                error={errors.locations?.[i]?.state?.message}
                                onChange={(e) => { stateField.onChange(e); setValue(`locations.${i}.city`, ""); }}
                              >
                                <option value="">Select a state</option>
                                {US_STATES.map(s => <option key={s.abbr} value={s.abbr}>{s.name}</option>)}
                              </Select>
                            )}
                          />
                        </FormField>

                        <FormField label="City" required error={errors.locations?.[i]?.city?.message}>
                          <Controller
                            name={`locations.${i}.city` as const}
                            control={control}
                            render={({ field: cityField }) => (
                              <CityCombobox
                                state={stateVal}
                                value={cityField.value ?? ""}
                                onChange={(val) => cityField.onChange(val)}
                                excludeKeys={excludeKeys}
                                error={errors.locations?.[i]?.city?.message}
                              />
                            )}
                          />
                        </FormField>
                      </div>

                      {locationFields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeLocation(i)}
                          className="mt-6 text-muted hover:text-red-500 transition-colors flex-shrink-0"
                          aria-label="Remove location"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => appendLocation({ city: "", state: "" })}
              className="inline-flex items-center gap-2 text-base font-bold text-gold-dark hover:text-navy transition-colors"
            >
              <Plus className="h-5 w-5" />
              Add Another City
            </button>
          </div>

          {/* Featured upgrade */}
          {validLocations.length > 0 && (
            <div className="rounded-xl border-2 border-gold/40 bg-white p-5">
              <h3 className="text-navy mb-1 flex items-center gap-2 race-head text-lg">
                <Star className="h-4 w-4 text-gold" /> Featured Listing Upgrade
              </h3>
              <p className="text-sm text-muted mb-2">Top placement per city. Only 1 Featured slot per city. First-come.</p>
              <p className="text-gold-dark font-bold text-base mb-4">
                +{formatCurrency(PRICING.cityFeatured)} first · +{formatCurrency(PRICING.cityFeaturedAdditional)} each additional (50% off)
              </p>
              <div className="space-y-2">
                {validLocations.map(loc => {
                  const key = locationKey(loc);
                  const taken = takenCities.includes(key);
                  const active = !taken && watchedFeatured.includes(key);
                  if (taken) {
                    return (
                      <div key={key} className="flex items-center gap-3 rounded-xl border border-pearl-dark bg-pearl px-4 py-3 text-sm opacity-75 cursor-not-allowed">
                        <span className="h-5 w-5 rounded border-2 border-gray-300 bg-gray-100 flex-shrink-0" />
                        <span className="flex-1 font-semibold text-muted line-through">{loc.city}, {loc.state}</span>
                        <span className="text-[11px] font-bold text-red-500/80 uppercase tracking-wide">Featured taken</span>
                      </div>
                    );
                  }
                  return (
                    <button key={key} type="button" onClick={() => toggleFeatured(loc)}
                      className={`w-full flex items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-all group ${active ? "bg-gold/15 border-gold shadow-md shadow-gold/20 ring-1 ring-gold/40" : "bg-white border-pearl-dark hover:border-gold/40 hover:bg-gold/5"}`}>
                      <span className={`h-5 w-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all ${active ? "bg-gold border-gold" : "border-gray-300 group-hover:border-gold/60"}`}>
                        {active && (
                          <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 12 12">
                            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </span>
                      <span className="flex-1 text-left font-semibold text-navy">{loc.city}, {loc.state}</span>
                      {active
                        ? <span className="flex items-center gap-1 text-xs font-bold text-gold-dark uppercase tracking-wide"><Star className="h-3 w-3 fill-gold text-gold" /> Featured</span>
                        : <span className="text-xs text-muted group-hover:text-gold/80 transition-colors">+ Get Featured</span>
                      }
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Respiratory Specialties */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-navy">Respiratory Specialties <span className="text-muted font-normal">(optional)</span></p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SPECIALTIES.map(s => {
                const checked = watchedSpecialties.includes(s);
                return (
                  <button key={s} type="button" onClick={() => toggleSpecialty(s)}
                    className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium text-left transition-all ${checked ? "bg-teal/10 border-teal text-navy" : "bg-white border-pearl-dark text-muted hover:border-teal/40"}`}>
                    <span className={`h-4 w-4 rounded flex-shrink-0 border-2 flex items-center justify-center transition-colors ${checked ? "bg-teal border-teal" : "border-pearl-dark"}`}>
                      {checked && <Check className="h-2.5 w-2.5 text-white" />}
                    </span>
                    {s}
                  </button>
                );
              })}
            </div>
            {/* All Specialties option */}
            {(() => {
              const ALL_KEY = "All Specialties and Services";
              const checked = watchedSpecialties.includes(ALL_KEY);
              return (
                <button type="button" onClick={() => toggleSpecialty(ALL_KEY)}
                  className={`w-full flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium text-left transition-all ${checked ? "bg-teal/10 border-teal text-navy" : "bg-white border-pearl-dark text-muted hover:border-teal/40"}`}>
                  <span className={`h-4 w-4 rounded flex-shrink-0 border-2 flex items-center justify-center transition-colors ${checked ? "bg-teal border-teal" : "border-pearl-dark"}`}>
                    {checked && <Check className="h-2.5 w-2.5 text-white" />}
                  </span>
                  All Specialties and Services
                </button>
              );
            })()}
          </div>

          <PricingEstimate locations={validLocations} featuredLocations={watchedFeatured} />
        </div>
      )}

      {/* ── Step 4: Billing ── */}
      {step === 4 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl text-navy mb-1 race-head">Billing Details</h2>
            <p className="text-sm text-muted">Securely provide your payment information to complete your application.</p>
          </div>

          {/* Order summary */}
          {(() => {
            const { lineItems, total } = calculateQuote({
              locations: validLocations,
              featuredLocations: watchedFeatured.filter(k => !takenCities.includes(k)),
            });
            return (
              <div className="rounded-xl border border-teal/30 bg-teal/5 p-5 space-y-3">
                <p className="text-xs font-semibold text-navy uppercase tracking-widest">Order Summary</p>
                {lineItems.map(item => (
                  <div key={item.label} className="flex justify-between items-start text-sm">
                    <span className="text-muted">{item.label}</span>
                    <span className="font-medium text-navy ml-4 flex-shrink-0">{formatCurrency(item.amount)}</span>
                  </div>
                ))}
                <div className="pt-3 border-t border-teal/20 flex justify-between items-center">
                  <span className="font-semibold text-navy">Total due today</span>
                  <span className="font-bold text-2xl text-gold-dark">{formatCurrency(total)}</span>
                </div>
              </div>
            );
          })()}

          <div className="rounded-xl border border-pearl-dark bg-pearl p-4 text-sm text-muted">
            Your listing will go live with the official TopRespiratoryTherapists.com directory launch in August 2026.
            Your listing term is 12 months from activation.
          </div>

          <div className="space-y-5">
            <FormField label="Card Number" required error={errors.cardNumber?.message}>
              <Input
                {...register("cardNumber")}
                placeholder="1234 5678 9012 3456"
                maxLength={25}
                inputMode="numeric"
                autoComplete="cc-number"
                error={errors.cardNumber?.message}
                onChange={(e) => { e.target.value = formatCC(e.target.value); register("cardNumber").onChange(e); }}
              />
            </FormField>

            <div className="grid grid-cols-2 gap-5">
              <FormField label="Expiry" required error={errors.cardExpiry?.message} hint="MM/YY">
                <Input
                  {...register("cardExpiry")}
                  placeholder="MM/YY"
                  maxLength={5}
                  inputMode="numeric"
                  autoComplete="cc-exp"
                  error={errors.cardExpiry?.message}
                  onChange={(e) => { e.target.value = formatExpiry(e.target.value); register("cardExpiry").onChange(e); }}
                />
              </FormField>

              <FormField label="Security Code" required error={errors.cardCvc?.message} hint="CVV / CVC">
                <Input
                  {...register("cardCvc")}
                  placeholder="•••"
                  maxLength={4}
                  inputMode="numeric"
                  autoComplete="cc-csc"
                  error={errors.cardCvc?.message}
                />
              </FormField>
            </div>

            <FormField label="Name on Card" required error={errors.cardName?.message}>
              <Input {...register("cardName")} placeholder="Jane Smith" autoComplete="cc-name" error={errors.cardName?.message} />
            </FormField>
          </div>

          <div className="pt-2 border-t border-pearl-dark">
            <p className="text-xs font-semibold text-navy uppercase tracking-wider mb-4">Billing Address</p>
            <div className="space-y-5">
              <FormField label="Street Address" required error={errors.billingAddress?.message}>
                <Input {...register("billingAddress")} placeholder="123 Main St" autoComplete="billing street-address" error={errors.billingAddress?.message} />
              </FormField>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <FormField label="City" required error={errors.billingCity?.message}>
                  <Controller
                    name="billingCity"
                    control={control}
                    render={({ field: cityField }) => (
                      <CityCombobox
                        state={watch("billingState") ?? ""}
                        value={cityField.value ?? ""}
                        onChange={cityField.onChange}
                        error={errors.billingCity?.message}
                      />
                    )}
                  />
                </FormField>

                <FormField label="State" required error={errors.billingState?.message}>
                  <Controller
                    name="billingState"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        error={errors.billingState?.message}
                        autoComplete="billing address-level1"
                        onChange={(e) => { field.onChange(e); setValue("billingCity", ""); }}
                      >
                        <option value="">State</option>
                        {US_STATES.map(s => <option key={s.abbr} value={s.abbr}>{s.abbr}</option>)}
                      </Select>
                    )}
                  />
                </FormField>

                <FormField label="ZIP Code" required error={errors.billingZip?.message}>
                  <Input
                    {...register("billingZip")}
                    placeholder="33139"
                    maxLength={10}
                    inputMode="numeric"
                    autoComplete="billing postal-code"
                    error={errors.billingZip?.message}
                  />
                </FormField>
              </div>
            </div>
          </div>

          <div className="space-y-1 pt-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...register("consentToTerms")}
                className="mt-0.5 h-4 w-4 rounded accent-teal flex-shrink-0"
              />
              <span className="text-sm text-muted leading-snug">
                I consent to being contacted by the TopRespiratoryTherapists.com team regarding my listing, and agree to receive marketing communications via email or SMS. Reply STOP to opt out at any time. I also agree to the{" "}
                <a href="/terms" target="_blank" className="text-gold-dark underline hover:text-navy">Terms of Service</a>{" "}
                and{" "}
                <a href="/privacy" target="_blank" className="text-gold-dark underline hover:text-navy">Privacy Policy</a>.
              </span>
            </label>
            {errors.consentToTerms && (
              <p className="text-xs text-red-600 pl-7">{errors.consentToTerms.message}</p>
            )}
          </div>

          <p className="text-xs text-muted text-center">
            Your payment will appear on your card or bank statement as{" "}
            <span className="font-medium text-navy">Digital Service Brands</span>.
          </p>

          {serverError && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">
              {serverError}
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className={`flex mt-8 pt-6 border-t border-pearl-dark ${step > 1 ? "justify-between" : "justify-end"}`}>
        {step > 1 && (
          <button
            type="button"
            onClick={goBack}
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-navy transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>
        )}

        {step < 4 ? (
          <button
            type="button"
            onClick={goNext}
            className="inline-flex items-center gap-2 rounded-xl bg-teal px-6 py-3 text-sm font-semibold text-navy hover:bg-teal-light transition-colors"
          >
            Continue
            <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <Button type="submit" variant="primary" size="lg" disabled={isSubmitting}>
            {isSubmitting ? "Submitting…" : "Submit Application"}
          </Button>
        )}
      </div>
    </form>
  );
}
