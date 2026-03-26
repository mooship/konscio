import type { APIRoute } from "astro";
import { config } from "../config";
import { escapeXml, getFeedItems, resolveSiteUrl } from "../utils/feed";
import { withBase } from "../utils/url";

export const GET: APIRoute = async (context) => {
  const items = await getFeedItems();
  const siteUrl = resolveSiteUrl(context);
  const updated = items.length > 0 ? items[0].pubDate.toISOString() : new Date().toISOString();
  const selfUrl = `${siteUrl}${withBase("atom.xml")}`;
  const alternateUrl = `${siteUrl}${withBase("")}`;

  const entries = items
    .map(
      (item) => `  <entry>
    <title>${escapeXml(item.title)}</title>
    <link href="${siteUrl}${item.link}" rel="alternate" type="text/html"/>
    <id>${siteUrl}${item.link}</id>
    <updated>${item.pubDate.toISOString()}</updated>
    <summary>${escapeXml(item.description)}</summary>${item.content ? `\n    <content type="html"><![CDATA[${item.content}]]></content>` : ""}
  </entry>`
    )
    .join("\n");

  const atom = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(config.title)}</title>
  <subtitle>${escapeXml(config.description)}</subtitle>
  <link href="${selfUrl}" rel="self" type="application/atom+xml"/>
  <link href="${alternateUrl}" rel="alternate" type="text/html"/>
  <id>${alternateUrl}</id>
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
