// ============================================================
// SHARED TYPES
// ============================================================

export interface NavItem {
  href: string;
  label: string;
}

export interface SkillGroup {
  category: string;
  skills: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tech: string[];
  repo: string;
  demo?: string;
  /** jsDelivr-hosted screenshot; falls back to a text placeholder on error. */
  imageUrl?: string;
}

// ---- Gallery ----
export interface GalleryImageMeta {
  file: string;
  title: string;
}

export interface GalleryCategoryMeta {
  name: string;
  images: GalleryImageMeta[];
}

export interface GalleryManifest {
  updated: string;
  categories: GalleryCategoryMeta[];
}

export interface GalleryItem {
  category: string;
  label: string;
  url: string;
}

// ---- Blog ----
export interface BlogPostMeta {
  file: string;
  slug: string;
  title: string;
  date: string;
  tags: string[];
}

export interface BlogManifest {
  updated: string;
  posts: BlogPostMeta[];
}

export interface BlogPost extends BlogPostMeta {
  /** Undefined until lazily fetched when the visitor opens the post. */
  body?: string;
}

export interface ContactLink {
  label: string;
  href: string;
}
