import { useState } from "react";
import { ExternalLink, Github } from "lucide-react";
import { projects } from "../../data/content";
import { optimizedImageUrl } from "../../lib/github";
import type { Project } from "../../types";
import SectionHeading from "../ui/SectionHeading";
import ScrollReveal from "../ui/ScrollReveal";

function ProjectCard({ project, delay }: { project: Project; delay: number }) {
  const [imgState, setImgState] = useState<"loading" | "loaded" | "error">(
    project.imageUrl ? "loading" : "error"
  );

  return (
    <ScrollReveal delay={delay} className="group">
      <a
        href={project.repo}
        target="_blank"
        rel="noopener noreferrer"
        className="block overflow-hidden border border-stone-line bg-rice-raised shadow-soft transition-transform duration-500 ease-zen hover:-translate-y-1"
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-sumi/5">
          {project.imageUrl && imgState !== "error" && (
            <img
              src={optimizedImageUrl(project.imageUrl, 900, 80)}
              alt={`${project.title} screenshot`}
              loading="lazy"
              decoding="async"
              onLoad={() => setImgState("loaded")}
              onError={(e) => {
                // If the resize proxy is ever unreachable, fall back to
                // the original screenshot before giving up entirely.
                const img = e.currentTarget;
                if (img.src !== project.imageUrl) {
                  img.src = project.imageUrl!;
                } else {
                  setImgState("error");
                }
              }}
              className={`h-full w-full object-cover transition-all duration-700 ease-zen group-hover:scale-[1.04] ${
                imgState === "loaded" ? "opacity-100 grayscale-[10%]" : "opacity-0"
              }`}
            />
          )}
          {imgState !== "loaded" && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display text-3xl text-sumi/15">{project.title}</span>
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <h3 className="font-display text-xl text-sumi">{project.title}</h3>
            <span className="flex shrink-0 gap-2 text-sumi/50 transition-colors group-hover:text-moss-deep">
              <Github size={17} strokeWidth={1.6} />
              {project.demo && <ExternalLink size={17} strokeWidth={1.6} />}
            </span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-sumi-soft">{project.description}</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <li
                key={t}
                className="rounded-sm bg-sumi/[0.05] px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide text-stone"
              >
                {t}
              </li>
            ))}
          </ul>
        </div>
      </a>
    </ScrollReveal>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="section border-b border-stone-line bg-rice py-20">
      <div className="wrap">
        <SectionHeading
          caseNo="CASE_03"
          title="Projects"
          kicker="Tools built out of a need, kept because they still get used."
        />
        <div className="grid gap-8 sm:grid-cols-2">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}
