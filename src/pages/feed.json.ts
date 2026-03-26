import type { APIRoute } from "astro";
import { config } from "../config";
import { getFeedItems } from "../utils/feed";

export const GET: APIRoute = async (context) => {
  const items = getFeedItems();
  const siteUrl = context.site
    ? new URL(context.site).toString().replace(/\/$/, "")
    : "http://localhost";

  const feed = {
    version: "https://jsonfeed.org/version/1.1",
    title: config.title,
    description: config.description,
    home_page_url: `${siteUrl}/`,
    feed_url: `${siteUrl}/feed.json`,
    language: "en-GB",
    authors: [{ name: config.author.name }],
    items: items.map((item) => ({
      id: `${siteUrl}${item.link}`,
      url: `${siteUrl}${item.link}`,
      title: item.title,
      summary: item.description,
      date_published: item.pubDate.toISOString(),
    })),
  };

  return new Response(JSON.stringify(feed, null, 2), {
    headers: {
      "Content-Type": "application/feed+json; charset=utf-8",
    },
  });
};
