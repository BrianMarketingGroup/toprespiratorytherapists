import {
  CheckCircle, Star, TrendingUp, ShieldCheck, Users, Zap, Globe,
  Activity, GraduationCap, MessageSquare, BookOpen, MapPin, DollarSign, Calendar, ThumbsUp, Heart,
} from "lucide-react";
import Container from "@/components/Container";
import Button from "@/components/Button";
import FadeIn from "@/components/FadeIn";
import CountUp from "@/components/CountUp";
import Hero from "@/components/Hero";
import DirectoryPreview from "@/components/DirectoryPreview";
import AwardsDinner from "@/components/AwardsDinner";
import Faq from "@/components/Faq";
import AnnouncementBanner from "@/components/AnnouncementBanner";
import FinalCta from "@/components/FinalCta";
import { faqItems } from "@/content/faq";

const BENEFITS = [
  { icon: TrendingUp, title: "Increase Your Visibility", body: "Help patients, families, caregivers, and healthcare providers searching for respiratory care services discover your practice." },
  { icon: ShieldCheck, title: "Build Trust & Credibility", body: "A professional profile helps prospective patients understand your clinical experience, credentials, and specialized respiratory care expertise." },
  { icon: Star, title: "Differentiate Your Practice", body: "Highlight your specialized services, advanced respiratory therapies, patient education, and commitment to improving pulmonary health." },
  { icon: Users, title: "Reach Patients at Every Stage", body: "Patients often research multiple respiratory care providers before selecting a therapist for ongoing treatment or rehabilitation." },
  { icon: Zap, title: "Highlight Your Expertise", body: "Whether you specialize in pulmonary rehabilitation, COPD management, asthma education, ventilator management, sleep disorders, or home respiratory services, your profile communicates your expertise." },
  { icon: Globe, title: "Strengthen Your Online Presence", body: "An enhanced listing provides another channel through which prospective patients and referral sources can discover and evaluate your practice." },
];

const HOW_IT_WORKS = [
  { step: "01", title: "Submit Your Application", body: "Complete our simple application with your practice details, respiratory specialties, and the cities where you want to be listed." },
  { step: "02", title: "Your Profile Goes Live", body: "We build and publish your professional practice profile, optimized to appear when patients search for respiratory care in your city." },
  { step: "03", title: "Patients Find Your Practice", body: "Patients and referring physicians discover your listing, review your credentials and specialties, and reach out to schedule care." },
];

const SPECIALTY_TYPES = [
  "Pulmonary Rehabilitation", "COPD Management", "Asthma Education & Treatment",
  "Ventilator Management", "Sleep-Related Breathing Disorders",
  "Oxygen Therapy", "Critical Care Respiratory", "Pediatric Respiratory Care", "Home Respiratory Services",
];

const EVAL_CRITERIA = [
  { icon: GraduationCap, label: "Credentials" },
  { icon: Activity, label: "Clinical Experience" },
  { icon: Heart, label: "Specialties" },
  { icon: MessageSquare, label: "Patient Reviews" },
  { icon: BookOpen, label: "Patient Education" },
  { icon: Zap, label: "Treatment Options" },
  { icon: MapPin, label: "Location & Hours" },
  { icon: DollarSign, label: "Insurance Accepted" },
  { icon: ThumbsUp, label: "Overall Care" },
];

function Eyebrow({ children, tone = "aqua" }: { children: React.ReactNode; tone?: "aqua" | "gold" }) {
  return (
    <p className={`inline-flex items-center gap-2.5 text-[11px] font-semibold tracking-[0.3em] uppercase mb-5 ${tone === "gold" ? "text-gold-light" : "text-teal-light"}`}>
      <span className={`h-1.5 w-1.5 rotate-45 ${tone === "gold" ? "bg-gold-light shadow-[0_0_8px_2px_rgba(242,213,140,0.6)]" : "bg-teal-light shadow-[0_0_8px_2px_rgba(95,244,232,0.6)]"}`} />
      {children}
    </p>
  );
}

function Waterline() {
  return <div className="h-px waterline" />;
}

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* ── Stats strip ──────────────────────────────────────────────── */}
      <section className="bg-navy-dark py-14 relative overflow-hidden">
        <div className="absolute inset-0 carbon opacity-30 pointer-events-none" />
        <div className="absolute inset-x-0 top-0"><Waterline /></div>
        <Container className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { node: <>1</>, label: "Featured Spot / City" },
              { node: <><CountUp to={100} />%</>, label: "Verified Practices" },
              { node: <>12 Mo</>, label: "Annual Term" },
            ].map((s, i) => (
              <FadeIn key={i} delay={i * 0.08} variant="luxe">
                <div className="text-center">
                  <div className="race-head text-5xl sm:text-6xl font-light text-gold-light leading-none mb-2 tabular-nums">{s.node}</div>
                  <div className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-muted">{s.label}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </Container>
        <div className="absolute inset-x-0 bottom-0"><Waterline /></div>
      </section>

      {/* ── Why list / Benefits ──────────────────────────────────────── */}
      <section className="py-24 bg-navy-dark relative overflow-hidden">
        <div className="absolute inset-0 carbon opacity-[0.4] pointer-events-none" />
        <div className="absolute top-1/3 -right-24 w-96 h-96 bg-teal/10 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute bottom-0 -left-24 w-80 h-80 bg-gold/[0.06] blur-3xl rounded-full pointer-events-none" />
        <Container className="relative">
          <FadeIn variant="luxe">
            <div className="text-center mb-16 max-w-2xl mx-auto">
              <Eyebrow>Why Get Listed</Eyebrow>
              <h2 className="race-head text-3xl sm:text-5xl text-pearl mb-5 leading-tight">
                Why Your Practice<br className="hidden sm:block" /> Belongs <span className="race-head--accent">Here</span>
              </h2>
              <p className="text-muted text-lg">
                Patients and referring physicians compare experience, specialties, treatment options, and provider qualifications before choosing a respiratory therapist.
                A listing on TopRespiratoryTherapists.com keeps your practice in that evaluation.
              </p>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BENEFITS.map(({ icon: Icon, title, body }, i) => (
              <FadeIn key={title} delay={i * 0.07} variant="luxe">
                <div className="group shine-hover glass rounded-2xl p-7 h-full hover:-translate-y-1.5 hover:border-teal/40 transition-all duration-300 cursor-default">
                  <div className="h-12 w-12 rounded-xl bg-teal/10 flex items-center justify-center mb-5 border border-teal/20 group-hover:scale-110 transition-transform duration-300 animate-glow-breathe">
                    <Icon className="h-5 w-5 text-teal-light" />
                  </div>
                  <h3 className="race-head text-pearl text-xl mb-2">{title}</h3>
                  <p className="text-muted text-sm leading-relaxed">{body}</p>
                  <div className="mt-5 h-px w-0 bg-gradient-to-r from-teal to-gold group-hover:w-full transition-all duration-500" />
                </div>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Directory preview (the light "surfacing" beat) ───────────── */}
      <div id="directory">
        <DirectoryPreview />
      </div>

      {/* ── How it works ─────────────────────────────────────────────── */}
      <section className="py-24 bg-navy-dark text-pearl relative overflow-hidden">
        <div className="absolute inset-0 carbon opacity-[0.35] pointer-events-none" />
        <Container className="relative">
          <FadeIn variant="luxe">
            <div className="text-center mb-16">
              <Eyebrow>Simple Process</Eyebrow>
              <h2 className="race-head text-3xl sm:text-5xl mb-4">Three Steps to <span className="race-head--accent">Get Listed</span></h2>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
            <div className="hidden md:block absolute top-9 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-px">
              <div className="h-full waterline" />
            </div>
            {HOW_IT_WORKS.map(({ step, title, body }, i) => (
              <FadeIn key={step} delay={i * 0.12} direction="up" variant="luxe">
                <div className="text-center relative group">
                  <div className="relative inline-flex mb-6">
                    <div className="absolute inset-0 rounded-full bg-teal/25 blur-md group-hover:bg-teal/40 transition-all duration-300 animate-glow-breathe" />
                    <div className="relative inline-flex h-16 w-16 items-center justify-center rounded-full border border-gold/40 bg-navy text-gold-light race-head text-2xl font-light shadow-lg shadow-navy-dark/60 group-hover:scale-105 transition-transform duration-300">
                      {step}
                    </div>
                  </div>
                  <h3 className="race-head text-xl mb-3 text-pearl">{title}</h3>
                  <p className="text-muted text-sm leading-relaxed">{body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      {/* ── How travelers choose ─────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-navy-dark relative overflow-hidden">
        <div className="absolute inset-x-0 top-0"><Waterline /></div>
        <div className="absolute inset-0 dot-grid opacity-[0.1] pointer-events-none" />
        <Container className="relative">
          <FadeIn variant="luxe">
            <div className="text-center mb-10 sm:mb-14 max-w-2xl mx-auto">
              <Eyebrow>The Decision Process</Eyebrow>
              <h2 className="race-head text-3xl sm:text-5xl text-pearl mb-4">How Patients Choose a Respiratory Therapist</h2>
              <p className="text-muted text-base sm:text-lg">
                Patients rarely choose the first provider they find. They weigh the factors below
                before committing to a respiratory care practice.
              </p>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 max-w-4xl mx-auto">
            {EVAL_CRITERIA.map(({ icon: Icon, label }, i) => (
              <FadeIn key={label} delay={i * 0.05} variant="luxe">
                <div className="group shine-hover flex items-center gap-3 rounded-xl glass p-4 hover:border-teal/40 hover:-translate-y-1 transition-all duration-300 h-full">
                  <span className="h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0 rounded-lg bg-teal/10 border border-teal/25 flex items-center justify-center group-hover:bg-teal/20 group-hover:scale-110 transition-all duration-300">
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-teal-light" />
                  </span>
                  <span className="font-semibold text-pearl text-sm leading-tight">{label}</span>
                </div>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Highlighted Services ─────────────────────────────────────── */}
      <section className="py-20 bg-navy-dark relative overflow-hidden">
        <div className="absolute inset-0 carbon opacity-[0.4] pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-teal/10 blur-3xl rounded-full pointer-events-none" />
        <Container className="relative">
          <FadeIn variant="luxe">
            <div className="text-center mb-12 max-w-2xl mx-auto">
              <Eyebrow>Highlighted Services</Eyebrow>
              <h2 className="race-head text-3xl sm:text-5xl text-pearl mb-4">
                Showcase What Makes Your <span className="race-head--accent">Practice</span> Unique
              </h2>
            </div>
          </FadeIn>
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {SPECIALTY_TYPES.map((s, i) => {
              const premium = s === "Pulmonary Rehabilitation";
              return (
                <FadeIn key={s} delay={i * 0.04} variant="luxe">
                  <span className={`shine-hover inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200 cursor-default hover:-translate-y-0.5
                    ${premium
                      ? "border border-gold/50 text-gold-light bg-gold/[0.06] hover:bg-gold/10"
                      : "glass text-pearl/90 hover:border-teal/50 hover:text-teal-light"}`}>
                    <Activity className={`h-3.5 w-3.5 flex-shrink-0 ${premium ? "text-gold" : "text-teal"}`} />
                    {s}
                  </span>
                </FadeIn>
              );
            })}
          </div>
          <FadeIn delay={0.3} variant="luxe">
            <div className="text-center">
              <Button href="/apply" variant="primary" size="lg">Get Listed Now</Button>
            </div>
          </FadeIn>
        </Container>
      </section>

      {/* ── Pricing ──────────────────────────────────────────────────── */}
      <section id="pricing" className="py-24 bg-navy-dark text-pearl relative overflow-hidden">
        <div className="absolute inset-x-0 top-0"><Waterline /></div>
        <div className="absolute inset-0 carbon opacity-[0.4] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-teal/10 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute top-10 right-1/4 w-72 h-72 bg-gold/10 blur-3xl rounded-full pointer-events-none" />
        <Container className="relative">
          <FadeIn variant="luxe">
            <div className="text-center mb-14">
              <Eyebrow tone="gold">Transparent Pricing</Eyebrow>
              <h2 className="race-head text-3xl sm:text-5xl mb-4">One-Time Annual Fee</h2>
              <p className="text-muted max-w-xl mx-auto">No subscriptions. No per-click fees. Pay once and your listing runs a full 12-month term.</p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto items-start">
            {/* Basic */}
            <FadeIn delay={0.15} variant="luxe">
              <div className="glass rounded-2xl p-8 hover:-translate-y-1.5 transition-all duration-300 h-full">
                <h3 className="race-head text-2xl mb-1 text-pearl">Basic Listing</h3>
                <p className="text-muted text-sm mb-6">Standard directory placement</p>
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl text-muted line-through tabular-nums">$578</span>
                    <span className="text-[11px] font-bold text-gold bg-gold/15 border border-gold/30 rounded px-2 py-0.5 uppercase tracking-wide">50% Off</span>
                  </div>
                  <span className="race-head text-5xl font-light text-pearl tabular-nums">$289</span>
                  <span className="text-muted ml-2 text-sm">/ city / year</span>
                </div>
                <ul className="space-y-3 text-sm text-pearl/75 mb-8">
                  {["Dedicated practice profile page", "Respiratory specialties & services", "City directory placement", "Provider credentials & contact info", "Treatment philosophy & description"].map((f) => (
                    <li key={f} className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-teal flex-shrink-0" />{f}</li>
                  ))}
                </ul>
                <Button href="/apply" variant="outline-light" size="md" className="w-full">Get Basic Listing</Button>
              </div>
            </FadeIn>

            {/* Featured — gold tide-ring */}
            <FadeIn delay={0.25} variant="luxe">
              <div className="rounded-2xl glow-gold mt-6 md:mt-0">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap z-10">
                  <span className="bg-gold text-navy-dark text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-gold/30">
                    Most Visible — 1 Per City
                  </span>
                </div>
                <div className="bg-navy-dark/95 rounded-2xl p-8 relative overflow-hidden border border-gold/40">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gold/10 blur-2xl rounded-full pointer-events-none" />
                  <h3 className="race-head text-2xl mb-1 text-pearl flex items-center gap-2">
                    <Star className="h-5 w-5 fill-gold text-gold" /> Featured Listing
                  </h3>
                  <p className="text-muted text-sm mb-6">Premium placement + spotlight badge</p>
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl text-muted line-through tabular-nums">+$1,378</span>
                      <span className="text-[11px] font-bold text-gold bg-gold/15 border border-gold/30 rounded px-2 py-0.5 uppercase tracking-wide">50% Off</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-muted text-lg font-semibold">+</span>
                      <span className="race-head text-5xl font-light text-foil tabular-nums">$689</span>
                      <span className="text-muted ml-1 text-sm">/ city</span>
                    </div>
                  </div>
                  <ul className="space-y-3 text-sm text-pearl/85 mb-8 relative">
                    {["Everything in Basic", "Featured badge + top placement", "Highlighted in search results", "Only 1 available per city"].map((f) => (
                      <li key={f} className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-gold flex-shrink-0" />{f}</li>
                    ))}
                  </ul>
                  <Button href="/apply" variant="primary" size="md" className="w-full">Get Featured Listing</Button>
                </div>
              </div>
            </FadeIn>
          </div>
        </Container>
      </section>

      {/* ── Awards & Recognition ─────────────────────────────────────── */}
      <AwardsDinner />

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <Faq
        items={faqItems}
        title="Frequently Asked Questions"
        subtitle="Everything you need to know about getting listed on TopRespiratoryTherapists.com."
        light={false}
      />

      {/* ── Announcement banner ──────────────────────────────────────── */}
      <AnnouncementBanner />

      {/* ── Final CTA ────────────────────────────────────────────────── */}
      <FinalCta />
    </>
  );
}
