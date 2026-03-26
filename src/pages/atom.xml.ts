import type { APIRoute } from "astro";
import { config } from "../config";
import { getFeedItems } from "../utils/feed";

function escapeXml(str: string): string {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export const GET: APIRoute = async (context) => {
  const items = getFeedItems();
  const siteUrl = context.site
    ? new URL(context.site).toString().replace(/\/$/, "")
    : "http://localhost";
  const updated = items.length > 0 ? items[0].pubDate.toISOString() : new Date().toISOString();

  const entries = items
    .map(
      (item) => `  <entry>
    <title>${escapeXml(item.title)}</title>
    <link href="${siteUrl}${item.link}" rel="alternate" type="text/html"/>
    <id>${siteUrl}${item.link}</id>
    <updated>${item.pubDate.toISOString()}</updated>
    <summary>${escapeXml(item.description)}</summary>
  </entry>`
    )
    .join("\n");

  const atom = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(config.title)}</title>
  <subtitle>${escapeXml(config.description)}</subtitle>
  <link href="${siteUrl}/atom.xml" rel="self" type="application/atom+xml"/>
  <link href="${siteUrl}/" rel="alternate" type="text/html"/>
  <id>${siteUrl}/</id>
  <updated>${updated}</updated>
  <author>
    <name>${escapeXml(config.author.name)}</name>
  </author>
${entries}
</feed>
`;

  return new Response(atom, {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8",
    },
  });
};
