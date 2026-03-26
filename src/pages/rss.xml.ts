import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import { config } from "../config";
import { getFeedItems, resolveSiteUrl } from "../utils/feed";
import { withBase } from "../utils/url";

export const GET: APIRoute = async (context) => {
  const items = await getFeedItems();
  const siteUrl = resolveSiteUrl(context);

  const rssItems = items.map((item) => ({
    title: item.title,
    description: item.description,
    pubDate: item.pubDate,
    link: item.link,
    ...(item.content && { content: item.content }),
  }));
  return rss({
    title: config.title,
    description: config.description,
    site: context.site || new URL(config.siteUrl),
    items: rssItems,
    customData: `
      <language>en-gb</language>
      <atom:link href="${siteUrl}${withBase("rss.xml")}" rel="self" type="application/rss+xml" xmlns:atom="http://www.w3.org/2005/Atom"/>
    `,
  });
};
