import ScrollReveal from "./ScrollReveal";

interface SectionHeadingProps {
  plotNo: string;
  title: string;
  kicker?: string;
  align?: "left" | "right";
}

/**
 * `plotNo` (e.g. "PLOT_02") is deliberate wordplay: a "plot" is both a
 * cultivated plot of land and, in security/investigative language, the
 * thread of a case — a quiet nod to both halves of the "craft vs.
 * future" identity without spelling it out.
 */
export default function SectionHeading({ plotNo, title, kicker, align = "left" }: SectionHeadingProps) {
  return (
    <ScrollReveal className={`mb-11 ${align === "right" ? "text-right ml-auto" : ""}`}>
      <span className="eyebrow">{plotNo}</span>
      <h2 className="mt-2 text-3xl sm:text-4xl lg:text-[2.75rem]">{title}</h2>
      {kicker && (
        <p className={`mt-3 max-w-[46ch] text-stone ${align === "right" ? "ml-auto" : ""}`}>{kicker}</p>
      )}
    </ScrollReveal>
  );
}
