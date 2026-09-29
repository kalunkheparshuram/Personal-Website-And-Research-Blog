import SectionHeading from "../ui/SectionHeading";
import ScrollReveal from "../ui/ScrollReveal";
import GrowthRings from "../layout/GrowthRings";

const timeline = [
  {
    group: "Education",
    years: "2020 – 2023",
    title: "B.Sc (IT), Mumbai University",
    text: "Where taking systems apart to understand how they hold together became a habit rather than a hobby.",
  },
  {
    group: "Experience",
    years: "2025 – Present",
    title: "Freelance Security Researcher",
    text: "Testing web applications with discipline, surfacing what matters, and writing it up clearly enough to act on.",
  },
];

const aboutImages = Object.values(
  import.meta.glob("../../assets/images/*.{jpg,jpeg,png,webp,gif}", {
    eager: true,
    query: "?url",
    import: "default",
  }),
) as string[];

const randomAboutImage =
  aboutImages[Math.floor(Math.random() * aboutImages.length)];

export default function About() {
  return (
    <section
      id="about"
      className="section relative border-b border-stone-line bg-rice py-20"
    >
      <GrowthRings
        tone="moss"
        className="pointer-events-none absolute -left-20 bottom-0 h-72 w-72 opacity-[0.08]"
      />
      <div className="wrap relative">
        <SectionHeading
          caseNo="CASE_01"
          title="About"
          kicker="Security by training. Patience by disposition."
        />

        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <ScrollReveal className="lg:mt-4">
            <div className="relative aspect-[4/5] overflow-hidden bg-rice-deep shadow-soft">
              <img
                src={randomAboutImage}
                alt="Parshuram Kalunkhe reviewing security findings"
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover grayscale-[15%]"
              />
            </div>
            <div className="mt-4 flex items-center gap-3 font-mono text-[11px] uppercase tracking-wide text-stone">
              <span className="h-px w-6 bg-stone-line-strong" />
              observation, before action
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <p className="font-display text-2xl leading-relaxed text-sumi">
              I'm a cybersecurity analyst and bug bounty hunter — I test how web
              applications actually behave under pressure, not just how they're
              supposed to behave on paper.
            </p>
            <p className="mt-5 text-sumi-soft leading-relaxed">
              My work spans web application security, vulnerability research and
              responsible disclosure, practiced hands-on and documented as I go.
              I'm currently looking for an entry-level Cybersecurity Analyst or
              SOC Analyst role to build on this foundation with real operational
              experience.
            </p>
            <p className="mt-5 text-sumi-soft leading-relaxed">
              Further out, I'm working toward a second, quieter goal: a life
              that includes farming. The two aren't as different as they sound —
              both reward patience, close observation, and the discipline to
              tend something slowly, season after season, instead of chasing a
              quick result.
            </p>

            <ol className="mt-10 flex flex-col gap-6">
              {timeline.map((entry) => (
                <li
                  key={entry.title}
                  className="border-l-2 border-stone-line-strong pl-5"
                >
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="font-mono text-[11px] uppercase tracking-wide text-moss-deep">
                      {entry.group}
                    </span>
                    <span className="font-mono text-[11px] text-stone">
                      {entry.years}
                    </span>
                  </div>
                  <h3 className="mt-1 text-lg text-sumi">{entry.title}</h3>
                  <p className="mt-1 text-sm text-sumi-soft">{entry.text}</p>
                </li>
              ))}
            </ol>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
