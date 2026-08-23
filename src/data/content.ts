import type { ContactLink, NavItem, Project, SkillGroup } from "../types";

export const navItems: NavItem[] = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#gallery", label: "Gallery" },
  { href: "#blog", label: "Blog" },
  { href: "#contact", label: "Contact" },
];

// Ported 1:1 from the original site's skills.js SKILLS object.
export const skillGroups: SkillGroup[] = [
  {
    category: "Security Domains",
    skills: [
      "Web Application Security",
      "Bug Bounty Hunting",
      "Security Research",
      "Vulnerability Assessment",
      "Penetration Testing",
      "OWASP Top 10",
      "API Security",
      "Responsible Disclosure",
    ],
  },
  {
    category: "Bug Bounty Platforms",
    skills: ["HackerOne", "Bugcrowd", "OpenBugBounty"],
  },
  {
    category: "Security Tools",
    skills: ["Burp Suite", "Nmap", "OWASP ZAP", "ffuf", "nuclei", "subfinder", "httpx", "amass"],
  },
  {
    category: "Development & Utilities",
    skills: ["Python", "Linux", "Git", "GitHub"],
  },
];

// Ported 1:1 from the original site's PROJECTS array (jsDelivr-hosted screenshots).
export const projects: Project[] = [
  {
    id: "media-dl",
    title: "media-dl",
    description:
      "Small self-hosted Flask app around yt-dlp (video/audio) and gallery-dl (images/galleries) for downloading from various platforms.",
    tech: ["python", "ffmpeg", "yt-dlp", "gallery-dl"],
    repo: "https://github.com/kalunkheparshuram/media-dl",
    imageUrl: "https://cdn.jsdelivr.net/gh/kalunkheparshuram/media-dl@main/screenshots/media-dl.png",
  },
  {
    id: "i3wm-rice",
    title: "i3wm — rice",
    description:
      "A lightweight Linux environment built around one principle: the computer should adapt to the operator, never the other way around.",
    tech: ["linux", "bash", "c"],
    repo: "https://github.com/kalunkheparshuram/i3wm",
    imageUrl:
      "https://cdn.jsdelivr.net/gh/kalunkheparshuram/i3wm@main/assets/screenshots/debian_linux.png",
  },
];

export const contactEmail = "parshuramkalunkhe@proton.me";

export const contactLinks: ContactLink[] = [
  { label: "GitHub", href: "https://github.com/kalunkheparshuram"},
  { label: "LinkedIn", href: "https://www.linkedin.com/in/parshuramkalunkhe"},
  { label: "Instagram", href: "https://www.instagram.com/parshuramkalunkhe" },
  { label: "Telegram", href: "https://t.me/parshuramkalunkhe"},
];

export const contactMeta = [
  { label: "Based in", value: "Mumbai, India" },
  { label: "Focus", value: "Security Research / Bug Bounty" },
  { label: "Available", value: "Open to work / Freelance / Remote" },
];

// ---- Footer columns (ported from the original site's Footer, remapped to v2's sections) ----
export const footerColumns: { title: string; links: NavItem[] }[] = [
  {
    title: "Sitemap",
    links: navItems,
  },
  {
    title: "Resources",
    links: [
      { label: "Opensource Alternative", href: "https://www.opensourcealternative.to/" },
      { label: "Public APIs", href: "https://github.com/public-apis/public-apis" },
      { label: "Defronix Academy", href: "#bloghttps://github.com/defronixpro/Defronix-Cybersecurity-Roadmap" },
      { label: "Hackviser", href: "https://hackviser.com/" },
    ],
  },
  {
    title: "Bug Bounty Platforms",
    links: [
      { label: "HackerOne", href: "https://hackerone.com/h0n3y84d93r?type=user" },
      { label: "Bugcrowd", href: "https://bugcrowd.com/h/h0n3y84d93r" },
      { label: "OpenBugBounty", href: "https://www.openbugbounty.org/researchers/athreya/" },
    ],
  },
  {
    title: "Practice & Certifications",
    links: [
      // No URL was given for PortSwigger — linked to the public Web Security
      // Academy, the standard PortSwigger learning resource. Swap this if a
      // different profile/URL was intended.
      { label: "PortSwigger Academy", href: "https://portswigger.net/web-security" },
      {
        label: "HackTheBox",
        href: "https://profile.hackthebox.com/profile/019d9990-f33e-7260-aae7-79f4a87c43f5",
      },
      { label: "TryHackMe", href: "https://tryhackme.com/p/ParshuramK." },
      {
        label: "Certifications",
        href: "https://www.linkedin.com/in/parshuramkalunkhe/details/certifications/",
      },
    ],
  },
  {
    title: "Useful Links",
    links: [
      { label: "elhacker.info", href: "https://elhacker.info/" },
      { label: "It Fell Over", href: "https://www.itfellover.com/" },
      { label: "Wait But Why", href: "https://waitbutwhy.com/" },
      { label: "OverTheWire", href: "https://overthewire.org/wargames/" },
    ],
  },
];

// ---- Hero wallpaper slideshow — sampled from the visitor's own gallery categories ----
// so the hero shows real photography rather than stock/placeholder imagery.
export const HERO_GALLERY_CATEGORIES = ["nature", "sky", "clouds"];
export const HERO_SLIDE_COUNT = 5;

// ---- GitHub-backed content sources (see src/lib/github.ts) ----
export const GITHUB_USER = "kalunkheparshuram";
export const BLOG_REPO = "blogs";
export const BLOG_BRANCH = "main";
export const BLOG_PATH = "content";
export const GALLERY_REPO = "gallery";
export const GALLERY_BRANCH = "main";

// ---- Nav bar music player (see hooks/useYouTubePlaylistPlayer.ts) ----
// Replace with your real playlist ID — the value after "list=" in the
// playlist's URL (e.g. music.youtube.com/playlist?list=THIS_PART, or the
// equivalent youtube.com/playlist?list=... link — both share the same
// playlist ID). The playlist must be Public or Unlisted for the embedded
// player to load it.
export const YOUTUBE_PLAYLIST_ID = "PLJu1wWVdN0JQ";
// https://youtube.com/playlist?list=PLJu1wWVdN0JQ&si=cTsINnB1uvTfS62J
