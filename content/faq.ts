export interface FaqItem {
  question: string;
  answer: string;
}

export const faqItems: FaqItem[] = [
  {
    question: "Who can list on TopRespiratoryTherapists.com?",
    answer:
      "Any licensed respiratory therapist or respiratory care practice in the United States may apply. Whether you specialize in pulmonary rehabilitation, COPD management, asthma education, ventilator management, sleep-related breathing disorders, oxygen therapy, critical care, pediatric respiratory care, or home respiratory services, you're welcome to list. We verify each practice before publishing.",
  },
  {
    question: "What does a listing cost?",
    answer:
      "$289 per city, per year — a one-time annual payment. List in as many cities as you serve. The term is 12 months from listing activation.",
  },
  {
    question: "What is a Featured Listing?",
    answer:
      "A Featured Listing is our premium placement — only one respiratory practice can hold it per city. At $689 (in addition to the $289 base listing), your practice is pinned as a highlighted banner above all other listings in that city. It's the first thing patients and referring physicians see.",
  },
  {
    question: "Can I list in multiple cities?",
    answer:
      "Yes. Many respiratory care practices serve patients across multiple locations or cities. Each city has its own directory page — list in any city where you operate or where patients would search for respiratory care.",
  },
  {
    question: "When do listings go live?",
    answer:
      "Listings are typically published within a few business days after approval. During a new directory's pre-launch period, approved listings are held and published when the directory goes live so that all participating practices debut together.",
  },
  {
    question: "What is the pre-launch special?",
    answer:
      "Businesses that apply before our August 2026 launch are eligible to receive 50% off all listings. This limited-time offer provides the same recognition, benefits, and visibility at a reduced pre-launch rate.",
  },
  {
    question: "Do you host an awards dinner?",
    answer:
      "The Awards & Recognition Dinner is an exclusive annual event celebrating the practices featured on TopRespiratoryTherapists.com. It brings together recognized practices, industry professionals, and invited guests to celebrate excellence in patient care. Each listing includes an invitation for your practice, with the event schedule and location announced in advance.",
  },
  {
    question: "What is included in a listing?",
    answer:
      "Every listing includes a dedicated practice profile page, your respiratory specialties and services, provider credentials and clinical experience, patient education resources, office information and hours, contact details, a practice description, and your TopRespiratoryTherapists.com recognition badge.",
  },
  {
    question: "Do I receive a recognition award?",
    answer:
      "Yes. Every listed practice receives a custom TopRespiratoryTherapists.com recognition award suitable for display in your clinic, waiting room, or office — a tangible credential that builds trust with patients and referring physicians.",
  },
  {
    question: "Can I cancel?",
    answer:
      "Listings are annual. Once your listing is confirmed, the fee is non-refundable for the current term. You may cancel auto-renewal at any time before the next annual cycle.",
  },
];

export const howItWorksFaqItems: FaqItem[] = [
  faqItems[0],
  faqItems[2],
  faqItems[7],
  faqItems[8],
];
