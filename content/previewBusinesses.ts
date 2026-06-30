export interface PreviewTeamMember {
  name: string;
  title: string;
}

export interface PreviewReview {
  author: string;
  text: string;
}

export interface PreviewBusiness {
  id: number;
  name: string;
  categories: string[];
  rating: number;
  reviewCount: number;
  phone: string;
  location: string;
  servingArea: string;
  imageUrl: string;
  rank?: number;
  about: string;
  team: PreviewTeamMember[];
  reviews: PreviewReview[];
}

export const previewBusinesses: PreviewBusiness[] = [
  {
    id: 1,
    name: "Houston Pulmonary & Respiratory Care",
    categories: ["Pulmonary Rehabilitation", "COPD Management"],
    rating: 5.0,
    reviewCount: 312,
    phone: "(713) 555-0142",
    location: "Houston, TX",
    servingArea: "Houston, TX · Texas Medical Center",
    imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=400&fit=crop&q=80",
    about:
      "a leading respiratory care practice in Houston specializing in pulmonary rehabilitation, COPD management, and chronic lung disease treatment at the Texas Medical Center.",
    team: [
      { name: "Dr. Marcus Reyes, RRT", title: "Lead Respiratory Therapist · 18 Years Experience" },
      { name: "Priya Nair, RRT-NPS", title: "Neonatal & Pediatric Specialist" },
    ],
    reviews: [
      { author: "Sandra K.", text: "My father's breathing improved dramatically after just 6 weeks of pulmonary rehab. Exceptional care and genuine compassion." },
      { author: "James L.", text: "Finally found a team that took my COPD seriously. Their program changed my quality of life." },
    ],
  },
  {
    id: 2,
    name: "Breathe Well Respiratory Therapy",
    categories: ["Asthma Education & Treatment", "Oxygen Therapy"],
    rating: 4.9,
    reviewCount: 287,
    phone: "(713) 555-0388",
    location: "Houston, TX",
    servingArea: "Houston, TX · Midtown",
    imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&q=80",
    rank: 1,
    about:
      "a patient-focused respiratory therapy practice offering asthma education, oxygen therapy management, and personalized breathing care plans for patients of all ages.",
    team: [
      { name: "Elena Torres, RRT", title: "Owner & Clinical Director" },
      { name: "David Kim, RRT", title: "Asthma Education Specialist" },
    ],
    reviews: [
      { author: "Michelle P.", text: "They gave me a complete asthma action plan and finally explained my triggers. I haven't had an ER visit since." },
      { author: "Robert A.", text: "Professional, thorough, and genuinely caring. My oxygen therapy setup was handled seamlessly." },
    ],
  },
  {
    id: 3,
    name: "Advanced Respiratory & Sleep Care",
    categories: ["Sleep-Related Breathing Disorders", "Ventilator Management"],
    rating: 4.9,
    reviewCount: 198,
    phone: "(713) 555-0210",
    location: "Houston, TX",
    servingArea: "Houston, TX · Memorial",
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=400&fit=crop&q=80",
    rank: 2,
    about:
      "a specialized respiratory care practice focusing on sleep-related breathing disorders, ventilator management, and complex respiratory support for both hospital and home patients.",
    team: [
      { name: "Dr. Amara Osei, RRT-SDS", title: "Sleep Disorders Specialist" },
      { name: "Nathan Brooks, RRT-ACCS", title: "Critical Care & Vent Specialist" },
    ],
    reviews: [
      { author: "Patricia W.", text: "They identified my sleep apnea and got me on the right therapy fast. Life-changing results." },
      { author: "Carlos M.", text: "Outstanding care for my mother on home ventilation. The team is available 24/7 and truly goes above and beyond." },
    ],
  },
  {
    id: 4,
    name: "PediBreath Pediatric Respiratory",
    categories: ["Pediatric Respiratory Care", "Asthma Education & Treatment"],
    rating: 4.8,
    reviewCount: 174,
    phone: "(713) 555-0455",
    location: "Houston, TX",
    servingArea: "Houston, TX · Heights",
    imageUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop&q=80",
    rank: 3,
    about:
      "a pediatric respiratory therapy practice dedicated to children with asthma, chronic lung conditions, and breathing difficulties — providing compassionate, family-centered care.",
    team: [
      { name: "Sofia Ramirez, RRT-NPS", title: "Pediatric Respiratory Specialist" },
      { name: "Liam Chen, RRT", title: "Child Life & Respiratory Educator" },
    ],
    reviews: [
      { author: "Angela T.", text: "They made my 7-year-old feel completely at ease. His asthma is so much better managed now." },
      { author: "Derek F.", text: "The pediatric team is phenomenal — patient, kind, and incredibly knowledgeable." },
    ],
  },
  {
    id: 5,
    name: "Home Breath Respiratory Services",
    categories: ["Home Respiratory Services", "Oxygen Therapy"],
    rating: 4.8,
    reviewCount: 241,
    phone: "(713) 555-0512",
    location: "Houston, TX",
    servingArea: "Houston, TX · Greater Houston Area",
    imageUrl: "https://images.unsplash.com/photo-1712215544003-af10130f8eb3?w=400&h=400&fit=crop&q=80",
    rank: 4,
    about:
      "a home-based respiratory care provider offering in-home oxygen therapy, CPAP/BiPAP management, nebulizer training, and ongoing respiratory support for patients recovering at home.",
    team: [
      { name: "Maya Johnson, RRT", title: "Home Care Director" },
      { name: "Sam Delgado, RRT", title: "Home Respiratory Technician" },
    ],
    reviews: [
      { author: "Barbara N.", text: "Being able to get respiratory care at home was a game changer for my recovery. Highly recommended." },
      { author: "Thomas H.", text: "Reliable, punctual, and so easy to work with. My home oxygen setup was perfect from day one." },
    ],
  },
];
