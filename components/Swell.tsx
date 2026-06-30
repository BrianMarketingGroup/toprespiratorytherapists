/**
 * Swell — layered parallax wave system for the Gilded Deep theme.
 * Three stacked sine swells (two aqua fills + the gold "Gilded Waterline" crest)
 * drawn over two periods so a translateX(-50%) loop is seamless.
 * Pure transform animation; honors prefers-reduced-motion via .animate-swell.
 */

// One band path repeated twice across the 2880-wide viewBox (fill to bottom).
const BAND =
  "M0,112 C360,52 1080,172 1440,112 C1800,52 2520,172 2880,112 L2880,200 L0,200 Z";
// Crest line only (no fill), repeated twice.
const CREST =
  "M0,118 C360,58 1080,178 1440,118 C1800,58 2520,178 2880,118";

interface SwellProps {
  className?: string;
}

export default function Swell({ className = "" }: SwellProps) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-x-0 bottom-0 overflow-hidden ${className}`}
    >
      {/* Back swell — deep abyss-glow fill */}
      <div className="absolute bottom-0 left-0 h-full w-[200%] animate-swell" style={{ animationDuration: "26s" }}>
        <svg className="h-full w-full" viewBox="0 0 2880 200" preserveAspectRatio="none">
          <path d={BAND} fill="#0E3A44" fillOpacity="0.55" style={{ filter: "blur(1px)" }} />
        </svg>
      </div>

      {/* Mid swell — aqua living-light fill, drifting the other way */}
      <div
        className="absolute bottom-0 left-0 h-full w-[200%] animate-swell"
        style={{ animationDuration: "18s", animationDirection: "reverse" }}
      >
        <svg className="h-full w-full" viewBox="0 0 2880 200" preserveAspectRatio="none">
          <path d={BAND} fill="#1FC8C0" fillOpacity="0.10" />
        </svg>
      </div>

      {/* Crest — the Gilded Waterline (gold) with a faint aqua refraction echo */}
      <div className="absolute bottom-0 left-0 h-full w-[200%] animate-swell" style={{ animationDuration: "12s" }}>
        <svg className="h-full w-full" viewBox="0 0 2880 200" preserveAspectRatio="none">
          <defs>
            <linearGradient id="gildedFoil" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#9A6F2C" />
              <stop offset="45%" stopColor="#F2D58C" />
              <stop offset="52%" stopColor="#FFF0C9" />
              <stop offset="60%" stopColor="#F2D58C" />
              <stop offset="100%" stopColor="#9A6F2C" />
            </linearGradient>
          </defs>
          <path d={CREST} fill="none" stroke="#5FF4E8" strokeOpacity="0.4" strokeWidth="1" transform="translate(0,3)" />
          <path
            d={CREST}
            fill="none"
            stroke="url(#gildedFoil)"
            strokeOpacity="0.75"
            strokeWidth="1.6"
            style={{ filter: "drop-shadow(0 0 6px rgba(217,169,78,0.5))" }}
          />
        </svg>
      </div>
    </div>
  );
}
