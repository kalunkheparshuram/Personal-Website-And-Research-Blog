import { m, useReducedMotion } from "framer-motion";

interface GrowthRingsProps {
  className?: string;
  /** Ring stroke color pair — defaults to the moss/indigo duality. */
  tone?: "duo" | "moss" | "indigo";
}

/**
 * SIGNATURE ELEMENT.
 * Concentric rings read three ways at once, deliberately: growth rings in
 * a cut tree trunk (patience, seasons — the farming half), contour lines
 * on a terraced rice paddy (cultivation, land), and a concentric security
 * perimeter / radar sweep (layered defense — the analyst half). Used in
 * the hero, as a section-divider mark, and faintly in the background of
 * About — never as generic decoration, always at a moment that touches
 * both halves of the "craft vs. future" idea.
 */
export default function GrowthRings({ className = "", tone = "duo" }: GrowthRingsProps) {
  const prefersReducedMotion = useReducedMotion();
  const radii = [18, 34, 50, 66, 82];

  const colors =
    tone === "moss"
      ? ["#5F7052", "#5F7052"]
      : tone === "indigo"
        ? ["#33415C", "#33415C"]
        : ["#5F7052", "#33415C"];

  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="100" cy="100" r="2.5" fill={colors[0]} />
      {radii.map((r, i) => (
        <m.circle
          key={r}
          cx="100"
          cy="100"
          r={r}
          fill="none"
          stroke={i % 2 === 0 ? colors[0] : colors[1]}
          strokeWidth="0.6"
          strokeOpacity={0.55 - i * 0.07}
          initial={prefersReducedMotion ? undefined : { scale: 0.85, opacity: 0 }}
          whileInView={prefersReducedMotion ? undefined : { scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: "100px 100px" }}
        />
      ))}
    </svg>
  );
}
