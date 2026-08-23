import { useEffect } from "react";
import { AnimatePresence, m } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { optimizedImageUrl } from "../../lib/github";
import type { GalleryItem } from "../../types";

interface LightboxProps {
  items: GalleryItem[];
  activeIndex: number | null;
  onClose: () => void;
  onNavigate: (direction: 1 | -1) => void;
}

export default function Lightbox({ items, activeIndex, onClose, onNavigate }: LightboxProps) {
  const open = activeIndex !== null;

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNavigate(1);
      if (e.key === "ArrowLeft") onNavigate(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, onNavigate]);

  return (
    <AnimatePresence>
      {open && activeIndex !== null && (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-sumi/95 p-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={items[activeIndex].label}
          onClick={onClose}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close gallery viewer"
            className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full text-rice transition-colors hover:bg-rice/10"
          >
            <X size={22} strokeWidth={1.5} />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate(-1);
            }}
            aria-label="Previous image"
            className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-rice transition-colors hover:bg-rice/10 sm:left-6"
          >
            <ChevronLeft size={24} strokeWidth={1.5} />
          </button>

          <m.figure
            key={activeIndex}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="max-h-[82vh] max-w-[85vw] text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={optimizedImageUrl(items[activeIndex].url, 1400, 80)}
              alt={items[activeIndex].label}
              decoding="async"
              onError={(e) => {
                const img = e.currentTarget;
                const raw = items[activeIndex].url;
                if (img.src !== raw) img.src = raw;
              }}
              className="mx-auto max-h-[72vh] w-auto rounded-sm shadow-lift"
            />
            <figcaption className="mt-4 text-rice/90">
              <span className="block font-mono text-[11px] uppercase tracking-wide text-moss-soft">
                {items[activeIndex].category}
              </span>
              <span className="font-display text-lg">{items[activeIndex].label}</span>
            </figcaption>
          </m.figure>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate(1);
            }}
            aria-label="Next image"
            className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-rice transition-colors hover:bg-rice/10 sm:right-6"
          >
            <ChevronRight size={24} strokeWidth={1.5} />
          </button>
        </m.div>
      )}
    </AnimatePresence>
  );
}
