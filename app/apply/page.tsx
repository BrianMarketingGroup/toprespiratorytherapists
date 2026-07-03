import { Shield, Star, Zap } from "lucide-react";
import Container from "@/components/Container";
import ApplyForm from "@/components/ApplyForm";
import { siteConfig } from "@/site.config";

export const metadata = {
  title: `List Your Practice — ${siteConfig.name}`,
  description: `Apply to list your respiratory therapy practice on ${siteConfig.name} and reach patients and referring physicians searching for pulmonary rehabilitation, COPD management, asthma care, and more in your city.`,
};

const TRUST = [
  { icon: Star, text: "Only 1 Featured Listing per city" },
  { icon: Shield, text: "Verified practices only" },
  { icon: Zap, text: "Directory launches August 2026" },
];

export default function ApplyPage() {
  return (
    <>
      {/* Dark header */}
      <section className="bg-navy-dark text-pearl pt-8 pb-0 sm:py-14 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 70% 50%, #0ea5e9 0%, transparent 60%)" }}
        />
        <Container className="relative text-center">
          <h1 className="race-head text-3xl sm:text-4xl lg:text-5xl font-light mb-4 text-pearl">
            List Your <span className="race-head--accent">Respiratory</span> Practice
          </h1>
          <p className="text-muted max-w-xl mx-auto text-lg">
            Secure your listing before the August 2026 launch and reach patients
            and referring physicians actively searching for respiratory care in your city.
          </p>
          {/* Trust row */}
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 mt-5 text-sm text-muted">
            {TRUST.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-1.5">
                <Icon className="h-3.5 w-3.5 text-teal" />
                {text}
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Form */}
      <section className="bg-navy-dark py-6 sm:py-12 min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 carbon opacity-20 pointer-events-none" />
        <Container className="relative">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl shadow-black/30 border border-white/10 overflow-hidden">
              {/* Card header */}
              <div className="bg-gradient-to-r from-navy to-navy-light px-8 py-5 flex items-center justify-between">
                <div>
                  <p className="text-pearl font-bold">Respiratory Practice Application</p>
                  <p className="text-muted text-xs mt-0.5">All information is kept confidential</p>
                </div>
                <div className="flex items-center gap-1.5 bg-teal/20 border border-teal/30 rounded-full px-3 py-1.5">
                  <Shield className="h-3 w-3 text-teal" />
                  <span className="text-teal-light text-xs font-semibold">Secure</span>
                </div>
              </div>
              {/* Form body */}
              <div className="p-6 sm:p-8">
                <ApplyForm />
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
