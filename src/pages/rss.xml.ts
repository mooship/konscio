import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import { config } from "../config";
import { getFeedItems } from "../utils/feed";

export const GET: APIRoute = async (context) => {
  const items = getFeedItems();
  const siteUrl = context.site ? new URL(context.site).toString() : "/";

  return rss({
    title: config.title,
    description: config.description,
    site: context.site || new URL("http://localhost"),
    items,
    customData: `
      <language>en-gb</language>
      <atom:link href="${siteUrl}rss.xml" rel="self" type="application/rss+xml" xmlns:atom="http://www.w3.org/2005/Atom"/>
    `,
  });
};
