/**
 * A small, dependency-free Markdown → HTML renderer, ported from the
 * original vanilla-JS site's post.js. Handles headings, bold/italic,
 * inline code, fenced code blocks, ordered/unordered lists and rules —
 * enough for this blog's own posts, not a general CommonMark engine.
 *
 * Output is inserted via dangerouslySetInnerHTML in BlogReader, so
 * escapeHTML() runs first on the raw text to guard against any HTML
 * that might be sitting in a fetched .md file.
 */

function escapeHTML(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function miniMarkdown(md: string): string {
  let html = escapeHTML(md);

  html = html.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, (_match, language, code) => {
    const languageClass = language ? ` class="language-${language}"` : "";
    return `<pre><code${languageClass}>${code.trim()}</code></pre>`;
  });

  html = html.replace(/^### (.*)$/gim, "<h4>$1</h4>");
  html = html.replace(/^## (.*)$/gim, "<h3>$1</h3>");
  html = html.replace(/^# (.*)$/gim, "<h2>$1</h2>");

  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
  html = html.replace(/`([^`\n]+)`/g, "<code>$1</code>");
  html = html.replace(/^---$/gim, "<hr>");

  html = html.replace(/(?:^\d+\.\s+.*(?:\n|$))+/gim, (block) => {
    const items = block
      .trim()
      .split("\n")
      .map((line) => line.replace(/^\d+\.\s+(.*)$/, "<li>$1</li>"))
      .join("");
    return `<ol>${items}</ol>`;
  });

  html = html.replace(/(?:^-\s+.*(?:\n|$))+/gim, (block) => {
    const items = block
      .trim()
      .split("\n")
      .map((line) => line.replace(/^-\s+(.*)$/, "<li>$1</li>"))
      .join("");
    return `<ul>${items}</ul>`;
  });

  html = html.replace(/\n\n+/g, "<br><br>");
  return html;
}

/** ~200 words/min reading time estimate. */
export function readingTime(md: string): number {
  const words = md.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

/**
 * Strips a YAML-ish front-matter block from a fetched Markdown file, if
 * present. posts.json is the source of truth for title/date/tags — this
 * only needs to remove the block so it isn't rendered as body text.
 */
export function stripFrontMatter(raw: string): string {
  const match = raw.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*(?:\r?\n)?/);
  return match ? raw.replace(match[0], "").trim() : raw;
}
