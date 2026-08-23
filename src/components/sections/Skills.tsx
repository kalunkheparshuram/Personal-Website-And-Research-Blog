import { m, useReducedMotion } from "framer-motion";
import { skillGroups } from "../../data/content";
import SectionHeading from "../ui/SectionHeading";
import ScrollReveal from "../ui/ScrollReveal";

export default function Skills() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="skills" className="section border-b border-stone-line bg-rice-deep py-20">
      <div className="wrap">
        <SectionHeading
          plotNo="PLOT_02"
          title="Skills"
          kicker="What I reach for when testing a system, and what I use to build one."
          align="right"
        />

        <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2">
          {skillGroups.map((group, gi) => (
            <ScrollReveal key={group.category} delay={gi * 0.08}>
              <h3 className="font-mono text-xs uppercase tracking-[0.14em] text-moss-deep">
                {group.category}
              </h3>
              <m.ul
                className="mt-4 flex flex-wrap gap-2.5"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-10%" }}
                variants={{ hidden: {}, show: { transition: { staggerChildren: prefersReducedMotion ? 0 : 0.05 } } }}
              >
                {group.skills.map((skill) => (
                  <m.li
                    key={skill}
                    variants={{
                      hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 8 },
                      show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                    }}
                    className="rounded-sm border border-stone-line bg-rice px-3.5 py-2 text-sm text-sumi-soft transition-colors duration-200 hover:border-moss hover:text-sumi"
                  >
                    {skill}
                  </m.li>
                ))}
              </m.ul>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
