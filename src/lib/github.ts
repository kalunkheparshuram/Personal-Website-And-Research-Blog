import {
  BLOG_BRANCH,
  BLOG_PATH,
  BLOG_REPO,
  GALLERY_BRANCH,
  GALLERY_REPO,
  GITHUB_USER,
} from "../data/content";
import type { BlogManifest, GalleryItem, GalleryManifest } from "../types";

/**
 * Percent-encodes each path segment individually (not the whole path in
 * one call) so "/" separators survive. Filenames with spaces, emoji or
 * other reserved characters (e.g. "✨ Emerald Dreamscape.jpg" in this
 * site's actual gallery repo) would otherwise produce a malformed URL
 * that silently 404s. Ported from the original gallery.js.
 */
function toJsDelivrUrl(user: string, repo: string, branch: string, path: string): string {
  const encodedPath = path
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  return `https://cdn.jsdelivr.net/gh/${user}/${repo}@${branch}/${encodedPath}`;
}

export const BLOG_BASE = BLOG_PATH
  ? `https://cdn.jsdelivr.net/gh/${GITHUB_USER}/${BLOG_REPO}@${BLOG_BRANCH}/${BLOG_PATH}/`
  : `https://cdn.jsdelivr.net/gh/${GITHUB_USER}/${BLOG_REPO}@${BLOG_BRANCH}/`;

/**
 * Runs a URL through wsrv.nl (a free public resizing/re-encoding proxy,
 * formerly branded images.weserv.nl) to convert it to WebP at a sane
 * width/quality. The gallery repo's source photos are raw, un-optimized
 * JPEGs (some 1–2MB+) — serving them as full-bleed hero/menu backgrounds
 * at that size is the single biggest cause of slow first paint on
 * anything but a fast connection. wsrv.nl fetches the original once,
 * caches the resized result on Cloudflare's CDN, and serves it back —
 * typically an order of magnitude smaller for background/thumbnail use,
 * where full source resolution buys nothing visible.
 */
export function optimizedImageUrl(url: string, width: number, quality = 70): string {
  const params = new URLSearchParams({
    url: url.replace(/^https?:\/\//, ""),
    w: String(width),
    q: String(quality),
    output: "webp",
  });
  return `https://wsrv.nl/?${params.toString()}`;
}

let galleryPromise: Promise<GalleryItem[]> | null = null;

/**
 * Fetches the gallery manifest (from /public/gallery.json) and flattens it
 * into GalleryItem[]. The in-flight/completed promise is cached so that
 * multiple consumers on the same page (Hero's wallpaper slideshow and the
 * Gallery section both need this) share a single network request and JSON
 * parse instead of duplicating both.
 */
export function loadGalleryItems(): Promise<GalleryItem[]> {
  if (galleryPromise) return galleryPromise;

  galleryPromise = fetch(`${import.meta.env.BASE_URL}gallery.json?v=${__BUILD_ID__}`)
    .then((res) => {
      if (!res.ok) throw new Error("Unable to fetch gallery.json");
      return res.json() as Promise<GalleryManifest>;
    })
    .then((data) => {
      const items: GalleryItem[] = [];
      data.categories.forEach((category) => {
        category.images.forEach((image) => {
          items.push({
            category: category.name,
            label: image.title,
            url: toJsDelivrUrl(GITHUB_USER, GALLERY_REPO, GALLERY_BRANCH, `${category.name}/${image.file}`),
          });
        });
      });
      return items;
    })
    .catch((err) => {
      // Don't cache failures — a transient network error shouldn't
      // permanently block later retries (e.g. a subsequent section mount).
      galleryPromise = null;
      throw err;
    });

  return galleryPromise;
}

/** Fetches blog metadata only (from /public/posts.json) — bodies are lazy-loaded on open. */
export async function loadBlogManifest(): Promise<BlogManifest> {
  const res = await fetch(`${import.meta.env.BASE_URL}posts.json?v=${__BUILD_ID__}`);
  if (!res.ok) throw new Error("Unable to fetch posts.json");
  const data = await res.json();
  if (!data || !Array.isArray(data.posts)) {
    throw new Error("posts.json is malformed: expected a 'posts' array");
  }
  return data as BlogManifest;
}

/** Fetches a single post's raw Markdown body from the jsDelivr-hosted blogs repo. */
export async function fetchPostBody(file: string): Promise<string> {
  const res = await fetch(`${BLOG_BASE}${encodeURIComponent(file)}?v=${__BUILD_ID__}`);
  if (!res.ok) throw new Error(`Failed to load ${file}: HTTP ${res.status}`);
  return res.text();
}

/** Fisher–Yates shuffle that doesn't mutate the input — used for the gallery's "all" sample view. */
export function shuffled<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
