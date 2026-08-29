import { useEffect, useMemo, useState } from "react";
import { loadGalleryItems, optimizedImageUrl, shuffled } from "../../lib/github";
import type { GalleryItem } from "../../types";
import SectionHeading from "../ui/SectionHeading";
import ScrollReveal from "../ui/ScrollReveal";
import Lightbox from "../ui/Lightbox";

const ALL_TAB = "All";
const SAMPLE_PER_CATEGORY = 3;

export default function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [activeTab, setActiveTab] = useState<string>(ALL_TAB);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadGalleryItems()
      .then((data) => {
        if (cancelled) return;
        setItems(data);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const categories = useMemo(() => {
    const set = new Set(items.map((i) => i.category));
    return [ALL_TAB, ...Array.from(set)];
  }, [items]);

  // "All" shows a shuffled sample from every category rather than the
  // entire (potentially large) gallery, keeping the grid editorial
  // rather than an overwhelming wall of thumbnails — ported behaviour
  // from the original gallery.js.
  const visibleItems = useMemo(() => {
    if (activeTab !== ALL_TAB) {
      return items.filter((i) => i.category === activeTab);
    }
    const byCategory = new Map<string, GalleryItem[]>();
    items.forEach((i) => {
      const list = byCategory.get(i.category) ?? [];
      list.push(i);
      byCategory.set(i.category, list);
    });
    return Array.from(byCategory.values()).flatMap((list) =>
      shuffled(list).slice(0, SAMPLE_PER_CATEGORY)
    );
  }, [items, activeTab]);

  const openAt = (item: GalleryItem) => {
    setActiveIndex(visibleItems.findIndex((i) => i.url === item.url));
  };

  const navigate = (direction: 1 | -1) => {
    setActiveIndex((prev) => {
      if (prev === null || visibleItems.length === 0) return prev;
      return (prev + direction + visibleItems.length) % visibleItems.length;
    });
  };

  return (
    <section id="gallery" className="section border-b border-stone-line bg-rice-deep py-20">
      <div className="wrap">
        <SectionHeading
          caseNo="CASE_04"
          title="Gallery"
          kicker="A few frames outside the terminal — same eye for detail, pointed somewhere quieter."
        />

        {status === "ready" && categories.length > 1 && (
          <ScrollReveal className="mb-8 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveTab(cat)}
                className={`border px-4 py-1.5 font-mono text-xs uppercase tracking-wide transition-colors duration-200 ${
                  activeTab === cat
                    ? "border-sumi bg-sumi text-rice"
                    : "border-stone-line text-stone hover:border-moss hover:text-moss-deep"
                }`}
              >
                {cat}
              </button>
            ))}
          </ScrollReveal>
        )}

        {status === "loading" && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square animate-pulse bg-sumi/[0.06]" />
            ))}
          </div>
        )}

        {status === "error" && (
          <p className="border border-stone-line bg-rice-raised p-6 text-sm text-stone">
            The gallery couldn't be loaded right now — it's fetched live from a linked
            image repository. Please check back shortly.
          </p>
        )}

        {status === "ready" && (
          <div className="columns-2 gap-4 sm:columns-3 lg:columns-4 [&>*]:mb-4">
            {visibleItems.map((item, i) => (
              <ScrollReveal key={`${item.url}-${i}`} delay={(i % 4) * 0.06} className="break-inside-avoid">
                <button
                  type="button"
                  onClick={() => openAt(item)}
                  aria-label={`Open ${item.label} in viewer`}
                  className="group relative block w-full overflow-hidden shadow-soft"
                >
                  <img
                    src={optimizedImageUrl(item.url, 480, 72)}
                    alt={item.label}
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      // If the resize proxy is ever unreachable, fall back
                      // to the original full-size image rather than a
                      // broken thumbnail.
                      const img = e.currentTarget;
                      if (img.src !== item.url) img.src = item.url;
                    }}
                    className="w-full object-cover transition-transform duration-700 ease-zen group-hover:scale-[1.05] grayscale-[10%] group-hover:grayscale-0"
                  />
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-sumi/85 to-transparent p-3 text-left text-rice opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <span className="block font-mono text-[10px] uppercase tracking-wide text-moss-soft">
                      {item.category}
                    </span>
                    <span className="font-display text-sm">{item.label}</span>
                  </span>
                </button>
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>

      <Lightbox items={visibleItems} activeIndex={activeIndex} onClose={() => setActiveIndex(null)} onNavigate={navigate} />
    </section>
  );
}
