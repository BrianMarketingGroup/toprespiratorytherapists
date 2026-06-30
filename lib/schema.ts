import { z } from "zod";

export const SPECIALTIES = [
  "Pulmonary Rehabilitation",
  "COPD Management",
  "Asthma Education & Treatment",
  "Ventilator Management",
  "Sleep-Related Breathing Disorders",
  "Oxygen Therapy",
  "Critical Care Respiratory",
  "Pediatric Respiratory Care",
  "Home Respiratory Services",
] as const;

export const applySchema = z.object({
  type: z.literal("apply").default("apply"),

  // Step 1: Practice Details
  companyName: z.string().min(2, "Company name is required"),
  website: z.string().optional(),
  companyPhone: z
    .string()
    .min(10, "Enter a valid phone number")
    .regex(/^[\d\s\(\)\-\+\.]+$/, "Enter a valid phone number"),
  executives: z.array(
    z.object({
      name: z.string().min(1, "Name is required"),
      title: z.string().optional(),
      description: z.string().max(500, "Description too long").optional(),
    })
  ).optional(),
  assetPermission: z.enum(["grant", "support"], {
    errorMap: () => ({ message: "Please select an option" }),
  }),

  // Step 2: Contact Info
  contactFirstName: z.string().min(1, "First name is required"),
  contactLastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email address"),
  contactPhone: z
    .string()
    .min(10, "Enter a valid phone number")
    .regex(/^[\d\s\(\)\-\+\.]+$/, "Enter a valid phone number"),
  contactTitle: z.string().optional(),
  plaqueShippingAddress: z.string().min(5, "Shipping address is required"),
  plaqueShippingCity: z.string().min(2, "City is required"),
  plaqueShippingState: z.string().length(2, "Select a state"),
  plaqueShippingZip: z.string().regex(/^\d{5}(-\d{4})?$/, "Enter a valid ZIP code"),
  notes: z.string().max(1000).optional(),

  // Step 3: Cities & Specialties
  locations: z
    .array(z.object({
      city: z.string().min(1, "City is required"),
      state: z.string().length(2, "Select a state"),
    }))
    .min(1, "Add at least one city"),
  featuredLocations: z.array(z.string()).default([]),
  specialties: z.array(z.string()).optional().default([]),

  // Step 4: Billing
  cardNumber: z.string().regex(/^[\d\s]{13,25}$/, "Enter a valid card number"),
  cardExpiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Enter expiry as MM/YY"),
  cardCvc: z.string().regex(/^\d{3,4}$/, "Enter 3 or 4 digit security code"),
  cardName: z.string().min(2, "Name on card is required"),
  billingAddress: z.string().min(5, "Billing address is required"),
  billingCity: z.string().min(2, "Billing city is required"),
  billingState: z.string().length(2, "Select a state"),
  billingZip: z.string().regex(/^\d{5}(-\d{4})?$/, "Enter a valid ZIP code"),
  consentToTerms: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the terms to continue" }),
  }),

  _honeypot: z.string().max(0, "Bot detected").optional(),
});

export const contactSchema = z.object({
  type: z.literal("contact").default("contact"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email address"),
  phone: z
    .string()
    .min(10, "Enter a valid phone number")
    .regex(/^[\d\s\(\)\-\+\.]+$/, "Enter a valid phone number"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  consentToContact: z.literal(true, {
    errorMap: () => ({ message: "Please confirm your consent to continue" }),
  }),
  _honeypot: z.string().max(0, "Bot detected").optional(),
});

export type ApplyFormData = z.infer<typeof applySchema>;
export type ContactFormData = z.infer<typeof contactSchema>;
