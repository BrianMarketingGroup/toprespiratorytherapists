/** Luxury marine monogram — an abstract gilded hull cresting a waterline.
 *  Geometric, minimal; renders in gold via currentColor (tint with text-*
 *  or style color) so it glints. Kept this filename/export for Logo.tsx. */
export default function CheckeredFlag({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 40 28"
      className={className}
      style={style}
      aria-hidden="true"
      fill="none"
    >
      {/* Hull — a clean keeled wedge slicing forward */}
      <path
        d="M4 7 L33 7 C33 7 30 17 22 17 L11 17 C7 17 4 12 4 7 Z"
        fill="currentColor"
        fillOpacity="0.92"
      />
      {/* Bow accent — a thin lifted crest catching the light */}
      <path
        d="M33 7 L39 4.5 L36 9 Z"
        fill="currentColor"
        fillOpacity="0.55"
      />
      {/* Gilded waterline — the precious thread */}
      <line
        x1="1"
        y1="22"
        x2="39"
        y2="22"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        opacity="0.85"
      />
      {/* A second, quieter swell echo below */}
      <line
        x1="6"
        y1="25.4"
        x2="34"
        y2="25.4"
        stroke="currentColor"
        strokeWidth="0.9"
        strokeLinecap="round"
        opacity="0.4"
      />
    </svg>
  );
}
