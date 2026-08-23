import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { ArrowLeft, ArrowRight, Search } from "lucide-react";
import { fetchPostBody, loadBlogManifest } from "../../lib/github";
import { miniMarkdown, readingTime, stripFrontMatter } from "../../lib/markdown";
import type { BlogPost, BlogPostMeta } from "../../types";
import SectionHeading from "../ui/SectionHeading";
import ScrollReveal from "../ui/ScrollReveal";

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function BlogReader({
  post,
  onClose,
  onNavigate,
}: {
  post: BlogPost;
  onClose: () => void;
  onNavigate: (direction: 1 | -1) => void;
}) {
  const [body, setBody] = useState<string | undefined>(post.body);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(post.body ? "ready" : "loading");

  useEffect(() => {
    if (post.body) {
      setBody(post.body);
      setStatus("ready");
      return;
    }
    let cancelled = false;
    setStatus("loading");
    fetchPostBody(post.file)
      .then((raw) => {
        if (cancelled) return;
        setBody(stripFrontMatter(raw));
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [post]);

  return (
    <m.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wide text-stone hover:text-moss-deep transition-colors"
        >
          <ArrowLeft size={15} strokeWidth={1.8} />
          All posts
        </button>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => onNavigate(-1)}
            aria-label="Previous post"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-line text-sumi hover:border-moss hover:text-moss-deep transition-colors"
          >
            <ArrowLeft size={15} strokeWidth={1.6} />
          </button>
          <button
            type="button"
            onClick={() => onNavigate(1)}
            aria-label="Next post"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-line text-sumi hover:border-moss hover:text-moss-deep transition-colors"
          >
            <ArrowRight size={15} strokeWidth={1.6} />
          </button>
        </div>
      </div>

      <header className="mb-8 border-b border-stone-line pb-8">
        <span className="eyebrow">{formatDate(post.date)}</span>
        <h3 className="mt-3 font-display text-3xl sm:text-4xl text-sumi">{post.title}</h3>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-sm bg-sumi/[0.05] px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide text-stone"
            >
              {tag}
            </span>
          ))}
          {status === "ready" && body && (
            <span className="font-mono text-[11px] text-stone">· {readingTime(body)} min read</span>
          )}
        </div>
      </header>

      {status === "loading" && (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-4 w-full animate-pulse rounded bg-sumi/[0.06]" />
          ))}
        </div>
      )}

      {status === "error" && (
        <p className="rounded-md border border-stone-line bg-rice-raised p-6 text-sm text-stone">
          This post couldn't be loaded right now — its content is fetched live from a
          linked repository. Please check back shortly.
        </p>
      )}

      {status === "ready" && body && (
        <div
          className="prose-zen max-w-[68ch] text-sumi-soft leading-[1.85]"
          dangerouslySetInnerHTML={{ __html: miniMarkdown(body) }}
        />
      )}
    </m.article>
  );
}

export default function Blog() {
  const [posts, setPosts] = useState<BlogPostMeta[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [query, setQuery] = useState("");
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadBlogManifest()
      .then((data) => {
        if (cancelled) return;
        const sorted = [...data.posts].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setPosts(sorted);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [posts, query]);

  const activePost = posts.find((p) => p.slug === activeSlug) ?? null;

  const navigate = (direction: 1 | -1) => {
    if (!activePost) return;
    const idx = filtered.findIndex((p) => p.slug === activePost.slug);
    if (idx === -1) return;
    const next = filtered[(idx + direction + filtered.length) % filtered.length];
    setActiveSlug(next.slug);
  };

  return (
    <section id="blog" className="section border-b border-stone-line bg-rice py-20">
      <div className="wrap">
        <SectionHeading
          plotNo="PLOT_05"
          title="Blog"
          kicker="Writeups, notes and things learned the hard way — published as they're finished."
          align="right"
        />

        {!activePost && (
          <ScrollReveal delay={0.05} className="mb-8 flex items-center gap-3 border-b border-stone-line-strong pb-3 max-w-md ml-auto">
            <Search size={16} strokeWidth={1.6} className="text-stone" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search posts by title or tag…"
              className="w-full bg-transparent text-sm text-sumi placeholder:text-sumi/35 focus:outline-none"
              aria-label="Search blog posts"
            />
          </ScrollReveal>
        )}

        {status === "loading" && (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 w-full animate-pulse rounded-md bg-sumi/[0.05]" />
            ))}
          </div>
        )}

        {status === "error" && (
          <p className="rounded-md border border-stone-line bg-rice-raised p-6 text-sm text-stone">
            Posts couldn't be loaded right now — they're fetched live from a linked
            repository. Please check back shortly.
          </p>
        )}

        <AnimatePresence mode="wait">
          {status === "ready" && activePost && (
            <BlogReader
              key={activePost.slug}
              post={activePost}
              onClose={() => setActiveSlug(null)}
              onNavigate={navigate}
            />
          )}

          {status === "ready" && !activePost && (
            <m.ul
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col"
            >
              {filtered.length === 0 && (
                <li className="py-10 text-center text-sm text-stone">No posts match “{query}”.</li>
              )}
              {filtered.map((post, i) => (
                <ScrollReveal key={post.slug} delay={Math.min(i * 0.05, 0.3)}>
                  <li className="border-b border-stone-line py-6 first:border-t">
                    <button
                      type="button"
                      onClick={() => setActiveSlug(post.slug)}
                      className="group flex w-full flex-col items-start gap-2 text-left sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
                    >
                      <div>
                        <h3 className="font-display text-xl text-sumi transition-colors group-hover:text-moss-deep">
                          {post.title}
                        </h3>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {post.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-sm bg-sumi/[0.05] px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-stone"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <span className="shrink-0 font-mono text-xs text-stone">{formatDate(post.date)}</span>
                    </button>
                  </li>
                </ScrollReveal>
              ))}
            </m.ul>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
