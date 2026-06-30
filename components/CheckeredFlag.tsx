/** Respiratory waveform mark — a stylized breathing/pulse pattern.
 *  Geometric, minimal; renders in gold via currentColor. */
export default function CheckeredFlag({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 40 26"
      className={className}
      style={style}
      aria-hidden="true"
      fill="none"
    >
      {/* Breathing waveform */}
      <path
        d="M2 13 L9 13 L12 4 L17 22 L20 10 L23 17 L26 13 L38 13"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.92"
      />
    </svg>
  );
}
