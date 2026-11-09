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
    category: "Vulnerability Assessment & Penetration Testing",
    skills: [
      "Vulnerability Assessment",
      "Penetration Testing",
      "Reconnaissance",
      "Enumeration",
      "Vulnerability Identification",
      "Exploitation",
      "Security Testing",
      "Security Reporting",
    ],
  },

  {
    category: "Web Application Security",
    skills: [
      "OWASP Top 10",
      "SQL Injection",
      "Cross-Site Scripting (XSS)",
      "Broken Access Control",
      "IDOR",
      "Authentication & Authorization Testing",
      "API Security Testing",
      "Security Misconfiguration",
    ],
  },

  {
    category: "Network & Infrastructure Security",
    skills: [
      "Network Penetration Testing",
      "TCP/IP",
      "DNS",
      "HTTP/HTTPS",
      "Port Scanning",
      "Service Enumeration",
      "Network Security Assessment",
      "Wireshark",
    ],
  },

  {
    category: "Systems & Active Directory Security",
    skills: [
      "Linux Security",
      "Windows Security",
      "Active Directory Fundamentals",
      "Privilege Escalation Fundamentals",
      "System Enumeration",
      "Security Misconfiguration Analysis",
    ],
  },

  {
    category: "Vulnerability Research & Risk Assessment",
    skills: [
      "CVE Analysis",
      "CVSS",
      "Risk Assessment",
      "Impact Analysis",
      "Proof of Concept (PoC) Validation",
      "Responsible Disclosure",
      "Bug Bounty Hunting",
      "Security Research",
    ],
  },

  {
    category: "VAPT Tools & Technologies",
    skills: [
      "Burp Suite",
      "Nmap",
      "OWASP ZAP",
      "Nuclei",
      "ffuf",
      "sqlmap",
      "Wireshark",
      "Kali Linux",
    ],
  },

  {
    category: "Scripting & Development",
    skills: [
      "Python (Basic)",
      "Git",
      "GitHub",
    ],
  },
];

// Ported 1:1 from the original site's PROJECTS array (jsDelivr-hosted screenshots).
export const projects: Project[] = [
  // Security Research — secondary
  {
    id: "inetgateway",
    title: "INETGateway - (Local Utility Tool For Network Monitoring & Threat Intilligence).",
    description:
      "One Python file, standard library only, rounded light and true-black dark themes. Offline by default: the only network activity it can ever start is the optional threat intel lookups you switch on yourself.",
    tech: ["python", "networking", "threat intel", "shell", "claude-code"],
    repo: "https://github.com/kalunkheparshuram/inetgateway",
    imageUrl: "https://cdn.jsdelivr.net/gh/kalunkheparshuram/inetgateway@main/docs/images/dashboard-light.png",
  },
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
  { label: "GitHub", href: "https://github.com/kalunkheparshuram" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/parshuramkalunkhe" },
  { label: "Instagram", href: "https://www.instagram.com/parshuramkalunkhe" },
  { label: "Telegram", href: "https://t.me/parshuramkalunkhe" },
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
// export const YOUTUBE_PLAYLIST_ID = "PLJu1wWVdN0JQ";
// Music - https://youtube.com/playlist?list=PLGxszvntB1R0&si=Sik-4N4LizStgans
// Flawed Mangoes - https://youtube.com/playlist?list=PLJ9iEEg9Xgm0&si=NKFKLnLlVkAO1VJK
// Chillhop - https://youtube.com/playlist?list=PLQwRmTwWx0uaoRXVcKbUDW0wm8G_WJzDI&si=unfsjnSsvQs2smXW
// Blue Hour - https://youtube.com/playlist?list=PLPZEnA8Wgf8Y&si=4PoA3L6BWnx6hv0f
// A Wall - https://youtube.com/playlist?list=PLNX0yhoJ3Xlc&si=kVLxSjanEFYPwjJ_
// Powfu - https://youtube.com/playlist?list=PLReHmrPAnnKs&si=G3xNO-wZHJN-0jB1
// Jeremy Zucker - https://youtube.com/playlist?list=PLUZo3u0JVRok&si=REnbulPEs-GEpq74
// Corbyn Kites - https://youtube.com/playlist?list=PLXldn-VmoMno&si=frfdShRn2gsoi-jb
// Owl City - https://youtube.com/playlist?list=PLE3BODlMxRRc&si=wfxn7ql2Za0Zm6WN
// Dreamcore - https://youtube.com/playlist?list=PLJu1wWVdN0JQ&si=whyFLpX9rfFFDXZL
// Mantras - https://youtube.com/playlist?list=PLNscqEhKeTPI&si=c01CWWmqG-NzyfYy

export interface MusicPlaylist {
  /** Short stable key (used internally, never shown). */
  id: string;
  /** Label shown in the picker — a genre or mood. */
  label: string;
  /** The value after `list=` in the playlist's URL. Must be Public or Unlisted. */
  playlistId: string;
}

// Add, remove or reorder freely. The first entry is the default.
export const MUSIC_PLAYLISTS: MusicPlaylist[] = [
  { id: "main", label: "Main mix", playlistId: "PLGxszvntB1R0" },
  { id: "mantra", label: "M. Mantra's", playlistId: "PLNscqEhKeTPI" },
  { id: "flawedmangoes", label: "Flawed Mangoes", playlistId: "PLJ9iEEg9Xgm0" },
  { id: "bluehour", label: "Blue Hour", playlistId: "PLPZEnA8Wgf8Y" },
  { id: "chillhop", label: "ChillHop", playlistId: "PLQwRmTwWx0uaoRXVcKbUDW0wm8G_WJzDI" },
  { id: "awall", label: "A Wall", playlistId: "PLNX0yhoJ3Xlc" },
  { id: "powfu", label: "Powfu", playlistId: "PLReHmrPAnnKs" },
  { id: "jeremyzucker", label: "Jeremy Zucker", playlistId: "PLUZo3u0JVRok" },
  { id: "corbynkites", label: "Corbyn Kites", playlistId: "PLXldn-VmoMno" },
  { id: "owlcity", label: "Owl City", playlistId: "PLE3BODlMxRRc" },
  { id: "dreamcore", label: "DreamCore", playlistId: "PLJu1wWVdN0JQ" },
];