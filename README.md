# Parshuram Kalunkhe — Portfolio (v2)

A single-page portfolio for a **cybersecurity analyst & bug bounty hunter**, rebuilt in
React + TypeScript from an original HTML/CSS/JS site. Visual direction: Japanese zen,
editorial, wabi-sabi — calm and premium rather than a neon "hacker" template. The design
quietly carries a second identity too: *cybersecurity professional by craft, farmer by
future* — expressed through a natural palette, patient/precise language, and a signature
"growth rings" motif that reads as tree rings, terraced-field contours, and a security
perimeter all at once.

## Stack

- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS** (custom theme — see `tailwind.config.ts`)
- **Framer Motion** for scroll reveals, page/section transitions and micro-interactions
  (all respect `prefers-reduced-motion`)
- **lucide-react** for icons
- Google Fonts: Zen Old Mincho (display), Zen Kaku Gothic New (body), JetBrains Mono
  (labels / tags / technical detail)

## Getting started

```bash
npm install
npm run dev        # local dev server
npm run build       # type-checks (tsc -b) then builds to dist/
npm run preview     # preview the production build locally
```

## Structure

```
src/
  components/
    layout/        Navbar, Footer, GrowthRings (signature motif)
    sections/       Hero, About, Skills, Projects, Gallery, Blog, Contact
    ui/             SectionHeading, ScrollReveal, Lightbox — shared building blocks
  data/content.ts   All static copy: nav, skills, projects, contact info
  lib/
    github.ts        jsDelivr URL building + gallery.json / posts.json fetching
    markdown.ts       Minimal Markdown → HTML renderer for blog posts
  types/index.ts    Shared TypeScript interfaces
  App.tsx           Assembles the one-page layout
  main.tsx          React entry point
public/
  gallery.json      Gallery manifest (category → image files), ported as-is from the
                     original site — images themselves are pulled live from jsDelivr
  posts.json        Blog post metadata (title/date/tags/file) — post bodies are
                     lazy-fetched from a linked GitHub repo when a visitor opens one
index.html          Document shell, SEO meta tags, Google Fonts
```

## Content sections (per the brief)

Hero → About → Skills → Projects → Gallery → Blog → Contact → Footer.
No "Field Notes", "Testimonials", or "Engagements" sections — those were intentionally
dropped in favor of Skills / Projects / Gallery / Blog.

## Live content: Gallery & Blog

Both sections are **ported faithfully from the original site's logic**, not re-hardcoded:

- **Gallery** (`lib/github.ts` → `loadGalleryItems`) reads `public/gallery.json` for
  categories/filenames, then builds image URLs against a jsDelivr-hosted `gallery` repo.
  Category tabs, an "All" view that samples a few images per category, loading/error
  states and a full-screen lightbox are all preserved.
- **Blog** (`lib/github.ts` + `lib/markdown.ts`) reads `public/posts.json` for metadata
  only; a post's Markdown body is fetched from a jsDelivr-hosted `blogs` repo the moment
  a visitor opens it (not upfront), then rendered with a small dependency-free Markdown
  renderer ported from the original `post.js`.

**Before deploying**, update `GITHUB_USER`, `GALLERY_REPO` and `BLOG_REPO` /
`BLOG_PATH` in `src/data/content.ts` if those repos live somewhere different, and make
sure `public/gallery.json` / `public/posts.json` match what's actually in those repos.

## GitHub Pages deployment

This project is set up to deploy correctly with **zero manual path configuration**:

1. **Relative asset base** — `vite.config.ts` sets `base: "./"`, so every built asset
   URL is relative. This works unmodified whether the site is deployed to a *user* page
   (`https://<user>.github.io/`, root domain) or a *project* page
   (`https://<user>.github.io/<repo>/`, a subpath) — there's no base path to remember to
   edit before deploying.
2. **No client-side router** — this is a genuine single page navigated via in-page
   anchors (`#about`, `#projects`, …), not a multi-route SPA. That sidesteps the classic
   GitHub Pages "hard refresh 404s on a sub-route" problem entirely: every anchor still
   resolves to the same `index.html`.
3. **Automated deploy workflow** — `.github/workflows/deploy.yml` builds the project and
   publishes `dist/` via GitHub's official Pages actions on every push to `main`. To use
   it: push this repo to GitHub, then in **Settings → Pages** set the source to
   **"GitHub Actions"**. No `gh-pages` branch or personal access token needed.

To deploy manually instead, run `npm run build` and publish the contents of `dist/`.

## Notes before going live

- **Contact form** currently simulates submission client-side (see `Contact.tsx`). Wire
  it to a real endpoint (FormSubmit, a serverless function, etc.) before launch.
- **Images**: the Hero/About sections use `picsum.photos` placeholders — swap in real
  photography via `src/components/sections/About.tsx`. Project screenshots and gallery
  images are pulled live from the linked GitHub repos noted above.
- Update Open Graph details and canonical info in `index.html` once deployed.
