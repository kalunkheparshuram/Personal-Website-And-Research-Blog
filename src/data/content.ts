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
    category: "Security Operations",
    skills: [
      "SOC Operations",
      "Security Monitoring",
      "Alert Triage",
      "Incident Investigation",
      "Threat Detection",
      "Log Analysis",
      "IOC Analysis",
      "Incident Response",
    ],
  },

  {
    category: "SIEM, XDR & Endpoint Security",
    skills: [
      "Microsoft Sentinel",
      "Microsoft Defender",
      "Security Event Analysis",
      "Detection & Investigation",
      "Email Security",
    ],
  },

  {
    category: "Network & Systems Security",
    skills: [
      "Network Security",
      "TCP/IP",
      "DNS",
      "HTTP/HTTPS",
      "Wireshark",
      "Windows",
      "Linux",
      "Active Directory",
    ],
  },

  {
    category: "Security Assessment & Research",
    skills: [
      "Vulnerability Assessment",
      "Risk Assessment",
      "CVE Analysis",
      "CVSS",
      "Web Application Security",
      "OWASP Top 10",
      "Responsible Disclosure",
    ],
  },

  {
    category: "Bug Bounty & Security Research",
    skills: [
      "Bug Bounty Hunting",
      "Security Research",
      "Burp Suite",
      "Nmap",
      "OWASP ZAP",
      "ffuf",
      "nuclei",
      "API Security",
    ],
  },

  {
    category: "Scripting & Development",
    skills: ["Python", "Git", "GitHub"],
  },
];

// Ported 1:1 from the original site's PROJECTS array (jsDelivr-hosted screenshots).
export const projects: Project[] = [
  // SOC / Defensive Security Projects
  {
    id: "security-monitoring-lab",
    title: "Security Monitoring & Threat Detection Lab",
    description:
      "Practical SOC lab for analyzing security events, investigating alerts, identifying indicators of compromise, and documenting incident investigation workflows.",
    tech: [
      "microsoft-sentinel",
      "microsoft-defender",
      "siem",
      "xdr",
      "kql",
      "windows",
      "linux",
    ],
    repo: "https://github.com/kalunkheparshuram/Security-Monitoring-And-Threat-Detection-Lab",
    imageUrl: "https://www.cyberwhiz.co.uk/images/blue-team-hero.png",
  },

  // Security Research — secondary
  {
    id: "vulnerability-assessment-lab",
    title: "Offensive Security & Vulnerability Assessment Lab",
    description:
      "Isolated security lab for reconnaissance, service enumeration, vulnerability assessment, controlled exploitation, network traffic analysis, and security reporting.",
    tech: ["kali-linux", "nmap", "burp-suite", "wireshark", "metasploitable"],
    repo: "https://github.com/kalunkheparshuram/Offensive-Security-And-Vulnerability-Assessment-Lab",
    imageUrl: "https://linuxhandbook.com/content/images/size/w1200/format/avif/2021/11/homelab-setup.webp",
  },
  
  // Technical / Personal Projects
  {
    id: "media-dl",
    title: "media-dl",
    description:
      "Small self-hosted Flask app around yt-dlp (video/audio) and gallery-dl (images/galleries) for downloading from various platforms.",
    tech: ["python", "ffmpeg", "yt-dlp", "gallery-dl"],
    repo: "https://github.com/kalunkheparshuram/media-dl",
    imageUrl:
      "https://cdn.jsdelivr.net/gh/kalunkheparshuram/media-dl@main/screenshots/media-dl.png",
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
      // BUG FIX: this was "#bloghttps://github.com/..." — a stray "#blog"
      // fragment fused onto the real URL, which made the link a dead
      // in-page anchor instead of navigating anywhere.
      { label: "Defronix Academy", href: "https://github.com/defronixpro/Defronix-Cybersecurity-Roadmap" },
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
      { label: "TryHackMe", href: "https://tryhackme.com/p/ParshuramK" },
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
