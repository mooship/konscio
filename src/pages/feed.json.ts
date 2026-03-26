import type { APIRoute } from "astro";
import { config } from "../config";
import { getFeedItems, resolveSiteUrl } from "../utils/feed";
import { withBase } from "../utils/url";

export const GET: APIRoute = async (context) => {
  const items = await getFeedItems();
  const siteUrl = resolveSiteUrl(context);

  const feed = {
    version: "https://jsonfeed.org/version/1.1",
    title: config.title,
    description: config.description,
    home_page_url: `${siteUrl}${withBase("")}`,
    feed_url: `${siteUrl}${withBase("feed.json")}`,
    language: "en-GB",
    authors: [{ name: config.author.name }],
    items: items.map((item) => ({
      id: `${siteUrl}${item.link}`,
      url: `${siteUrl}${item.link}`,
      title: item.title,
      summary: item.description,
      content_html: item.content,
      date_published: item.pubDate.toISOString(),
    })),
  };

  return new Response(JSON.stringify(feed, null, 2), {
    headers: {
      "Content-Type": "application/feed+json; charset=utf-8",
    },
  });
};
